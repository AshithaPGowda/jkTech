var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { checkBodyParams } = require("../validator/bodyValidator");
const { checkQueryParams } = require("../validator/querryValidator");
const {
  deleteFile,
  getFileDetails,
  listAllUserFiles,
  uploadToUserBucket,
  createUserBucket,
} = require("../controller/bucketController");

// Define a disk storage to handle file uploads
const uploadToStorage = multer.diskStorage({
  // Define destination folder for the uploaded file
  destination: async (req, file, cb) => {
    let folderName = `${req.query.bucketName}-${req.query.userId}`;
    let dir = `Buckets/${folderName}`;
    // Check if the destination folder exists
    fs.access(dir, fs.constants.F_OK, (err) => {
      if (err) {
        return cb("Destination directory does not exist", false);
      } else {
        cb(null, dir);
      }
    });
  },
  // Define a custom file name for the uploaded file
  filename: (req, file, cb) => {
    let fileName = req.query.fileName;
    let ext = path.extname(file.originalname);
    let customName = `${fileName}${ext}`;
    cb(null, customName);
  },
});

const upload = multer({ storage: uploadToStorage });

router.post("/create", checkBodyParams, createUserBucket);

router.post(
  "/upload",
  checkBodyParams,
  upload.single("file"),
  uploadToUserBucket
);

router.get("/list/all", checkQueryParams, listAllUserFiles);

router.get("/list/:fileName", checkQueryParams, getFileDetails);

router.post("/delete", checkBodyParams, deleteFile);

module.exports = router;
