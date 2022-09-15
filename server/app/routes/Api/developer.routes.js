const {imageUploader} = require('../../utils/imageUtils');
const router = require('express').Router();
router.get('/', (req, res, next) => {
  const splitUrl = req.baseUrl.split('/')[req.baseUrl.split('/').length - 1];
  return res.json({
    message: splitUrl,
  });
});
router.post('/', imageUploader.single('image'), (req, res) => {
  return res.send(req);
});

module.exports = {
  DeveloperRouter: router,
};
