import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../lib/app';

chai.use(chaiHttp);
chai.should();

describe('Things', () => {
  describe('GET /', () => {
    it('should get all things record', done => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should get a single thing record', done => {
      const id = 1;
      chai
        .request(app)
        .get(`/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should not get a thing student record', done => {
      const id = 5;
      chai
        .request(app)
        .get(`/${id}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
