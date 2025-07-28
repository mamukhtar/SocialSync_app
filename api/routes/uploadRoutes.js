// routes/upload.js
const express = require('express');
const multer  = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinaryConfig'); // path to your Cloudinary config

const router = express.Router();

// Use multer without a destination to store files in memory.
const upload = multer();

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Use a stream to upload the file buffer to Cloudinary.
  let streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) resolve(result);
        else reject(error);
      });
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  };

  try {
    const result = await streamUpload(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
