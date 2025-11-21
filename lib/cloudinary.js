import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload an image to Cloudinary
 * @param {string} base64Image - Base64 encoded image string
 * @param {object} options - Upload options
 * @returns {Promise<object>} Upload result
 */
export async function uploadToCloudinary(base64Image, options = {}) {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: options.folder || 'solar-panels',
      resource_type: 'image',
      transformation: options.transformation || [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      ...options
    })

    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<object>} Deletion result
 */
export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

/**
 * Get optimized image URL
 * @param {string} publicId - Public ID of the image
 * @param {object} options - Transformation options
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    transformation: [
      { width: options.width || 800, crop: 'scale' },
      { quality: options.quality || 'auto' },
      { fetch_format: 'auto' }
    ]
  })
}

export default cloudinary

