const cloudinary = require('../config/cloudinary');

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {'image'|'video'} resourceType
 * @param {string} folder
 */
const uploadToCloudinary = (buffer, resourceType, folder = 'portfolio') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
      },
      (error, result) => {
        if (error) {
          console.error('========== CLOUDINARY UPLOAD ERROR ==========');
          console.error('Resource type:', resourceType);
          console.error('Folder:', folder);
          console.error('Error:', error);
          console.error('==============================================');

          return reject(error);
        }

        console.log('========== CLOUDINARY UPLOAD SUCCESS ==========');
        console.log('Resource type:', result.resource_type);
        console.log('Public ID:', result.public_id);
        console.log('URL:', result.secure_url);
        console.log('===============================================');

        return resolve(result);
      }
    );

    stream.on('error', (error) => {
      console.error('========== CLOUDINARY STREAM ERROR ==========');
      console.error(error);
      console.error('==============================================');

      reject(error);
    });

    stream.end(buffer);
  });

/**
 * Delete an asset from Cloudinary by public ID.
 * @param {string} publicId
 * @param {'image'|'video'} resourceType
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Cloudinary delete failed for ${publicId}: ${err.message}`);
    return null;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
