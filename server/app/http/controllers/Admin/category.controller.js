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
module.exports = new (class AdminCategoryController extends DefaultController {
  /**
   * create a new category with parent or without parent
   * @param {req} req
   * @param {res} res
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
      if (await CategoryModel.findOne({title}, {__v: 0, parent: 0})) {
        throw createError.InternalServerError(
            'there is already one category with this title.',
        );
      }
      await CategoryModel.create({title, parent, image: image || undefined})
          .then(() => {
            return res.status(StatusCodes.OK).json({
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
   * @param {req} req
   * @param {res} res
   * @param {next} next
   * */
  async editCategory(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createError.BadRequest('the id is not valid');
      }
      const previousCategory = await CategoryModel.findOne({_id: id}, {image: 1});
      const bodyData = await modifyCategory.validateAsync(req.body);
      const {title, parent} = bodyData;
      if (req.body.fileUploadPath && req.body.fileName) {
        req.body.image = path.join(req.body.fileUploadPath, req.body.fileName);
        req.body.image = req.body.image.replace(/\\/g, '/');
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
        message: 'Category wasnot updated .',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * remove a category and all it's children by id
   * @param {req} req
   * @param {res} res
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
          throw createError.BadRequestError('any category has not been deleted');
        }
        return res.status(StatusCodes.OK).json({
          success: true,
          message: 'the category and all it child\'s hav been removed',
        });
      }).catch((error) => {
        throw createError.InternalServerError(error);
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * get all categories in database
   * @param {req} req
   * @param {res} res
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
   * @param {req} req
   * @param {res} res
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
   * @param {req} req
   * @param {res} res
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
      return res.status(StatusCodes.OK).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * get a category that is parent by id
   * @param {req} req
   * @param {res} res
   * @param {next} next
   * */
  async getParentCategoryById(req, res, next) {
    try {
      const {id} = req.params;
      if (!isValidObjectId(id)) {
        throw createError.BadRequest('the id is not valid');
      }
      const categories = await CategoryModel.aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: 'category',
            localField: '_id',
            foreignField: 'paernt',
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
      return res.status(StatusCodes.OK).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
})();
