const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|mp4|mkv|bmp|tiff|heif|raw|webp|svg|psd|ico|pdf|eps|ai|dng|tga|dds|exr|jfif|avi|mov|wmv|flv|mpeg|mpg|webm|3gp|m4v|ogv|ts|vob|asf|rm|swf|divx|xvid|m2ts/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: File type not allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 90000000 },
  fileFilter: fileFilter
});

module.exports = upload;
