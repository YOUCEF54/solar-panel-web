/*
 Basic sanity check script for Smart Solar Panel Cleaner.

 This script verifies that all critical environment variables needed for the
 prediction pipeline are present before starting the app.

 Run with:
   npm run test:sanity
*/

import fs from 'fs'
import path from 'path'

// Lightweight loader for .env.local so the script works in local dev
// without needing you to export variables manually.
const projectRoot = path.resolve(process.cwd())
const envPath = path.join(projectRoot, '.env.local')

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

const requiredEnv = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'FASTAPI_URL',
  'DATABASE_URL',
]

const missing = requiredEnv.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:')
  for (const key of missing) {
    console.error(` - ${key}`)
  }
  process.exit(1)
}

console.log('✅ All required environment variables are set.')

