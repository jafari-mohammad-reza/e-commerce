const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createHttpError = require("http-errors");
const directoryCreator = (req) => {
  const date = new Date();
  const currentDate = `${date.getFullYear().toString()}\\${date
    .getMonth()
    .toString()}\\${date.getDay().toString()}`;
  const fileUploadPath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "blogs",
    currentDate
  );
  req.body.fileUploadPath = path.join("uploads", "blogs", currentDate);
  if (fs.existsSync(fileUploadPath)) {
    fs.mkdirSync(fileUploadPath);
  }
  return fileUploadPath;
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file?.originalname) {
      const filePath = directoryCreator(req);
      return cb(null, filePath);
    }
    cb(null, null);
  },
  filename: function (req, file, cb) {
    if (file.originalname) {
      // ext  = file formant
      const ext = path.extname(file.originalname);
      const fileName = String(new Date().getTime() + ext);
      req.body.fileName = fileName;
      return cb(null, fileName);
    }
    return cb(null, null);
  },
});

const fileTypeFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const mimetypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createHttpError.BadRequest("not a valid file format"));
};
const uploadMultipleFiles = (files, filesUploadPath) => {
  if (files?.length > 0) {
    return files
      .map((file) => path.join(filesUploadPath, file.filename))
      .map((item) => item.replace(/\\/g, "/"));
  } else {
    return [];
  }
};
const imageMaxSize = 1000 * 1000;
const imageUploader = multer({
  storage,
  fileTypeFilter,
  limit: { fileSize: imageMaxSize },
});
function deleteImageFromPath(path) {
  if (fs.existsSync(path.join(__dirname, "..", "..", "public", path))) {
    fs.unlinkSync(path);
  }
}
module.exports = { imageUploader, deleteImageFromPath, uploadMultipleFiles };

