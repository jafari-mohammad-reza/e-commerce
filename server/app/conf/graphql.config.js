const {
  graphQlSchema,
} = require('../graphql/index.graphql');

/**
 * Graphql configuration
 * @param {req} req
 * @param {res} res
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
