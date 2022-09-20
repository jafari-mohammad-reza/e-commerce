const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../test.index');
const mongoose = require('mongoose');
const {readFileSync} = require('fs');
const path = require('path');
chai.should();
chai.use(chaiHttp);
let superAdmin;
let product;
let category;
before(async () => {
  superAdmin = await mongoose.model('user').findOne({Role: 'SUPERADMIN'}, {accessToken: 1, _id: 1});
  product = await mongoose.model('product').findOne({}, {_id: 1, title: 1});
  category = await mongoose.model('category').findOne({}, {_id: 1, title: 1});
});
describe('Product controller', function() {
  describe('Get all products', function() {
    it('should return status-code 200 & list of all products ', function(done) {
      chai.request(server).get('/admin/products').set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        chai.expect(response.body.products).length.greaterThan(0);
        done();
      }).catch((err) => {
        throw new Error(err);
      });
    });
  });
  describe('Get one product by id', function() {
    it('should return status-code 200', function(done) {
      console.log(product);
      chai.request(server).get(`/admin/products/${product._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        console.log(response.body.data);
        chai.expect(response.body.data).not.undefined;
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
    it('should return status-code 404', function(done) {
      chai.request(server).get(`/admin/products/${superAdmin._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
    it('should return status-code 400', function(done) {
      chai.request(server).get(`/admin/products/${product._id + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
  });
});
