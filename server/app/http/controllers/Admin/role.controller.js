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
const redisClient = require('../../../conf/redisConfiguration');
module.exports = new (class RoleController extends DefaultController {
  /**
     * create new role with list of permissions
     * @param {Express.Request} req
     * @param {Express.Response} res
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
    } catch (error) {
      next(error);
    }
  }

  /**
     * get all roles from database
     * @param {Express.Request} req
     * @param {Express.Response} res
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
     * @param {Express.Request} req
     * @param {Express.Response} res
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
            if (result) {
              redisClient.setEx(id, 3600, JSON.stringify(result)).then(() => {
                return res.status(StatusCodes.OK).json({
                  success: true,
                  role: result,
                });
              }).catch((error) => {
                throw createHttpError.InternalServerError(error);
              });
            } else {
              throw createHttpError.NotFound('no role found');
            }
          })
          .catch((error) => {
            next(error);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
     * update exist role
     * @param {Express.Request} req
     * @param {Express.Response} res
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
      if (!await RoleModel.findById(id)) {
        throw createHttpError.NotFound('No role with this id');
      }
      await RoleModel.findByIdAndUpdate(id, {$set: bodyData})
          .then((result) => {
            return res.status(StatusCodes.OK).json({
              success: true,
              message: 'role has  been updated successfully.',
            });
          })
          .catch((error) => {
            throw createHttpError.BadRequest(error);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
     * remove exist user by id
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {next} next
     *
     * */
  async deleteRole(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createHttpError.BadRequest('Not a valid id');
      }
      if (!await RoleModel.findById(id)) {
        throw createHttpError.NotFound('No role with this id');
      }
      await RoleModel.findByIdAndDelete(id)
          .then((result) => {
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
