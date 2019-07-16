import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import { MongoClient } from 'mongodb';
import DataInterface from '../../lib/controllers/DataInterface';

/* eslint function-paren-newline: "off" */

const { expect } = chai;
chai.use(chaiAsPromised);

const userPassFixture = {
  username: 'username',
  password: 'password',
};

const badPassFixture = {
  username: 'username',
  password: 'password2',
};

const noUserFoundFixture = {
  username: null,
};

const correctResponseFixture = {
  username: 'username',
  password: 'password',
  permissions: ['abcdef1234567890abcdef12', 'abcdef1234567890abcdef13'],
};

describe('DataInterface', () => {
  let sandbox;
  let createDBResposeFixture;

  before(() => {
    sandbox = sinon.createSandbox({});
    createDBResposeFixture = userFixture => {
      const collectionStub = sandbox.stub();
      collectionStub.withArgs('auth-users').returns({
        createIndex: sandbox.stub().resolves(),
        findOne: sandbox.stub().resolves(userFixture),
      });

      collectionStub.withArgs('auth-permissions').returns({
        createIndex: sandbox.stub().resolves(),
        findOne: sandbox.stub().resolves({
          name: 'permision-name',
        }),
      });

      return {
        db: sandbox.stub().returns({
          createCollection: sandbox.stub().resolves(),
          collection: collectionStub,
        }),
      };
    };
    sinon.stub(process, 'env').value({
      MONGO_HOST: 'localhost',
      MONGO_PORT: '1111',
      MONGO_DB: 'db',
    });
  });

  after(() => {
    sandbox.restore();
  });

  describe('when mongoConnect is called', () => {
    it('should return an object with retrievePermissions function', () => {
      sandbox.stub(MongoClient, 'connect').callsFake((url, options, fn) => {
        fn(null, createDBResposeFixture(correctResponseFixture));
      });
      return DataInterface.mongoConnect().then(di => {
        expect(di).to.have.property('retrievePermissions');
        expect(di.retrievePermissions).to.be.a('function');
      });
    });

    it('should rejects if no username found', () => {
      MongoClient.connect.restore();
      sandbox.stub(MongoClient, 'connect').callsFake((url, options, fn) => {
        fn(null, createDBResposeFixture(noUserFoundFixture));
      });
      return DataInterface.mongoConnect().then(di =>
        di.retrievePermissions(userPassFixture).catch(user => {
          expect(user.username).to.be.null();
        }),
      );
    });

    it('should rejects if no password is different found', () => {
      MongoClient.connect.restore();
      sandbox.stub(MongoClient, 'connect').callsFake((url, options, fn) => {
        fn(null, createDBResposeFixture(badPassFixture));
      });
      return DataInterface.mongoConnect().then(di =>
        di.retrievePermissions(userPassFixture).catch(user => {
          expect(user.username).to.be.equal(badPassFixture.username);
        }),
      );
    });

    it('should resolves with permissions if correct username and password provided', () => {
      MongoClient.connect.restore();
      sandbox.stub(MongoClient, 'connect').callsFake((url, options, fn) => {
        fn(null, createDBResposeFixture(correctResponseFixture));
      });
      return DataInterface.mongoConnect().then(di =>
        di.retrievePermissions(userPassFixture).then(permissions => {
          expect(permissions)
            .to.be.an('array')
            .to.deep.equal(['permision-name', 'permision-name']);
        }),
      );
    });
  });
});
