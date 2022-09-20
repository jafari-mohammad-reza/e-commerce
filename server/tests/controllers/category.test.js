const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../test.index');
const mongoose = require('mongoose');
const {readFileSync} = require('fs');
const path = require('path');
chai.should();
chai.use(chaiHttp);
let superAdmin;
let category;
let parentCategory;
before(async () => {
  superAdmin = await mongoose.model('user').findOne({Role: 'SUPERADMIN'}, {accessToken: 1, _id: 1});
  category = await mongoose.model('category').findOne({parent: {$ne: undefined}}, {_id: 1, children: 1});
  parentCategory = await mongoose.model('category').findOne({parent: undefined}, {_id: 1, children: 1, title: 1});
});

describe('Category controller', function() {
  describe('Get all categories', function() {
    it('should return status-code 200 & list of all categories ', function(done) {
      chai.request(server).get('/admin/categories').set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body.categories).length.greaterThan(0);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 200 & list of all parent categories ', function(done) {
      chai.request(server).get('/admin/categories/parents').set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body.data).length.greaterThan(0);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
  describe('Get one category by id', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).get(`/admin/categories/${category._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body.data).not.undefined;
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 200 (parent category)', function(done) {
      chai.request(server).get(`/admin/categories/parents/${parentCategory._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        console.log(response.body);
        chai.expect(response.body.data).length.greaterThan(0);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 404', function(done) {
      chai.request(server).get(`/admin/categories/${superAdmin._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 400 (not a valid id)', function(done) {
      chai.request(server).get(`/admin/categories/${category._id + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
  describe('Create  category', function() {
    it('should return status-code 201 (with all parameters)', function(done) {
      chai.request(server).post(`/admin/categories/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category')
          .field('parent', category._id.toString())
          .attach('image',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png').then((response) => {
            chai.expect(response.status).eq(201);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 201 (with title and parent)', function(done) {
      chai.request(server).post(`/admin/categories/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category-1')
          .field('parent', category._id.toString())
          .then((response) => {
            chai.expect(response.status).eq(201);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 201 (with title and image)', function(done) {
      chai.request(server).post(`/admin/categories/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category-2')
          .attach('image',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(201);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 201 (with title )', function(done) {
      chai.request(server).post(`/admin/categories/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category-3')
          .then((response) => {
            chai.expect(response.status).eq(201);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 400 (exist title )', function(done) {
      chai.request(server).post(`/admin/categories/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category')
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 400 (not a valid parent )', function(done) {
      chai.request(server).post(`/admin/categories/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category-4')
          .field('parent', superAdmin._id.toString())
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
  });
  describe('Update  category', function() {
    it('should return status-code 200 (with all parameters)', function(done) {
      chai.request(server).put(`/admin/categories/${category._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category-updated')
          .field('parent', parentCategory._id.toString())
          .attach('image',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png').then((response) => {
            chai.expect(response.status).eq(200);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 200 (with title and parent)', function(done) {
      chai.request(server).put(`/admin/categories/${category._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category-u-1')
          .field('parent', parentCategory._id.toString())
          .then((response) => {
            chai.expect(response.status).eq(200);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 200 (with title and image)', function(done) {
      chai.request(server).put(`/admin/categories/${category._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category-u-2')
          .attach('image',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(200);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 200 (with title )', function(done) {
      chai.request(server).put(`/admin/categories/${category._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category-u-3')
          .then((response) => {
            chai.expect(response.status).eq(200);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 400 (exist title )', function(done) {
      chai.request(server).put(`/admin/categories/${category._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', parentCategory.title)
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
    it('should return status-code 400 (not a valid parent )', function(done) {
      chai.request(server).put(`/admin/categories/${category._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-category-u-4')
          .field('parent', superAdmin._id.toString())
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((err) => {
            throw new Error(err);
          });
    });
  });
  describe('Delete one by id', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).delete(`/admin/categories/${category._id.toString()}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
    it('should return status-code 400 (not a exist category)', function(done) {
      chai.request(server).delete(`/admin/categories/${superAdmin._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
});
