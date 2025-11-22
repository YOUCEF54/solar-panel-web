import axios from 'axios'
import { getStoredBackendTokens } from './auth'

const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'

const fastapiClient = axios.create({
  baseURL: FASTAPI_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

fastapiClient.interceptors.request.use(
  (config) => {
    try {
      const tokens = getStoredBackendTokens()
      if (tokens && tokens.access_token) {
        config.headers.Authorization = `Bearer ${tokens.access_token}`
      }
    } catch (error) {
      console.warn('Could not retrieve auth token:', error.message)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

fastapiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('FastAPI Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

/**
 * Call FastAPI endpoint
 * @param {string} endpoint - API endpoint path
 * @param {object} data - Request data
 * @param {string} method - HTTP method (default: POST)
 * @returns {Promise<object>} API response data
 */
export async function callFastAPI(endpoint, data = {}, method = 'POST') {
  try {
    const response = await fastapiClient({
      method,
      url: endpoint,
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? data : undefined,
    })

    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
    throw new Error(`FastAPI request failed: ${errorMessage}`)
  }
}

/**
 * Get prediction from ML model
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<object>} Prediction result
 */
export async function getPrediction(imageUrl) {
  return callFastAPI('/predict', { image_url: imageUrl })
}

/**
 * Get model health status
 * @returns {Promise<object>} Health status
 */
export async function getModelHealth() {
  return callFastAPI('/health', {}, 'GET')
}

/**
 * Batch predict multiple images
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {Promise<object[]>} Array of predictions
 */
export async function batchPredict(imageUrls) {
  return callFastAPI('/batch-predict', { image_urls: imageUrls })
}

/**
 * Fetch all panels from FastAPI backend
 */
export async function getPanels() {
  return callFastAPI('/panels', {}, 'GET')
}

/**
 * Fetch a single panel by ID from FastAPI backend
 * @param {string} panelId
 */
export async function getPanelById(panelId) {
  return callFastAPI(`/panels/${panelId}`, {}, 'GET')
}

/**
 * Get prediction history for a specific panel
 * @param {string} panelId - Panel ID
 * @param {number} limit - Maximum number of results
 */
export async function getPredictionHistory(panelId, limit = 20) {
  return callFastAPI(`/history/panel/${panelId}`, { limit }, 'GET')
}

/**
 * Submit feedback/correction for a panel prediction
 * This is a thin wrapper over the FastAPI feedback endpoint.
 * @param {object} payload - { panel_id, prediction_id?, corrected_class?, is_correct, reason? }
 */
export async function submitFeedback(payload) {
  return callFastAPI('/feedback', payload, 'POST')
}

/**
 * Send a cleaning command to an ESP32 device via MQTT
 * @param {object} payload - { device_id, final_state }
 */
export async function sendCleaningCommand(payload) {
  return callFastAPI('/mqtt/cleaning-command', payload, 'POST')
}

export default fastapiClient

