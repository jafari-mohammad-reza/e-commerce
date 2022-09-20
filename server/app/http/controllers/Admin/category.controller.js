const DefaultController = require('../default.controller');
const createError = require('http-errors');
const {
  modifyCategory,
} = require('../../validators/Admin/category.validators');
const {CategoryModel} = require('../../../models/Category');
const {StatusCodes} = require('http-status-codes');
const {isValidObjectId} = require('mongoose');
const path = require('path');
const {deleteImageFromPath} = require('../../../utils/imageUtils');
const redisClient = require('../../../conf/redisConfiguration');
const {valueToObjectId} = require('../../../utils/functions');
module.exports = new (class AdminCategoryController extends DefaultController {
  /**
   * create a new category with parent or without parent
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async createCategory(req, res, next) {
    try {
      let image = undefined;
      if (req?.body?.fileUploadPath && req?.body?.fileName) {
        image = path
            .join(req?.body?.fileUploadPath, req?.body?.fileName)
            .replaceAll(/\\/gi);
      }
      const bodyData = await modifyCategory.validateAsync(req.body);

      const {title, parent} = bodyData;
      if (await CategoryModel.findOne({title}, {__v: 0, parent: 0}) ) {
        throw createError.BadRequest(
            'there is already one category with this title.',
        );
      }
      if (parent && !await CategoryModel.findOne({_id: parent})) {
        throw createError.BadRequest(
            'Not a valid parent.',
        );
      }

      await CategoryModel.create({title, parent, image: image || undefined})
          .then(() => {
            return res.status(StatusCodes.CREATED).json({
              success: true,
              message: 'Category created successfully.',
            });
          })
          .catch((error) => {
            throw createError.InternalServerError(error);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
   * edit category title and parent and image by user inputs
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async editCategory(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createError.BadRequest('the id is not valid');
      }
      const previousCategory = await CategoryModel.findOne({_id: id});
      const bodyData = await modifyCategory.validateAsync(req.body);
      const {title, parent} = bodyData;
      if (req.body.fileUploadPath && req.body.fileName) {
        req.body.image = path.join(req.body.fileUploadPath, req.body.fileName);
        req.body.image = req.body.image.replace(/\\/g, '/');
      }
      if (await CategoryModel.findOne({title}, {__v: 0, parent: 0}) ) {
        throw createError.BadRequest(
            'there is already one category with this title.',
        );
      }
      if (parent && !await CategoryModel.findOne({_id: parent})) {
        throw createError.BadRequest(
            'Not a valid parent.',
        );
      }
      const image = req.body.image;
      const result = await CategoryModel.updateOne(
          {_id: id},
          {$set: {title, parent, image}},
      );
      if (result.modifiedCount > 0) {
        if (previousCategory.image) {
          deleteImageFromPath(previousCategory.image);
        }
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'Category updated successfully.',
        });
      }
      return res.status(StatusCodes.Failed).json({
        success: true,
        message: 'Category was not updated .',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * remove a category and all it's children by id
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async removeCategory(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createError.BadRequest('the id is not valid');
      }
      await CategoryModel.deleteMany({$or: [{_id: id}, {parent: id}]}).then((result) => {
        if (result.deletedCount === 0) {
          throw createError.BadRequest('any category has not been deleted');
        }
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'the category and all it child\'s hav been removed',
        });
      }).catch((error) => {
        throw createError.BadRequest(error);
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * get all categories in database
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryModel.find({});
      return res.status(StatusCodes.OK).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  /**
   * get all categories that are not child of another category
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async getAllParentCategories(req, res, next) {
    try {
      const parentCategories = await CategoryModel.find(
          {parent: undefined},
          {__v: 0},
      );
      return res.status(StatusCodes.OK).json({
        success: true,
        data: parentCategories,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * get a category by id
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async getCategoryById(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createError.BadRequest('the id is not valid');
      }
      const category = await CategoryModel.findOne(
          {_id: id},
          {__v: 0, parent: 0},
      );
      if (!category) {
        throw createError.NotFound('Category not found');
      }
      await redisClient.setEx(id, 3600, JSON.stringify(category));
      return res.status(StatusCodes.OK).json({
        success: true,
        isCahce: false,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * get a category that is parent by id
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   * */
  async getParentCategoryById(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createError.BadRequest('the id is not valid');
      }
      const category = await CategoryModel.aggregate([
        {
          $match: {
            _id: valueToObjectId(id),
            parent: undefined,
          },
        },
        {
          $lookup: {
            from: 'category',
            localField: '_id',
            foreignField: 'parent',
            as: 'children',
          },
        },

        {
          $project: {
            '__v': 0,
            'parent.__v': 0,
          },
        },
      ]);
      if (!category) {
        throw createError.NotFound('Category not found');
      }
      await redisClient.setEx(id, 3600, JSON.stringify(category));
      return res.status(StatusCodes.OK).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
})();
