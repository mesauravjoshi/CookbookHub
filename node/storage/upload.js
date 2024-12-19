const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true
});

// Helper function to upload a file buffer to Cloudinary
const uploadFile = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },  // Automatically determine file type
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result); // Returns result with 'secure_url' field
        }
      }
    );

    // Pipe the file buffer to Cloudinary's upload stream
    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  uploadFile
};
