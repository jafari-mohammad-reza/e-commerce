const DefaultController = require('../default.controller');
const createHttpError = require('http-errors');
const {PermissionsModel} = require('../../../models/Permission');
const {StatusCodes} = require('http-status-codes');
const {isValidObjectId} = require('mongoose');
const redisClient = require('../../../conf/redisConfiguration');
const {RoleModel} = require('../../../models/Role');
module.exports = new (class PermissionController extends DefaultController {
  /**
     * get all permissions in database
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {next} next
     * */
  async getAllPermissions(req, res, next) {
    try {
      await PermissionsModel.find({})
          .then((result) => {
            return res.status(StatusCodes.OK).json({
              success: true,
              permissions: result,
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
     * get  permission by id
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {next} next
     * */
  async getById(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createHttpError.BadRequest('Not a valid id.');
      }
      const permission = await PermissionsModel.findById(id)
          .catch((error) => {
            throw createHttpError.InternalServerError(error);
          });
      if (!permission) {
        throw createHttpError.NotFound('not permission with this id');
      }
      redisClient.setEx(id, 3600, JSON.stringify(permission)).then(() => {
        return res.status(StatusCodes.OK).json({
          success: true,
          permission,
        });
      }).catch((error) => {
        throw createHttpError.InternalServerError(error);
      });
    } catch (error) {
      next(error);
    }
  }

  /**
     * create a new permission
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {next} next
     * */
  async createPermission(req, res, next) {
    try {
      const {title, description} = req.body;
      if (!title) {
        throw createHttpError.BadRequest(
            'each permission need to have a title.',
        );
      }
      if (await PermissionsModel.findOne({title})) {
        throw createHttpError.BadRequest(
            'there is already one permission with this title.',
        );
      }
      await PermissionsModel.create({title, description})
          .then((result) => {
            if (!result) {
              throw createHttpError.InternalServerError(
                  'permission has not been crated successfully.',
              );
            }
            return res.status(StatusCodes.CREATED).json({
              success: true,
              message: 'permission has been created successfully.',
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
     * update an exist permission
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {next} next
     * */
  async updatePermission(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createHttpError.BadRequest('Not a valid id.');
      }
      const {title, description} = req.body;
      if (!title) {
        throw createHttpError.BadRequest(
            'each permission need to have a title.',
        );
      }
      if (await PermissionsModel.findOne({title})) {
        throw createHttpError.BadRequest(
            'title is already used by another permission.',
        );
      }
      await PermissionsModel.findByIdAndUpdate(id, {$set: {title, description}})
          .then((result) => {
            return res.status(StatusCodes.OK).json({
              success: true,
              message: 'permission has been updated successfully.',
            });
          })
          .catch((error) => {
            throw createHttpError.InternalServerError(error.message);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
     * delete an exist permission
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {next} next
     * */
  async deletePermission(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createHttpError.BadRequest('Not a valid id.');
      }
      if (!await PermissionsModel.findOne({_id: id})) {
        throw createHttpError.NotFound('permission not found');
      }
      await PermissionsModel.findByIdAndDelete(id)
          .then((result) => {
            return res.status(StatusCodes.OK).json({
              success: true,
              message: 'permission has been deleted successfully.',
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
