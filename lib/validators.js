/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {object} { valid: boolean, error: string }
 */
export function validateImageFile(file) {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
    }
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'File size exceeds 10MB limit.' 
    }
  }

  return { valid: true, error: null }
}

/**
 * Validate base64 image string
 * @param {string} base64 - Base64 string to validate
 * @returns {boolean} True if valid
 */
export function isValidBase64Image(base64) {
  if (!base64 || typeof base64 !== 'string') {
    return false
  }

  const base64Regex = /^data:image\/(jpeg|jpg|png|webp);base64,/
  return base64Regex.test(base64)
}

/**
 * Validate panel data
 * @param {object} data - Panel data to validate
 * @returns {object} { valid: boolean, errors: string[] }
 */
export function validatePanelData(data) {
  const errors = []

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Panel name is required')
  }

  if (!data.location || data.location.trim().length === 0) {
    errors.push('Location is required')
  }

  if (data.efficiency !== undefined) {
    const efficiency = Number(data.efficiency)
    if (isNaN(efficiency) || efficiency < 0 || efficiency > 100) {
      errors.push('Efficiency must be between 0 and 100')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500) // Limit length
}

/**
 * Validate API response
 * @param {object} response - API response to validate
 * @param {string[]} requiredFields - Required fields
 * @returns {boolean} True if valid
 */
export function validateApiResponse(response, requiredFields = []) {
  if (!response || typeof response !== 'object') {
    return false
  }

  return requiredFields.every(field => field in response)
}

/**
 * Validate prediction result from FastAPI
 * Supports confidence in [0,1] or [0,100] and uses `predicted_class`.
 * @param {object} prediction - Prediction object
 * @returns {object} { valid: boolean, error: string | null, confidence_normalized: number, is_suspicious: boolean }
 */
export function validatePrediction(prediction) {
  if (!prediction || typeof prediction !== 'object') {
    return { valid: false, error: 'Invalid prediction object', confidence_normalized: 0, is_suspicious: false }
  }

  if (!prediction.predicted_class || typeof prediction.predicted_class !== 'string') {
    return { valid: false, error: 'Missing or invalid predicted_class', confidence_normalized: 0, is_suspicious: false }
  }

  if (prediction.confidence === undefined || typeof prediction.confidence !== 'number') {
    return { valid: false, error: 'Missing or invalid confidence value', confidence_normalized: 0, is_suspicious: false }
  }

  const raw = prediction.confidence
  const confidence_normalized = raw > 1 ? raw / 100 : raw

  if (confidence_normalized < 0 || confidence_normalized > 1) {
    return { valid: false, error: 'Confidence must be between 0 and 1 (after normalization)', confidence_normalized, is_suspicious: false }
  }

  const is_suspicious = isSuspiciousPrediction(confidence_normalized)

  return { valid: true, error: null, confidence_normalized, is_suspicious }
}

/**
 * Returns true if a prediction should be considered suspicious
 * according to the spec: confidence < 0.65
 */
export function isSuspiciousPrediction(confidence_normalized) {
  return confidence_normalized < 0.65
}

/**
 * Helper to decide when to trigger model retraining based on
 * accumulated suspicious predictions.
 */
export function shouldTriggerRetraining(suspiciousCount, threshold = 500) {
  return typeof suspiciousCount === 'number' && suspiciousCount >= threshold
}

