const DefaultController = require('../default.controller');
const createHttpError = require('http-errors');
const {StatusCodes} = require('http-status-codes');
const {RoleModel} = require('../../../models/Role');
const {isValidObjectId} = require('mongoose');
const {
  createRoleValidator,
} = require('../../validators/Admin/role.validators');
const {
  copyObject,
} = require('../../../utils/functions');
module.exports = new (class RoleController extends DefaultController {
  /**
     * create new role with list of permissions
     * @param {req} req
     * @param {res} res
     * @param {next} next
     *
     * */
  async createRole(req, res, next) {
    try {
      let {title, permissions} = await createRoleValidator.validateAsync(
          req.body,
      );
      title = title.toUpperCase();
      if (await RoleModel.findOne({title})) {
        throw createHttpError.BadRequest(
            'there is already one role available with this title.',
        );
      }
      await RoleModel.create({title, permissions})
          .then((result) => {
            if (!result) {
              throw createHttpError.BadRequest(
                  'role has not been created successfully.',
              );
            }
            return res.status(StatusCodes.CREATED).json({
              success: true,
              message: 'role has been created successfully.',
            });
          })
          .catch((error) => {
            next(error);
          });
    } catch (e) {
      next(createHttpError.InternalServerError(e));
    }
  }

  /**
     * get all roles from database
     * @param {req} req
     * @param {res} res
     * @param {next} next
     *
     * */
  async getAllRoles(req, res, next) {
    try {
      await RoleModel.find({})
          .populate({path: 'permissions'})
          .then((result) => {
            return res
                .status(StatusCodes.OK)
                .json({success: true, roles: result});
          })
          .catch((error) => {
            throw createHttpError.INternalServerError(error);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
     * get one role by id
     * @param {req} req
     * @param {res} res
     * @param {next} next
     *
     * */
  async getRoleById(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createHttpError.BadRequest('Not a valid id');
      }
      await RoleModel.findById(id)
          .populate({path: 'permissions'})
          .then((result) => {
            if (!result) {
              throw createHttpError.BadRequest(
                  'role has not been found.',
              );
            }
            return res.status(StatusCodes.OK).json({
              success: true,
              role: result,
            });
          })
          .catch((error) => {
            throw createHttpError.InternalServerError(error);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
     * update exist role
     * @param {req} req
     * @param {res} res
     * @param {next} next
     *
     * */
  async updateRole(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createHttpError.BadRequest('Not a valid id');
      }
      const bodyData = copyObject(req.body);
      bodyData.title = bodyData?.title?.toUpperCase();
      await RoleModel.findByIdAndUpdate(id, {$set: bodyData})
          .then((result) => {
            if (!result) {
              throw createHttpError.BadRequest(
                  'role has not been updated successfully.',
              );
            }
            return res.status(StatusCodes.OK).json({
              success: true,
              message: 'role has  been updated successfully.',
            });
          })
          .catch((error) => {
            throw createHttpError.InternalServerError(error);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
     * remove exist user by id
     * @param {req} req
     * @param {res} res
     * @param {next} next
     *
     * */
  async deleteRole(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createHttpError.BadRequest('Not a valid id');
      }
      await RoleModel.findByIdAndDelete(id)
          .then((result) => {
            console.log(result);
            if (!result) {
              throw createHttpError.BadRequest(
                  'role has not been deleted successfully.',
              );
            }
            return res.status(StatusCodes.OK).json({
              success: true,
              message: 'role has been deleted successfully.',
            });
          })
          .catch((error) => {
            throw createHttpError.InternalServerError(error);
          });
    } catch (error) {
      next(error);
    }
  }
})();
