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
  product = await mongoose.model('product').findOne({});
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
        // chai.expect(response.body.data).not.undefined;
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
  describe('Create product', function() {
    it('should return status-code 201 (with all parameters)', function(done) {
      chai.request(server).post(`/admin/products/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-products')
          .field('overView', 'new-products overview..........')
          .field('description', 'new-products description..................................')
          .field('category', category._id.toString())
          .field('tags', 'product,tag')
          .field('stockCount', 100)
          .field('price', 100)
          .field('discount', 50)
          .field('physicalFeatures', `{'manufacture': 'updated country'}, {'company': 'apple'}`)
          .field('additionalFeatures', `{'manufactur': 'Germany'}, {'Company': 'smansung'}`)
          .field('colors', ['blue', 'yellow', 'gray'])
          .attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png').then((response) => {
            chai.expect(response.status).eq(201);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 201 (with all parameters)', function(done) {
      chai.request(server).post(`/admin/products/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-products')
          .field('overView', 'new-products overview..........')
          .field('description', 'new-products description..................................')
          .field('category', category._id.toString())
          .field('tags', 'product,tag')
          .field('stockCount', 100)
          .field('price', 120)
          .field('discount', 50)
          .field('physicalFeatures', `{'manufacture': 'updated country'}, {'company': 'apple'}`)
          .field('additionalFeatures', `{'manufactur': 'Germany'}, {'Company': 'smansung'}`)
          .field('colors', ['blue', 'yellow', 'gray'])
          .attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png').then((response) => {
            chai.expect(response.status).eq(201);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 400 (not a valid parameter (discount))', function(done) {
      chai.request(server).post(`/admin/products/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-products')
          .field('overView', 'new-products overview..........')
          .field('description', 'new-products description..................................')
          .field('category', category._id.toString())
          .field('stockCount', 100)
          .field('price', 100)
          .field('discount', 150).attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 400 (with lack of required parameters)', function(done) {
      chai.request(server).post(`/admin/products/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('overView', 'new-products overview..........')
          .field('description', 'new-products description..................................')
          .field('category', category._id.toString())
          .field('tags', 'product,tag')
          .field('stockCount', 100)
          .field('price', 100)
          .field('discount', 50)
          .field('physicalFeatures', `{'manufacture': 'updated country'}, {'company': 'apple'}`)
          .field('colors', ['blue', 'yellow', 'gray']).attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 400 (not a valid parameter)', function(done) {
      chai.request(server).post(`/admin/products/`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-products')
          .field('overView', 'new-products overview..........')
          .field('description', 'new-products description')
          .field('category', category._id.toString())
          .field('tags', 'product,tag')
          .field('stockCount', 100)
          .field('price', 100)
          .field('discount', 50)
          .field('physicalFeatures', `{'manufacture': 'updated country'}, {'company': 'apple'}`)
          .field('additionalFeatures', `{'manufactur': 'Germany'}, {'Company': 'smansung'}`)
          .field('colors', ['blue', 'yellow', 'gray']).attach('images',
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
  describe('Update one product by id', function() {
    it('should return status-code 200 (with all parameters)', function(done) {
      chai.request(server).put(`/admin/products/${product._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-products')
          .field('overView', 'new-products overview..........')
          .field('description', 'new-products description..................................')
          .field('category', category._id.toString())
          .field('tags', 'product,tag')
          .field('stockCount', 100)
          .field('price', 100)
          .field('discount', 50)
          .field('physicalFeatures', `{'manufacture': 'updated country'}, {'company': 'apple'}`)
          .field('additionalFeatures', `{'manufactur': 'Germany'}, {'Company': 'smansung'}`)
          .field('colors', ['blue', 'yellow', 'gray'])
          .attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png').then((response) => {
            chai.expect(response.status).eq(200);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 200 (with required parameters)', function(done) {
      chai.request(server).put(`/admin/products/${product._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-products')
          .field('overView', 'new-products overview..........')
          .field('description', 'new-products description..................................')
          .field('category', category._id.toString())
          .field('stockCount', 100)
          .field('price', 100)
          .field('discount', 50).attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(200);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 400 (not a valid parameter (discount is above 100))', function(done) {
      chai.request(server).put(`/admin/products/${product._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('discount', 150)
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 400 (not a valid id)', function(done) {
      chai.request(server).put(`/admin/products/${category._id+ '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-products')
          .field('overView', 'new-products overview..........')
          .field('description', 'new-products description')
          .field('category', category._id.toString())
          .field('tags', 'product,tag')
          .field('stockCount', 100)
          .field('price', 100)
          .field('discount', 50)
          .field('physicalFeatures', `{'manufacture': 'updated country'}, {'company': 'apple'}`)
          .field('additionalFeatures', `{'manufactur': 'Germany'}, {'Company': 'smansung'}`)
          .field('colors', ['blue', 'yellow', 'gray']).attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(400);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
    it('should return status-code 404 (not a exist product)', function(done) {
      chai.request(server).put(`/admin/products/${superAdmin._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`)
          .field('title', 'new-products')
          .field('overView', 'new-products overview..........')
          .field('description', 'new-products description')
          .field('category', category._id.toString())
          .field('tags', 'product,tag')
          .field('stockCount', 100)
          .field('price', 100)
          .field('discount', 50)
          .field('physicalFeatures', `{'manufacture': 'updated country'}, {'company': 'apple'}`)
          .field('additionalFeatures', `{'manufactur': 'Germany'}, {'Company': 'smansung'}`)
          .field('colors', ['blue', 'yellow', 'gray']).attach('images',
              readFileSync(path.join(__dirname, '..', '..', 'public', 'cartLogo.svg')),
              'preview.png')
          .then((response) => {
            chai.expect(response.status).eq(404);
            done();
          }).catch((error) => {
            throw new Error(error);
          });
    });
  });
  describe('Delete one product by id', function() {
    it('should return status-code 200', function(done) {
      chai.request(server).delete(`/admin/products/${product._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(200);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
    it('should return status-code 404', function(done) {
      chai.request(server).delete(`/admin/products/${superAdmin._id}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(404);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
    it('should return status-code 400', function(done) {
      chai.request(server).delete(`/admin/products/${product._id + '1'}`).set('authorization', `Bearer ${superAdmin.accessToken}`).then((response) => {
        chai.expect(response.status).eq(400);
        done();
      }).catch((error) => {
        throw new Error(error);
      });
    });
  });
});
