import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/app';
import { encrypt } from '../src/utils/rsa';
import md5 from '../src/utils/md5';
import { User } from '../src/models';
import user from './data/user';

const testAddEmail = 'demo@gmail.com';

// add test user
async function init() {
  const count = await User.count();
  if (count === 0) {
    User.create({ email: user.email, name: 'test', avatar: 'test', reg_ip: 'test', password: md5(user.decryptPassword), is_actived: true });
  }
}
init();

const request = supertest.agent(app.listen());

describe('account', () => {
  before((done) => {
    User.findOneAndRemove({ email: testAddEmail }).then(() => {
      done();
    });
  });


  describe('with no credentials', () => {
    it('code should return 401', (done) => {
      request
        .get('/api/note')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(401);
          done(err);
        });
    });
  });

  describe('POST /api/account/signup', () => {
    it('signup failed, email invalid, code should return 1000', (done) => {
      request
        .post('/api/account/signup')
        .send({ email: 'aaa', password: 'a' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(1000);
          done(err);
        });
    });
    it('signup failed, password is null, code should return 2003', (done) => {
      request
        .post('/api/account/signup')
        .send({ email: testAddEmail })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(2003);
          done(err);
        });
    });
    it('signup failed, password unencrypted, code should return 2004', (done) => {
      request
        .post('/api/account/signup')
        .send({ email: testAddEmail, password: 'asd' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(2004);
          done(err);
        });
    });
    it('signup failed, password length is less than 6 bits, code should return 2005', (done) => {
      request
        .post('/api/account/signup')
        .send({ email: testAddEmail, password: encrypt('asd') })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(2005);
          done(err);
        });
    });

    it('signup succeed, code should return 0', (done) => {
      request
        .post('/api/account/signup')
        .send({ email: testAddEmail, password: encrypt('123456') })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(0);
          done(err);
        });
    });
  });

  describe('POST /api/account/signin', () => {
    it('signin failed, email invalid, code should return 1000', (done) => {
      request
        .post('/api/account/signin')
        .send({ email: 'aaa', password: 'a' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(1000);
          done(err);
        });
    });
    it('signin failed, password is null, code should return 2003', (done) => {
      request
        .post('/api/account/signin')
        .send({ email: testAddEmail })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(2003);
          done(err);
        });
    });
    it('signin failed, password unencrypted, code should return 2004', (done) => {
      request
        .post('/api/account/signin')
        .send({ email: testAddEmail, password: '123456' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(2004);
          done(err);
        });
    });

    it('signin failed, invalid user, code should return 2001', (done) => {
      request
        .post('/api/account/signin')
        .send({ email: testAddEmail, password: encrypt('132456') })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(2001);
          done(err);
        });
    });
  });

  describe('GET /api/account/active', () => {
    it('email invalid, code should return 1000', (done) => {
      request
        .get('/api/account/active?email=test')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(1000);
          done(err);
        });
    });
    it('active info invalid, code should return 2007', (done) => {
      request
        .get('/api/account/active?email=test@gg.com&token=123')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(2007);
          done(err);
        });
    });
  });

  describe('POST /api/account/active', () => {
    it('user not fonund, code should return 2002', (done) => {
      request
        .post('/api/account/active')
        .send({ email: 'test@ga.com' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(2002);
          done(err);
        });
    });

    it('send active email succeed, code should return 0', (done) => {
      request
        .post('/api/account/active')
        .send({ email: testAddEmail })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(0);
          done(err);
        });
    });
  });

  describe('POST /api/account/forgot', () => {
    it('email invalid, code should return 1000', (done) => {
      request
        .post('/api/account/forgot')
        .send({ email: 'test' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(1000);
          done(err);
        });
    });

    it('user not fonund, code should return 2002', (done) => {
      request
        .post('/api/account/forgot')
        .send({ email: 'test@ga.com' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(2002);
          done(err);
        });
    });

    it('find password succeed, code should return 0', (done) => {
      request
        .post('/api/account/forgot')
        .send({ email: testAddEmail })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(0);
          done(err);
        });
    });
  });
});
