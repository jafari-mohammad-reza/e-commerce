const autoBind = require('auto-bind');
module.exports = class {
  /**
     * active auto binding to all controllers tact inheritance from this class
     * */
  constructor() {
    autoBind(this);
  }
};
