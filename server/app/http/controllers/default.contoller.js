const autoBind = require("auto-bind");
module.exports = class DefaultController {
  constructor() {
    autoBind(this);
  }
};
