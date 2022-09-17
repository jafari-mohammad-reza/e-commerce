const createHttpError = require('http-errors');
const DefaultController = require('../default.controller');
const {ProductModel} = require('../../../models/Product');
const {StatusCodes} = require('http-status-codes');
const {isValidObjectId} = require('mongoose');
const {
  createProductValidator,
} = require('../../validators/Admin/product.validators');
const {
  uploadMultipleFiles,
  deleteImageFromPath,
} = require('../../../utils/imageUtils');
const {copyObject} = require('../../../utils/functions');
const redisClient = require('../../../conf/redisConfiguration');
module.exports = new (class AdminProductController extends DefaultController {
  /**
   * create new product
   * @param {req} req
   * @param {res} res
   * @param {next} next
   *
   * */
  async createProduct(req, res, next) {
    try {
      const images = uploadMultipleFiles(
          req?.files || [],
          req.body.fileUploadPath,
      );
      if (req.body.physicalFeatures) {
        if (typeof req.body.physicalFeatures === 'string') {
          req.body.additionalFeatures = Array(req.body.additionalFeatures).map((item) => {
            return JSON.parse(item);
          });
        }
      }
      if (req.body.additionalFeatures) {
        if (typeof req.body.additionalFeatures === 'string') {
          req.body.additionalFeatures = Array(req.body.additionalFeatures).map((item) => {
            return JSON.parse(item);
          });
        }
      }
      if (req.body.colors) {
        req.body.colors = Array(req.body.colors);
      }
      const bodyData = await createProductValidator.validateAsync(req.body);

      const {
        title,
        overView,
        description,
        category,
        tags,
        stockCount,
        discount,
        price,
        physicalFeatures,
        additionalFeatures,
        colors,
      } = bodyData;
      const supplier = req.user._id;
      await ProductModel.create({
        title,
        overView,
        description,
        category,
        tags,
        discount,
        stockCount,
        price,
        physicalFeatures,
        additionalFeatures,
        supplier,
        images,
        colors,
      })
          .then((result) => {
            if (result) {
              return res.status(StatusCodes.OK).json({
                success: true,
                message: 'Products has been created successfully.',
              });
            }
          })
          .catch((err) => {
            throw createHttpError.InternalServerError(err.message);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
   * edit exist product
   * @param {req} req
   * @param {res} res
   * @param {next} next
   *
   * */
  async editProduct(req, res, next) {
    try {
      const {id} = req.params;
      const product = await this.getById(id);
      const bodyData = copyObject(req.body);
      bodyData.images = uploadMultipleFiles(
          req?.files || [],
          req.body.fileUploadPath,
      );
      Object.keys(bodyData).forEach((key) => {
        if (['likes', 'dislikes', 'comments', 'rate'].includes(key)) {
          delete bodyData[key];
        }
        if (typeof bodyData[key] == 'string') {
          bodyData[key] = bodyData[key].trim();
        }
        if (Array.isArray(bodyData[key]) && bodyData[key].length > 0) {
          bodyData[key] = bodyData[key].map((item) => item.trim());
        }
        if (Array.isArray(bodyData[key]) && bodyData[key].length === 0) {
          delete bodyData[key];
        }
        if (
          ['null', null, undefined, 'undefined', ' ', ''].includes(
              bodyData[key],
          )
        ) {
          delete bodyData[key];
        }
      });

      await ProductModel.updateOne({_id: id}, {$set: bodyData}).then(
          (result) => {
            if (result.modifiedCount > 0) {
              for (const image of product.images) {
                deleteImageFromPath(image);
              }
              return res.status(StatusCodes.OK).json({
                success: true,
                message: 'product has been updated successfully',
              });
            }
          },
      ).catch((err) => {
        createHttpError.InternalServerError(err.message);
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * remove exist product
   * @param {req} req
   * @param {res} res
   * @param {next} next
   *
   * */
  async removeProduct(req, res, next) {
    try {
      const {id} = req.params;
      const product = await this.getById(id);
      await ProductModel.deleteOne({_id: product._id})
          .then((result) => {
            if (result && result.deletedCount > 0) {
              for (const image of product.images) {
                deleteImageFromPath(image);
              }
              return res.status(StatusCodes.OK).json({
                success: true,
                message: 'product deleted successfully',
              });
            }
          }).catch((err) => {
            createHttpError.InternalServerError(err.message);
          });
    } catch (error) {
      next(error);
    }
  }

  /**
   * get all products from database
   * @param {req} req
   * @param {res} res
   * @param {next} next
   *
   * */
  async getAllProduct(req, res, next) {
    try {
      const search = req?.query?.search || '';
      let products;
      if (search) {
        products = await ProductModel.find({
          $text: {
            $search: search,
          },
        });
      } else {
        products = await ProductModel.find({});
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        products,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * get exist product with id
   * @param {req} req
   * @param {res} res
   * @param {next} next
   *
   * */
  async getProductById(req, res, next) {
    try {
      const {id} = req.params;
      const product = await this.getById(id);
      await redisClient.setEx(id, 3600, JSON.stringify(product));
      return res.status(StatusCodes.OK).json({
        success: true,
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * get exist product with id
   * @param {id} id
   * @return {product}
   * */
  async getById(id) {
    if (!isValidObjectId(id)) {
      throw createHttpError.BadRequest('not a valid id');
    }
    return await ProductModel.findOne({_id: id}).then((result) => {
      if (result) {
        return result;
      }
      throw createHttpError.NotFound('there is no product with this id');
    });
  }
})();
