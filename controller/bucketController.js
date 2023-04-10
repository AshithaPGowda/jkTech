const fs = require("fs");

// Function to create a new bucket for a user
function createUserBucket(req, res) {
  let dirName = `Buckets/${req.body.bucketName}-${req.body.userId}`;

  // Check if bucket already exists
  if (fs.existsSync(dirName)) {
    return res.status(200).json({ message: "Bucket Exists, Try a new name" });
  } else {
    // Create new bucket directory
    fs.mkdirSync(`${dirName}`);
    return res.status(200).json({ message: "Bucket Created" });
  }
}

// Function to upload a file to a user's bucket
function uploadToUserBucket(req, res) {
  let file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).send({ message: "File upload to bucket successful" });
}

// Function to list all files in a user's bucket
function listAllUserFiles(req, res) {
  let folderName = `${req.query.bucketName}-${req.query.userId}`;
  let dir = `Buckets/${folderName}`;

  // Check if bucket directory exists
  fs.access(dir, (err) => {
    if (err) {
      return res.status(400).json("Destination Bucket does not exist ");
    } else {
      // Read all files in bucket directory
      fs.readdir(dir, (err, files) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "No files found in Bucket " + bucketName });
        }
        res.status(200).send({ message: "Files found are", files });
      });
    }
  });
}

// Function to get details of a specific file in a user's bucket
function getFileDetails(req, res) {
  let fileName = req.params.fileName;
  let filePath = `${req.query.bucketName}-${req.query.userId}/${fileName}`;
  let dir = `Buckets/${filePath}`;

  // Check if file exists and get file details
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
}

// Function to delete a specific file from a user's bucket
function deleteFile(req, res) {
  let filePath = `${req.body.bucketName}-${req.body.userId}/${req.body.fileName}`;
  let dir = `Buckets/${filePath}`;

  console.log(
    `${req.body.fileName} : fileName, ${req.body.bucketName}-${req.body.userId}/${req.body.fileName} : file path`
  );
  console.log("dir :", dir);
  // Delete file from bucket directory
  fs.unlink(dir, (err) => {
    if (err) {
      return res.status(402).json({ error: "File not found" });
    }
    return res
      .status(200)
      .send({ message: "File deleted " + req.body.fileName });
  });
}

module.exports = {
  deleteFile,
  getFileDetails,
  listAllUserFiles,
  uploadToUserBucket,
  createUserBucket,
};
