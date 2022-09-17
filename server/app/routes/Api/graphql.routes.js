const limit = require('express-rate-limit');
const {StatusCodes} = require('http-status-codes');
const {graphqlHTTP} = require('express-graphql');
const {graphQlConfig} = require('../../conf/graphql.config');
const router = require('express').Router();
const graphqlLimit = limit({
  windowMs: 3000000, // 5 minutes
  max: 25,
  message: {
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
  },
  skipFailedRequests: true,
});
router.get('/graphql-doc', (req, res) => {
  return res.render('swagger-doc/index.html');
});

router.use('/graphql',
    graphqlLimit,
    graphqlHTTP(graphQlConfig));
module.exports ={
  GraphQlRoutes: router,
};
