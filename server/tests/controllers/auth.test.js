const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../test.index');
const mongoose = require('mongoose');
chai.should();
chai.use(chaiHttp);
let userWithToken;
before(async () => {
  userWithToken = await mongoose.model('user').findOne({accessToken: {$ne: undefined}});
});
describe('Test Auth controller', function() {
  describe('Login Function', function() {
    it('should Return status code 200', function(done) {
      chai.request(server).post('/api/v1/auth/email/login').send({email: 'mohammadrezajafari419@gmail.com', password: 'Mohammad123'}).then(( response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should Return status code 404', function(done) {
      chai.request(server).post('/api/v1/auth/email/login').send({email: 'mohammadrezajafari.dev@gmail.com', password: 'Mohammad123'}).then(( response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should Return status code 400', function(done) {
      chai.request(server).post('/api/v1/auth/email/login').send({email: 'mohammadrezajafari562@gmail.com', password: 'Mohammad123'}).then(( response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should Return status code 403', function(done) {
      chai.request(server).post('/api/v1/auth/email/login').send({email: 'alireza@gmail.com', password: 'Mohammad123'}).then(( response) => {
        chai.expect(response.status).eq(403);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Register Function', function() {
    it('should return statuscode 201', function(done) {
      const user = {
        username: 'JohnDoe',
        email: 'JohnDoe@gmail.com',
        password: 'JohnDoe123',
        confirmPassword: 'JohnDoe123',
      };
      chai.request(server).post('/api/v1/auth/email/register').send(user).then((response) => {
        chai.expect(response.status).eq(201);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 500 (Not valid input)', function(done) {
      const user = {
        username: 'JohnDoe$',
        email: 'JohnDoe@dmail.com',
        password: 'JohnDoe123',
        confirmPassword: 'JohnDoe123',
      };
      chai.request(server).post('/api/v1/auth/email/register').send(user).then((response) => {
        chai.expect(response.status).eq(500);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 405 (exist user)', function(done) {
      const user = {
        username: 'JohnDoe',
        email: 'JohnDoe@yahoo.com',
        password: 'JohnDoe123',
        confirmPassword: 'JohnDoe123',
      };
      chai.request(server).post('/api/v1/auth/email/register').send(user).then((response) => {
        chai.expect(response.status).eq(405);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 405 (exist user)', function(done) {
      const user = {
        username: 'JohnDoee',
        email: 'JohnDoe@gmail.com',
        password: 'JohnDoe123',
        confirmPassword: 'JohnDoe123',
      };
      chai.request(server).post('/api/v1/auth/email/register').send(user).then((response) => {
        chai.expect(response.status).eq(405);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Verify account Function', function() {
    it('should return statuscode 200', function(done) {
      chai.request(server).post('/api/v1/auth/email/verify-account').send({code: 'cbe3c2b5'}).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 400 (Not valid code)', function(done) {
      chai.request(server).post('/api/v1/auth/email/verify-account').send({code: '12345'}).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 400 (Not valid code)', function(done) {
      chai.request(server).post('/api/v1/auth/email/verify-account').send({code: ''}).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 404 (Not valid code)', function(done) {
      chai.request(server).post('/api/v1/auth/email/verify-account').send({code: '12345678'}).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Get reset password Function', function() {
    it('should return statuscode 200', function(done) {
      chai.request(server).post('/api/v1/auth/email/forgot-password').send({email: 'alireza@gmail.com'}).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 500 (Not valid email)', function(done) {
      chai.request(server).post('/api/v1/auth/email/forgot-password').send({email: 'mohammadrezajafari.dev@hotmail.com'}).then((response) => {
        chai.expect(response.status).eq(500);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 500 (no email in request body)', function(done) {
      chai.request(server).post('/api/v1/auth/email/forgot-password').send({}).then((response) => {
        chai.expect(response.status).eq(500);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 404 (Not a exist email)', function(done) {
      chai.request(server).post('/api/v1/auth/email/forgot-password').send({email: 'mohammadrezajafaridev@gmail.com'}).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 406 (user that has changed password more than 3 times)', function(done) {
      chai.request(server).post('/api/v1/auth/email/forgot-password').send({email: 'mohammadrezajafari562@gmail.com'}).then((response) => {
        chai.expect(response.status).eq(406);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 406 (user that has changed password in last 30 days and should wait)', function(done) {
      chai.request(server).post('/api/v1/auth/email/forgot-password').send({email: 'johndoe@gmail.com'}).then((response) => {
        chai.expect(response.status).eq(406);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Reset password Function', function() {
    it('should return statuscode 200', function(done) {
      chai.request(server).post(`/api/v1/auth/email/reset-password/${userWithToken.accessToken}`).send({password: 'Mohammad1234', confirmPassword: 'Mohammad1234'}).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 500 (Not valid input)', function(done) {
      chai.request(server).post(`/api/v1/auth/email/reset-password/${userWithToken.accessToken.replace('e', 'd')}`).send({password: 'Mohammad12344', confirmPassword: 'Mohammad13234'}).then((response) => {
        chai.expect(response.status).eq(500);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 401 (no user)', function(done) {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tyJwYXlsb2FkIjoibW9oYW1tYWRyZXphamFmYXJpNDE5QGdtYWlsLmNvbSIsImlhdCI6MTY2MzU2NzAyMiwiZXhwIjoxNjYzNTcwNjIyfQ.Vwc0eU-inP5-OkCcezIm8aqMnXz4ur6YWZ5asTUqO-k';
      chai.request(server).post(`/api/v1/auth/email/reset-password/${token}`).send({password: 'Mohammad1234', confirmPassword: 'Mohammad1234'}).then((response) => {
        chai.expect(response.status).eq(401);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 400 (same password as old one)', function(done) {
      chai.request(server).post(`/api/v1/auth/email/reset-password/${userWithToken.accessToken}`).send({password: 'Mohammad123', confirmPassword: 'Mohammad123'}).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 406 (user that has changed password more than 3 times)', function(done) {
      chai.request(server).post('/api/v1/auth/email/forgot-password').send({email: 'mohammadrezajafari562@gmail.com'}).then((response) => {
        chai.expect(response.status).eq(406);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Logout Function', function() {
    it('should return statuscode 200', function(done) {
      chai.request(server).post('/api/v1/auth/email/logout').set('authorization', `Bearer ${userWithToken.accessToken}`).send().then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 500 (not a valid token)', function(done) {
      chai.request(server).post('/api/v1/auth/email/logout').set('authorization', `Bearer ${userWithToken.accessToken.replace('e', 'd')}`).send().then((response) => {
        chai.expect(response.status).eq(500);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 401 (unauthorized)', function(done) {
      chai.request(server).post('/api/v1/auth/email/logout').set('accept', 'application/json').send().then((response) => {
        chai.expect(response.status).eq(401);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return statuscode 406 (token is expired)', function(done) {
      chai.request(server).post('/api/v1/auth/email/logout').set('authorization', `Bearer ${userWithToken.accessToken}`).send().then((response) => {
        chai.expect(response.status).eq(406);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Get OTP Function', function() {
    it('should Return status 200', function(done) {
      chai.request(server).post('/api/v1/auth/mobile/get-otp').send({mobile: '989037418138'}).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should Return status 500 invalid mobile number', function(done) {
      chai.request(server).post('/api/v1/auth/mobile/get-otp').send({mobile: '90374181385'}).then((response) => {
        chai.expect(response.status).eq(500);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Validate OTP Function', function() {
    it('should Return status 200', function(done) {
      chai.request(server).post('/api/v1/auth/mobile/validate-otp').send({mobile: '989037418138', otp: '552397'}).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should Return status 500 invalid mobile number', function(done) {
      chai.request(server).post('/api/v1/auth/mobile/validate-otp').send({mobile: '90374181385', otp: '480879'}).then((response) => {
        chai.expect(response.status).eq(500);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should Return status 500 invalid otp code', function(done) {
      chai.request(server).post('/api/v1/auth/mobile/validate-otp').send({mobile: '989037418138', otp: '48084379'}).then((response) => {
        chai.expect(response.status).eq(500);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should Return status 404 (not exist mobilenumber)', function(done) {
      chai.request(server).post('/api/v1/auth/mobile/validate-otp').send({mobile: '989047418138', otp: '480879'}).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should Return status 404 (not exist otp)', function(done) {
      chai.request(server).post('/api/v1/auth/mobile/validate-otp').send({mobile: '989037418138', otp: '480878'}).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should Return status 400 (expired otp)', function(done) {
      chai.request(server).post('/api/v1/auth/mobile/validate-otp').send({mobile: '989047418138', otp: '480875'}).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
});
