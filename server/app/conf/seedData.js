const {default: mongoose} = require('mongoose');
const {PermissionsModel} = require('../models/Permission');
const {RoleModel} = require('../models/Role');
const {UserModel} = require('../models/User');
const {hashPassword} = require('../utils/Security');
/**
 * this function will run on docker app startup and will put some necessary data on website database
 * */
function seedData() {
  try {
    mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/e-commerce').then(async () => {
      if (PermissionsModel) {
        await PermissionsModel.collection.drop().then(async () => {
          await PermissionsModel.insertMany([{title: 'all', description: 'has access to each single section of website'},
            {title: 'admin', description: 'has access to some parts of admin panel'},
            {title: 'storage_manager', description: 'only has access to products section'},
            {title: 'support', description: 'has access to support panel and users section'},
            {title: 'supplier', description: 'only able to create products'},
            {title: 'user', description: 'only has access to its own panel and cart'}]);
        }).then(async () => {
          if (RoleModel) {
            await RoleModel.collection.drop().then(async () => {
              const allPermissions =await PermissionsModel.findOne({title: 'all'});
              console.log(allPermissions._id);
              const adminPermission =await PermissionsModel.findOne({title: 'admin'});
              const storageManagerPermission =await PermissionsModel.findOne({title: 'storage_manager'});
              const supportPermission =await PermissionsModel.findOne({title: 'support'});
              const supplierPermission =await PermissionsModel.findOne({title: 'support'});
              const userPermission =await PermissionsModel.findOne({title: 'user'});
              await RoleModel.insertMany([{title: 'SUPERADMIN', permissions: [allPermissions._id]},
                {title: 'ADMIN', permissions: [adminPermission._id]},
                {title: 'STORAGE_MANAGER', permissions: [storageManagerPermission._id]},
                {title: 'SUPPORT', permissions: [supportPermission._id]},
                {title: 'SUPPLIER', permissions: [supplierPermission._id]},
                {title: 'USER', permissions: [userPermission._id]}]);
            }).catch((err) => {
              console.log(err.message);
            });
          }
        }).catch((err) => {
          console.log(err.message);
        });
      }

      if (UserModel) {
        if (!await UserModel.findOne({email: 'admin@gmail.com'})) {
          await UserModel.create({email: 'admin@gmail.com', password: hashPassword('Admin123'), username: 'SUPERADMIN', Role: 'SUPERADMIN', isVerified: true});
        }
      }
    }).then(async () => {
      console.log('stop seeding data');
      process.exit(0);
    });
  } catch (e) {
    console.log(e);
  }
}

seedData();
