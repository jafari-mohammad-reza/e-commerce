const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../test.index');
const mongoose = require('mongoose');
chai.should();
chai.use(chaiHttp);
let superAdmin;
let simpleAdmin;
let permission;
before(async () => {
  superAdmin = await mongoose.model('user').findOne({Role: 'SUPERADMIN'}, {accessToken: 1, _id: 1});
  simpleAdmin = await mongoose.model('user').findOne({Role: 'ADMIN'}, {accessToken: 1, _id: 1});
  permission = await mongoose.model('permission').findOne({title: 'test-permisison'}, {_id: 1});
});
describe('Permission controller test', function() {
  describe('Get all permissions', function() {
    it('should return status 200 and all permissions', function(done) {
      chai.request(server).get('/admin/permissions').set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body.permissions).length.greaterThan(0);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('Get one permission by id', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).get(`/admin/permissions/${permission._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body).not.undefined;
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 404 ', function(done) {
      chai.request(server).get(`/admin/permissions/${superAdmin._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (not valid id)', function(done) {
      chai.request(server).get(`/admin/permissions/${permission._id.toString() + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('createPermission', function() {
    it('should return status-code 201', function(done) {
      const permission = {
        title: 'test-permission',
        description: 'test permission',
      };
      chai.request(server).post(`/admin/permissions/`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(permission).then((response) => {
        chai.expect(response.status).eq(201);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (title not defined)', function(done) {
      const permission = {
        description: 'test permission',
      };
      chai.request(server).post(`/admin/permissions/`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(permission).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (title is alreay defined)', function(done) {
      const permission = {
        title: 'all',
        description: 'test permission',
      };
      chai.request(server).post(`/admin/permissions/`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(permission).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 403 (not SUPERADMIN)', function(done) {
      const permission = {
        title: 'new-permission',
        description: 'test permission',
      };
      chai.request(server).post(`/admin/permissions/`).set('authorization', `Bearer ${simpleAdmin.accessToken}`).send(permission).then((response) => {
        chai.expect(response.status).eq(403);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('update', function() {
    it('should return status-code 200', function(done) {
      const bodyPermission = {
        title: 'new-test-updated-2',
        description: 'test permission',
      };
      chai.request(server).put(`/admin/permissions/${permission._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyPermission).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (title not defined)', function(done) {
      const bodyPermission = {
        description: 'new test permission',
      };
      chai.request(server).put(`/admin/permissions/${permission._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyPermission).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (title  defined before)', function(done) {
      const bodyPermission = {
        title: 'all',
        description: 'test permission',
      };
      chai.request(server).put(`/admin/permissions/${permission._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyPermission).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (permission not found)', function(done) {
      const bodyPermission = {
        title: 'all',
        description: 'test permission',
      };
      chai.request(server).put(`/admin/permissions/${superAdmin._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyPermission).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (permission id is not valid)', function(done) {
      const bodyPermission = {
        title: 'all',
        description: 'test permission',
      };
      chai.request(server).put(`/admin/permissions/${superAdmin._id.toString() + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyPermission).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
  describe('delete', function() {
    it('should return status-code 200', function(done) {
      const bodyPermission = {
        title: 'new-test-updated-2',
        description: 'test permission',
      };
      chai.request(server).delete(`/admin/permissions/${permission._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyPermission).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });

    it('should return status-code 404 (permission not found)', function(done) {
      const bodyPermission = {
        title: 'all',
        description: 'test permission',
      };
      chai.request(server).delete(`/admin/permissions/${superAdmin._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyPermission).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
    it('should return status-code 400 (permission id is not valid)', function(done) {
      const bodyPermission = {
        title: 'all',
        description: 'test permission',
      };
      chai.request(server).delete(`/admin/permissions/${superAdmin._id.toString() + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyPermission).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err.message);
      });
    });
  });
});
