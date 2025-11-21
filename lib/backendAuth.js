import { callFastAPI } from './fastapi'
import { getBackendTokens, storeBackendTokens, clearBackendTokens } from './auth'

export async function registerBackendUser(firstName, lastName, email, password) {
  return callFastAPI('/auth/register', {
    first_name: firstName,
    last_name: lastName,
    email,
    password
  }, 'POST')
}

export async function loginBackendUser(email, password) {
  return callFastAPI('/auth/login', {
    email,
    password
  }, 'POST')
}

export async function syncFirebaseAndGetTokens() {
  try {
    const tokens = await getBackendTokens()
    await storeBackendTokens(tokens)
    return tokens
  } catch (error) {
    console.error('Failed to sync Firebase with backend:', error)
    throw error
  }
}

export async function getCurrentUser() {
  return callFastAPI('/auth/me', {}, 'GET')
}

export async function refreshAccessToken(refreshToken) {
  return callFastAPI('/auth/refresh', {
    refresh_token: refreshToken
  }, 'POST')
}

export async function logoutBackendUser() {
  try {
    await callFastAPI('/auth/logout', {}, 'POST')
  } finally {
    clearBackendTokens()
  }
}

export async function getAPIHealth() {
  return callFastAPI('/', {}, 'GET')
}

export async function testFirebaseConnection() {
  return callFastAPI('/test-firebase', {}, 'GET')
}

export async function testMQTTConnection() {
  return callFastAPI('/test-mqtt', {}, 'GET')
}
