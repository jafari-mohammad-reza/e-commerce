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
const {copyObject, objectsStringToArray} = require('../../../utils/functions');
const redisClient = require('../../../conf/redisConfiguration');
module.exports = new (class AdminProductController extends DefaultController {
  /**
   * create new product
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   *
   * */
  async createProduct(req, res, next) {
    try {
      const images = uploadMultipleFiles(
          req?.files || [],
          req.body.fileUploadPath,
      );
      const physicalList = [];
      const additionalList = [];
      if (req.body.physicalFeatures) {
        objectsStringToArray(req.body.physicalFeatures).forEach((feature) => {
          physicalList.push(JSON.parse(feature));
        });
        req.body.physicalFeatures =physicalList;
      } else {
        req.body.physicalFeatures=[];
      }
      if (req.body.additionalFeatures) {
        objectsStringToArray(req.body.additionalFeatures).forEach((feature) => {
          additionalList.push(JSON.parse(feature));
        });
        req.body.additionalFeatures =additionalList;
      } else {
        req.body.additionalFeatures = [];
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
              return res.status(StatusCodes.CREATED).json({
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
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   *
   * */
  async editProduct(req, res, next) {
    try {
      const {id} = req.params;
      const product = await this.getById(id);
      if (!product) {
        throw createHttpError.NotFound('no product with this id');
      }
      const bodyData = copyObject(req.body);
      bodyData.images = uploadMultipleFiles(
          req?.files || [],
          req.body.fileUploadPath,
      );
      const physicalList = [];
      const additionalList = [];
      if (bodyData.physicalFeatures) {
        objectsStringToArray(bodyData.physicalFeatures).forEach((feature) => {
          physicalList.push(JSON.parse(feature));
        });
        bodyData.physicalFeatures =physicalList;
      } else {
        bodyData.physicalFeatures=product.physicalFeatures;
      }
      if (bodyData.additionalFeatures) {
        objectsStringToArray(bodyData.additionalFeatures).forEach((feature) => {
          additionalList.push(JSON.parse(feature));
        });
        bodyData.additionalFeatures =additionalList;
      } else {
        bodyData.additionalFeatures=product.additionalFeatures;
      }
      if (bodyData.colors) {
        bodyData.colors = Array(bodyData.colors);
      }
      if (bodyData.discount) {
        if (bodyData.discount > 100) {
          throw createHttpError.BadRequest('discount above 100');
        }
      }
      Object.keys(bodyData).forEach((key) => {
        if (['likes', 'dislikes', 'comments', 'rate'].includes(key)) {
          delete bodyData[key];
        }
        if (typeof bodyData[key] == 'string') {
          bodyData[key] = bodyData[key].trim();
        }
        if (Array.isArray(bodyData[key]) && bodyData[key].length > 0) {
          if (typeof bodyData[key] !== 'object') {
            bodyData[key] = bodyData[key].map((item) => item.trim());
          }
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
            if (result.modifiedCount> 0) {
              for (const image of product.images) {
                deleteImageFromPath(image);
              }
              return res.status(StatusCodes.OK).json({
                success: true,
                message: 'product has been updated successfully',
              });
            } else {
              createHttpError.InternalServerError('update failed');
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
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   *
   * */
  async removeProduct(req, res, next) {
    try {
      const {id} = req.params;
      const product = await this.getById(id);
      if (!product) {
        throw createHttpError.NotFound('product is not found');
      }
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
   * @param {Express.Request} req
   * @param {Express.Response} res
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
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {next} next
   *
   * */
  async getProductById(req, res, next) {
    try {
      const {id} = req.params;
      const product = await this.getById(id);
      if (!product) {
        throw createHttpError.NotFound('product not found');
      }
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
