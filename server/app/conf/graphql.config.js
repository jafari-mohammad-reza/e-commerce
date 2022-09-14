const {
    graphQlSchema
} = require("../graphql/index.graphql");

function graphQlConfig(req, res) {
    return {
        schema: graphQlSchema,
        graphiql: true,
        context : {req,res}
    }
}

module.exports = {
    graphQlConfig
}
