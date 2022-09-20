const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../test.index');
const mongoose = require('mongoose');
const {readFileSync} = require('fs');
const path = require('path');
chai.should();
chai.use(chaiHttp);
let superAdmin;
let blog;
let category;
before(async () => {
  superAdmin = await mongoose.model('user').findOne({Role: 'SUPERADMIN'}, {accessToken: 1, _id: 1});
  blog = await mongoose.model('blog').findOne({}, {_id: 1, title: 1});
  category = await mongoose.model('category').findOne({}, {_id: 1, title: 1});
});
const blogContent = `
There are many variations of passages of Lorem Ipsum available,
 but the majority have suffered alteration in some form, by injected humour,
  or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.
   All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary,
    making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures,
     to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour,
      or non-characteristic words etc.
`;
describe('Blog controller', function() {
  describe('Get all blogs', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).get('/admin/blogs').set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body.blogs).length.greaterThan(0);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
  });
  describe('Get  blog by id', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).get(`/admin/blogs/${blog._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body.data).not.undefined;
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
    it('should return status-code 404', function(done) {
      chai.request(server).get(`/admin/blogs/${superAdmin._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(404);
        chai.expect(response.body.blog).be.undefined;
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
    it('should return status-code 400', function(done) {
      chai.request(server).get(`/admin/blogs/${blog._id + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400);
        chai.expect(response.body.blog).be.undefined;
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
  });
  describe('Create blog', function() {
    it('should return status-code 201 (with all parameters)', function(done) {
      chai.request(server).post(`/admin/blogs/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-blog')
          .field('overView', 'new blog overview....')
          .field('content', blogContent)
          .field('tags', '#tag1,#tag2,#tag3')
          .field('category', category._id.toString())
          .attach('image',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(201);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 400 (lack of parameter)', function(done) {
      chai.request(server).post(`/admin/blogs/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-blog-1')
          .field('overView', 'new blog overview....')
          .field('tags', '#tag1,#tag2,#tag3')
          .field('category', category._id.toString())
          .attach('image',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 400 (exits title)', function(done) {
      chai.request(server).post(`/admin/blogs/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-blog')
          .field('overView', 'new blog overview....')
          .field('content', blogContent)
          .field('tags', '#tag1,#tag2,#tag3')
          .field('category', category._id.toString())
          .attach('image',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
  });
  describe('Update  blog by id', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).put(`/admin/blogs/${blog._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).field('title', 'updated blog')
          .then((response) => {
            chai.expect(response.status).eq(200);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 404', function(done) {
      chai.request(server).put(`/admin/blogs/${superAdmin._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'updated blog 2')
          .then((response) => {
            chai.expect(response.status).eq(404);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 400 (invalid id)', function(done) {
      chai.request(server).put(`/admin/blogs/${blog._id + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
    it('should return status-code 400 (title exist)', function(done) {
      chai.request(server).put(`/admin/blogs/${blog._id }`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'updated blog')
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
  });
  describe('Delete  blog by id', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).delete(`/admin/blogs/${blog._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
    it('should return status-code 404', function(done) {
      chai.request(server).delete(`/admin/blogs/${superAdmin._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
    it('should return status-code 400', function(done) {
      chai.request(server).delete(`/admin/blogs/${blog._id + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
  });
});
