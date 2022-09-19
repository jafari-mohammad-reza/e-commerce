const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../test.index');
const {expect} = require('chai');
const mongoose = require('mongoose');
chai.should();
chai.use(chaiHttp);
let admin;
let simpleAdmin;
let user;
let counter;
before(async () => {
  admin = await mongoose.model('user').findOne({Role: 'SUPERADMIN'}, {accessToken: 1, _id: 1});
  simpleAdmin = await mongoose.model('user').findOne({Role: 'ADMIN'}, {accessToken: 1, _id: 1});
  counter = await mongoose.model('user').findOne({Role: 'COUNTER'}, {accessToken: 1, _id: 1});
  user = await mongoose.model('user').findOne({Role: 'USER'}, {accessToken: 1, _id: 1});
});
describe('User controller test', function() {
  describe('Get all users', function() {
    it('should return status-code 200', function(done) {
      console.log(admin);
      chai.request(server).get('/admin/users/').set('authorization', `Bearer ${admin.accessToken}`).then(( response) => {
        expect(response.status).eq(200);
        expect(response.body.users).be.instanceof(Array);
        expect(response.body.success).eq(true);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 401 (unauthorized)', function(done) {
      chai.request(server).get('/admin/users/').then(( response) => {
        expect(response.status).eq(401);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 403 (not allowed)', function(done) {
      chai.request(server).get('/admin/users/').set('authorization', `Bearer ${user.accessToken}`).then(( response) => {
        expect(response.status).eq(403);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 200 and a user that contains search parameters', function(done) {
      chai.request(server).get('/admin/users/').set('authorization', `Bearer ${admin.accessToken}`).query({search: 'john'}).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body.users).length.be.greaterThan(0);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
  describe('Get one by id', function() {
    it('should return status-code 200 and one user', function(done) {
      chai.request(server).get(`/admin/users/632801d6e51b621b2836e7c3`).set('authorization', `Bearer ${admin.accessToken}`).then( ( response) => {
        expect(response.status).eq(200);
        !expect(response.body.data).not.undefined;
        done();
      }).catch((err) => {
        console.log(err);
      });
    });
    it('should return status-code 404 and no user', function(done) {
      chai.request(server).get(`/admin/users/632801d6e57b621b2836e7c3`).set('authorization', `Bearer ${admin.accessToken}`).then( ( response) => {
        expect(response.status).eq(404);
        !expect(response.body.data).be.undefined;
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 401 (unauthorized)', function(done) {
      chai.request(server).get(`/admin/users/${user._id.toString()}`).then(( response) => {
        expect(response.status).eq(401);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 403 (not allowed)', function(done) {
      chai.request(server).get(`/admin/users/${user._id.toString()}`).set('authorization', `Bearer ${user.accessToken}`).then(( response) => {
        expect(response.status).eq(403);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('create user profile', function() {
    it('should return status-code 200 (with all credentials)', function(done) {
      const userData={
        username: 'mohammadrezajafari',
        email: 'mohammadrezajafari562@gmail.com',
        mobileNumber: '989123456789',
        Role: 'admin',
        password: 'Mohammad123',
      };
      chai.request(server).post('/admin/users').set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 200 (with email and username)', function(done) {
      const userData={
        username: 'mohammadrezajafari1',
        email: 'mohammadrezajafari5624@gmail.com',
        Role: 'admin',
        password: 'Mohammad123',
      };
      chai.request(server).post('/admin/users').set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 200 (with mobile number)', function(done) {
      const userData={
        mobileNumber: '989123456784',
        Role: 'admin',
        password: 'Mohammad123',
      };
      chai.request(server).post('/admin/users').set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 200 (without password and role)', function(done) {
      const userData={
        username: 'mohammadrezajafari43',
        email: 'mohammadrezajafari562266@gmail.com',
        mobileNumber: '989125456384',
      };
      chai.request(server).post('/admin/users').set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (with out both email and mobileNumber)', function(done) {
      const userData={
        username: 'mohammadrexxx',
        password: 'Mohammad123',
      };
      chai.request(server).post('/admin/users').set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (email exist user)', function(done) {
      const userData={
        username: 'mohammadrezajafari.dev@gmail.com',
        password: 'Mohammad123',
      };
      chai.request(server).post('/admin/users').set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (mobileNumber exist user)', function(done) {
      const userData={
        mobileNumber: '989037418138',
        password: 'Mohammad123',
      };
      chai.request(server).post('/admin/users').set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 401 (invalid user)', function(done) {
      const userData={
        username: 'mohammadrezajafari',
        email: 'mohammadrezajafari562@gmail.com',
        mobileNumber: '989123456789',
        Role: 'admin',
        password: 'Mohammad123',
      };
      chai.request(server).post('/admin/users').set('authorization', `Bearer ${user.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(401);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Update user profile', function() {
    it('should return status-code 200 (with all credentials)', function(done) {
      const userData={
        username: 'mohammadrezajafari.developer',
        email: 'mohammadrezajafari.developer@gmail.com',
        mobileNumber: '989123456788',
        birthdate: new Date().getFullYear(),
        address: 'Tehran,Iran',
      };
      chai.request(server).put(`/admin/users/${user._id}`).set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 200 just email and username', function(done) {
      const userData={
        username: 'mohammadrezajafari.developers',
        email: 'mohammadrezajafari.developers@gmail.com',
      };
      chai.request(server).put(`/admin/users/${user._id}`).set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 200 just email and username', function(done) {
      const userData={
        mobileNumber: '989123456777',
        isPremium: true,
      };
      chai.request(server).put(`/admin/users/${user._id}`).set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 exits email', function(done) {
      const userData={
        mobileNumber: '989123456777',
        isPremium: true,
      };
      chai.request(server).put(`/admin/users/${user._id}`).set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 exits email', function(done) {
      const userData={
        email: 'mohammadrezajafari419@gmail.com',
        mobileNumber: '989123436777',
        isPremium: true,
      };
      chai.request(server).put(`/admin/users/${user._id}`).set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 exits username', function(done) {
      const userData={
        email: 'mohammadreza',
        mobileNumber: '989123436777',
        isPremium: true,
      };
      chai.request(server).put(`/admin/users/${user._id}`).set('authorization', `Bearer ${admin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 406 user is not SUPERADMIN and want to change role', function(done) {
      const userData={
        email: 'mohammadrezadd',
        mobileNumber: '989037418138',
        isPremium: true,
        Role: 'SUPPLIER',
      };
      chai.request(server).put(`/admin/users/${counter._id}`).set('authorization', `Bearer ${simpleAdmin.accessToken}`).send(userData).then((response) => {
        chai.expect(response.status).eq(406);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Ban user', function() {
    it('should return status-code 200 ', function(done) {
      chai.request(server).post(`/admin/users/ban-user/${user._id}`).set('authorization', `Bearer ${admin.accessToken}`).send().then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 406  (not a SUPERADMIN want to ban a not USER) ', function(done) {
      chai.request(server).post(`/admin/users/ban-user/${counter._id}`).set('authorization', `Bearer ${simpleAdmin.accessToken}`).send().then((response) => {
        chai.expect(response.status).eq(406);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
});
