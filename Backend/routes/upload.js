// routes/upload.js - File upload route using multer + Cloudinary
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { cloudinary, configureCloudinary } = require('../config/cloudinary');

configureCloudinary();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'intellihealth/uploads' },
        (error, response) => {
          if (error) return reject(error);
          resolve(response);
        }
      );
      stream.end(req.file.buffer);
    });

    return res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

module.exports = router;


