import { expect } from 'chai';
import md5 from '../../src/utils/md5';

describe('md5', () => {
  it('md5 encrypt invalid params, should throw', (done) => {
    expect(() => { md5() }).to.throw('Data must be a string or a buffer');
    done();
  });

  it('md5 encrypt succeed', (done) => {
    expect(md5('123456')).to.equal('e10adc3949ba59abbe56e057f20f883e');
    done();
  });
});
