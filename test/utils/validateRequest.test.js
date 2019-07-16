import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import checkAuthBody from '../../lib/utils/validateRequest';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('validators', () => {
  describe('checkAuthBody', () => {
    it('should validate correct object', () =>
      expect(checkAuthBody({ username: 'Michael', password: 'Bloody' })).to.be.fulfilled);

    it('should not validate if username not been set', () =>
      expect(checkAuthBody({ password: 'Bloody' })).to.be.rejectedWith(
        'validation handler: invalid user/pass provided',
      ));

    it('should not validate if password not been set', () =>
      expect(checkAuthBody({ username: 'Michael' })).to.be.rejectedWith(
        'validation handler: invalid user/pass provided',
      ));

    it('should not validate if ussername and password not been set', () =>
      expect(checkAuthBody({})).to.be.rejectedWith('validation handler: invalid user/pass provided'));

    it('should not validate no params set', () =>
      expect(checkAuthBody()).to.be.rejectedWith('validation handler: invalid user/pass provided'));
  });
});
