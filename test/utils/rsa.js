import { expect } from 'chai';
import { encrypt, decrypt } from '../../src/utils/rsa';

describe('rsa', () => {
  it('rsa encrypt, decrypt succeed', (done) => {
    expect(decrypt(encrypt('123456'))).to.equal('123456');
    done();
  });
});
