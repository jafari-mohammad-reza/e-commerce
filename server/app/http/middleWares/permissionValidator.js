const createHttpError = require('http-errors');
const {RoleModel} = require('../../models/Role');
const {PermissionsModel} = require('../../models/Permission');
const {PERMISSIONS} = require('../../conf/constant');

// eslint-disable-next-line valid-jsdoc
/**
 * check if the user has needed permissions for a route or not
 * @param {(string[]|string)[]} requiredPermissions
 * */
function permissionValidator(requiredPermissions = []) {
  return async function(req, res, next) {
    try {
      const allPermissions = requiredPermissions.flat(2);
      const user = req.user;
      if (!user) throw createHttpError.Unauthorized('Please login first');
      const role = await RoleModel.findOne({title: user.Role});
      if (!role) {
        throw createHttpError.InternalServerError('Role not found');
      }
      const permissions = await PermissionsModel.find({_id: {$in: role.permissions}});
      const userPermissions = permissions.map((permission) => permission.title);
      const hasPermission = allPermissions.includes(...userPermissions);
      if (userPermissions.includes(PERMISSIONS.ALL)) return next();
      if (allPermissions.length === 0 || hasPermission) return next();
      throw createHttpError.Forbidden('you dont have access to this section');
    } catch (e) {
      next(e);
    }
  };
}

module.exports = permissionValidator;
