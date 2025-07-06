const multer = require("multer");
const fs = require("fs");
const pathModule = require("path");
const CustomError = require("../utils/CustomError");
const addPhoto = (path) => {
  const fileStoreEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(req)
      const fullPath = pathModule.resolve(path);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, `${path}`);

      if (req.path == "/single" && file.fieldname !== "image") {
        throw new CustomError("file Must be Photo", 400);
      }
      if (req.path == "/multiple" && file.fieldname !== "images") {
        throw new CustomError("files Must be Photos", 400);
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  return fileStoreEngine;
};

module.exports = addPhoto;
