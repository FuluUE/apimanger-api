/* eslint-disable no-unused-expressions */
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
import { Note } from '../../src/models';
import user from '../data/user';

const request = supertest.agent(app.listen());
describe('note', () => {
  // before all the tests run, log in
  before((done) => {
    request
      .post('/api/account/signin')
      .send(user)
      .end((err, res) => {
        if (err) { return done(err); }

        expect(res.body).to.have.property('code').with.to.equal(0);

        done();
      });
  });

  // In this test it's expected a project list
  describe('GET /api/note', () => {
    it('return a list of notes', (done) => {
      request
        .get('/api/note')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('code').with.to.equal(0);
          expect(res.body).to.have.property('data').with.to.be.an('array');
          done(err);
        });
    });
  });

  // Testing the save project
  // describe('POST /api/project', () => {
  //   it('save a new note faild, name is required', (done) => {
  //     request.post('/api/project')
  //       .send({})
  //       .expect(200)
  //       .end((err, res) => {
  //         expect(res.body).to.have.property('code').with.to.equal(1101);
  //         done(err);
  //       });
  //   });
  //   it('save a new project faild, version is required', (done) => {
  //     request.post('/api/project')
  //       .send({ name: 'test' })
  //       .expect(200)
  //       .end((err, res) => {
  //         expect(res.body).to.have.property('code').with.to.equal(1102);
  //         done(err);
  //       });
  //   });
  //   it('save a new project faild, base url invalid', (done) => {
  //     const invalidBaseUrls = ['http://github.com foo bar',
  //       'www.github.com foo bar', 'test', 'www.git.com', '192.168.1.8'];
  //     let count = 0;
  //     invalidBaseUrls.forEach(item => {
  //       request.post('/api/project')
  //         .send({ name: 'test', version: '1.0.0', baseUrl: item })
  //         .expect(200)
  //         .end((err, res) => {
  //           expect(res.body).to.have.property('code').with.to.equal(1103);
  //           count += 1;
  //           if (count === invalidBaseUrls.length) {
  //             done();
  //           }
  //         });
  //     });
  //   });

  //   it('save a new project succeed no base url', (done) => {
  //     const project = { name: 'test', version: '1.0.0' };
  //     request.post('/api/project')
  //       .send(project)
  //       .expect(200)
  //       .end((err, res) => {
  //         expect(res.body).to.have.property('code').with.to.equal(0);
  //         expect(res.body.data).to.include(project);
  //         done(err);
  //       });
  //   });

  //   it('save a new project succeed', (done) => {
  //     const baseUrls = ['http://test.cc', 'https://test.cc', 'http://192.168.1.8', 'https://192.168.1.8'];
  //     let count = 0;
  //     baseUrls.forEach(item => {
  //       const project = { name: 'test', version: '1.0.0', baseUrl: item };
  //       request.post('/api/project')
  //         .send(project)
  //         .expect(200)
  //         .end((err, res) => {
  //           expect(res.body).to.have.property('code').with.to.equal(0);
  //           expect(res.body.data).to.include(project);
  //           count += 1;
  //           if (count === baseUrls.length) {
  //             done();
  //           }
  //         });
  //     });
  //   });
  // });


  // // Test find a project by id
  // describe('GET /api/project/:id', () => {
  //   // Testing how to find a project by id
  //   it('returns a project by id', (done) => {
  //     request
  //       .get('/api/project')
  //       .expect(200)
  //       .end((_, resAll) => {
  //         const project = resAll.body.data[0];
  //         request.get(`/api/project/${project.id}`)
  //           .expect(200)
  //           .end((err, res) => {
  //             expect(res.body).to.have.property('code').with.to.equal(0);
  //             expect(res.body.data).to.include(project);
  //             done(err);
  //           });
  //       });
  //   });

  //   // Testing the code 1104 for project not found
  //   it('return code 1104 when id is not found', (done) => {
  //     request.get('/api/project/fakeId')
  //       .expect(200)
  //       .end((err, res) => {
  //         expect(res.body).to.have.property('code').with.to.equal(1104);
  //         done(err);
  //       });
  //   });
  // });

  // // Testing how to update a project
  // describe('PUT /api/project/:id', () => {
  //   const src = { name: 'test', version: '1.0.0', baseUrl: 'http://test.cc' };
  //   it('return code 1104 when id is invalid', (done) => {
  //     request.put('/api/project/fakeId')
  //       .expect(200)
  //       .end((err, res) => {
  //         expect(res.body).to.have.property('code').with.to.equal(1104);
  //         done(err);
  //       });
  //   });
  //   it('return code 1104 when id is not found', (done) => {
  //     request.put('/api/project/595516e327781cf5cd16cf6d')
  //       .expect(200)
  //       .send(src)
  //       .end((err, res) => {
  //         expect(res.body).to.have.property('code').with.to.equal(1104);
  //         done(err);
  //       });
  //   });
  //   it('update a new project faild, name is required', (done) => {
  //     request.put('/api/project/595516e327781cf5cd16cf6d')
  //       .send({})
  //       .expect(200)
  //       .end((err, res) => {
  //         expect(res.body).to.have.property('code').with.to.equal(1101);
  //         done(err);
  //       });
  //   });
  //   it('update a project', async () => {
  //     let project = await Project.findOne();
  //     const res = await request.put(`/api/project/${project.id}`)
  //       .send(src);
  //     expect(res.body).to.have.property('code').with.to.equal(0);
  //     expect(res.body.data).to.include(src);
  //     project = await Project.findOne({ id: project.id });
  //     expect(project).to.include(src);
  //   });
  //   // const project = { name: 'test', version: '1.0.0', baseUrl: item };
  //   // it('updates a project', (done) => {
  //   //   var task = app.db('tasks').first();
  //   //   request.put('/tasks/' + task.id)
  //   //     .send({
  //   //       title: 'travel',
  //   //       done: false
  //   //     })
  //   //     .expect(201)
  //   //     .end((err, res) => {
  //   //       done(err);
  //   //     });
  //   // });
  // });

  // // Testing how to delete a project
  // describe('DELETE /api/project/:id', () => {
  //   it('return code 1104 when id is not found', (done) => {
  //     request.delete('/api/project/fakeId')
  //       .expect(200)
  //       .end((err, res) => {
  //         expect(res.body).to.have.property('code').with.to.equal(1104);
  //         done(err);
  //       });
  //   });

  //   it('removes a project', async () => {
  //     let project = await Project.findOne();
  //     const res = await request.delete(`/api/project/${project.id}`);
  //     expect(res.body).to.have.property('code').with.to.equal(0);
  //     project = await Project.findOne({ id: project.id });
  //     expect(project).to.be.null;
  //   });
  // });
});
