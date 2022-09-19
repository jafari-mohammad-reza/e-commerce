const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../test.index');
const mongoose = require('mongoose');
chai.should();
chai.use(chaiHttp);
let superAdmin;
let simpleAdmin;
let permission;
let role;
before(async () => {
  superAdmin = await mongoose.model('user').findOne({Role: 'SUPERADMIN'}, {accessToken: 1, _id: 1});
  simpleAdmin = await mongoose.model('user').findOne({Role: 'ADMIN'}, {accessToken: 1, _id: 1});
  permission = await mongoose.model('permission').findOne({title: 'test-permission'}, {_id: 1});
  role = await mongoose.model('role').findOne({'title': {'$regex': 'NEW-ROLE', '$options': 'i'}}, {_id: 1});
});

describe('Role controller ', function() {
  describe('Get all roles', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).get('/admin/roles').set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body.roles).length.greaterThan(0);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
  describe('Get role by id', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).get(`/admin/roles/${role._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 404', function(done) {
      chai.request(server).get(`/admin/roles/${superAdmin._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(404); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 400 (not a valid id)', function(done) {
      chai.request(server).get(`/admin/roles/${role._id.toString() + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
  describe('Create new role', function() {
    it('should return status-code 201', function(done) {
      const role = {
        title: 'new-role',
        permissions: [permission._id],
      };
      chai.request(server).post(`/admin/roles/`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(role).then((response) => {
        chai.expect(response.status).eq(201); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 400 (Role with this title already exist)', function(done) {
      const role = {
        title: 'admin',
        permissions: [permission._id],
      };
      chai.request(server).post(`/admin/roles/`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(role).then((response) => {
        chai.expect(response.status).eq(400); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 400 (title is undefined)', function(done) {
      const role = {
        permissions: [permission._id],
      };
      chai.request(server).post(`/admin/roles/`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(role).then((response) => {
        chai.expect(response.status).eq(400); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 400 (title is undefined)', function(done) {
      const role = {
        title: 'some-role',
        permissions: [],
      };
      chai.request(server).post(`/admin/roles/`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(role).then((response) => {
        chai.expect(response.status).eq(400); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
  describe('Update exist role', function() {
    it('should return status-code 200', function(done) {
      const bodyRole = {
        title: 'new-role-updated-6',
        permissions: [permission._id],
      };
      chai.request(server).put(`/admin/roles/${role._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyRole).then((response) => {
        chai.expect(response.status).eq(200); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 400 (Role with this title already exist)', function(done) {
      const bodyRole = {
        title: 'admin',
        permissions: [permission._id],
      };
      chai.request(server).put(`/admin/roles/${role._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyRole).then((response) => {
        chai.expect(response.status).eq(400); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 400 (id is not valid)', function(done) {
      const bodyRole = {
        title: 'some-role',
        permissions: [permission._id],
      };
      chai.request(server).put(`/admin/roles/${role._id.toString() + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyRole).then((response) => {
        chai.expect(response.status).eq(400); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 404 (no role with this id)', function(done) {
      const bodyRole = {
        title: 'some-role',
        permissions: [permission._id],
      };
      chai.request(server).put(`/admin/roles/${superAdmin._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).send(bodyRole).then((response) => {
        chai.expect(response.status).eq(404); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 403 (non super admin)', function(done) {
      const bodyRole = {
        title: 'some-role',
        permissions: [permission._id],
      };
      chai.request(server).put(`/admin/roles/${role._id.toString()}`).set('authorization', `Bearer ${simpleAdmin.accessToken}`).send(bodyRole).then((response) => {
        chai.expect(response.status).eq(403); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
  describe('Delete role', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).delete(`/admin/roles/${role._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 404', function(done) {
      chai.request(server).delete(`/admin/roles/${superAdmin._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(404); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 400 (not a valid id)', function(done) {
      chai.request(server).delete(`/admin/roles/${role._id.toString() + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400); done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
});
