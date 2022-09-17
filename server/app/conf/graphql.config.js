const {
  graphQlSchema,
} = require('../graphql/index.graphql');

/**
 * Graphql configuration
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @return {{schema, graphiql: boolean, context: {res: res, req: req}}}
 * */
function graphQlConfig(req, res) {
  return {
    schema: graphQlSchema,
    graphiql: true,
    context: {req, res},
  };
}

module.exports = {
  graphQlConfig,
};
