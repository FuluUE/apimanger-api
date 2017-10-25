import { expect } from 'chai';
import email from '../../src/utils/email';

describe('email', () => {
  it('send email succeed', (done) => {
    email({ to: 'kk@gamail.com' }).then((res) => {
      expect(res).to.have.property('response').with.to.equal('250 Data Ok: queued as freedom');
      done();
    });
  });
  it('send email failed', () => (email({ to: '' }).catch((error) => {
    expect(error.message).to.equal('No recipients defined');
  })));
});
