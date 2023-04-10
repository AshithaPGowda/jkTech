var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

import { checkBodyParams } from "../validator/bodyValidator";

const uploadToStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let folderName = `${req.query.bucketName}-${req.query.userId}`;
    let dir = `Buckets/${folderName}`;
    fs.access(dir, fs.constants.F_OK, (err) => {
      if (err) {
        return cb("Destination directory does not exist", false);
      } else {
        cb(null, dir);
      }
    });
  },
  filename: (req, file, cb) => {
    let fileName = req.query.fileName;
    let ext = path.extname(file.originalname);
    let customName = `${fileName}${ext}`;
    cb(null, customName);
  },
});

const upload = multer({ storage: uploadToStorage });

router.post("/create", checkBodyParams, (req, res) => {
  let dirName = `Buckets/${req.body.bucketName}-${req.body.userId}`;

  if (fs.existsSync(dirName)) {
    return res.status(200).json({ message: "Bucket Exists, Try a new name" });
  } else {
    fs.mkdirSync(`${dirName}`);
    return res.status(200).json({ message: "Bucket Created" });
  }
});

router.post("/upload", checkBodyParams, upload.single("file"), (req, res) => {
  let file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).send({ message: "File upload to bucket successful" });
});

router.get("/list/all", (req, res) => {
  let folderName = `${req.query.bucketName}-${req.query.userId}`;
  let dir = `Buckets/${folderName}`;

  fs.existsSync(dir, (exists) => {
    if (!exists) {
      return res.status(400).json("Destination Bucket does not exist ");
    } else {
      fs.readdir(dir, (err, files) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "No files found in Bucket " + bucketName });
        }
        console.log("files", files);
        res.status(200).send({ message: "Files found are", files });
      });
    }
  });
});

router.get("/list/:fileName", (req, res) => {
  let fileName = req.params.fileName;
  let filePath = `${req.query.bucketName}-${req.query.userId}/${fileName}`;
  let dir = `Buckets/${filePath}`;

  console.log(
    `${req.params.fileName} : fileName, ${req.query.bucketName}-${req.query.userId}/${fileName} : file path`
  );
  console.log("dir :", dir);
  fs.stat(dir, (err, stats) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }
    res.status(200).json({
      fileName: req.params.fileName,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      path: `${__dirname}/Buckets/${filePath}`,
    });
  });
});

router.post("/delete", checkBodyParams, (req, res) => {
  let filePath = `${req.body.bucketName}-${req.body.userId}/${req.body.fileName}`;
  let dir = `Buckets/${filePath}`;

  console.log(
    `${req.body.fileName} : fileName, ${req.body.bucketName}-${req.body.userId}/${req.body.fileName} : file path`
  );
  console.log("dir :", dir);
  fs.unlink(dir, (err) => {
    if (err) {
      return res.status(402).json({ error: "File not found" });
    }
    return res
      .status(200)
      .send({ message: "File deleted " + req.body.fileName });
  });
});

module.exports = router;
