const multer = require("multer");
const fs = require("fs");
const pathModule = require("path");
const CustomError = require("../utils/CustomError");

const addPhoto = (path) => {
  const fileStoreEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = pathModule.resolve(path);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    
      if (req.method === 'PUT' || req.method === 'POST') {
        if (Array.isArray(req.files) && file.fieldname !== 'images') {
          return cb(new CustomError("files Must be Photos", 400), null);
        }
        if (!Array.isArray(req.files) && file.fieldname !== 'image') {
          return cb(new CustomError("file Must be Photo", 400), null);
        }
      }
      cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  // Return multer middleware, not just storage engine
  return multer({ storage: fileStoreEngine });
};

module.exports = addPhoto;
