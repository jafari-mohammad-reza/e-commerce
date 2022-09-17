const client = require('../../conf/redisConfiguration');
const createError = require('http-errors');
const {StatusCodes} = require('http-status-codes');
/**
 *  this function will get a parameter from header and check if it's available in redis cache
 *  @param {string} parameter
 *  @return {data}
 * */
const cache = (parameter) => {
  return function(req, res, next) {
    try {
      const identifier = req.params[parameter];
      client.get(identifier).then((data) => {
        return data ? res.status(StatusCodes.OK).json({
          success: true,
          isCached: true,
          data: JSON.parse(data),
        }) : next();
      }).catch((err) => {
        throw createError.InternalServerError(err.message);
      });
    } catch (error) {
      next(error);
    }
  };
};


module.exports ={cache};
