'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import api from "@/lib/fastapi"; // axios client
import { validateImageFile, isValidBase64Image } from '@/lib/validators'

export default function UploadPage() {
  const [panelId, setPanelId] = useState('P-TEST-1')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const formatConfidence = (value) => {
    if (typeof value !== 'number') return 'N/A'
    return value > 1 ? `${value.toFixed(2)}%` : `${(value * 100).toFixed(1)}%`
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const { valid, error: validationError } = validateImageFile(selectedFile)
      if (!valid) {
        setError(validationError)
        setFile(null)
        setPreview(null)
        setResult(null)
        return
      }

      setFile(selectedFile)
      setError(null)
      setResult(null)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

const handleUpload = async () => {
    if (!file) return setError("Please select a file first");
    if (!panelId.trim()) return setError("Please enter a panel ID");

    setLoading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(file);

      if (!isValidBase64Image(base64)) {
        throw new Error("Invalid image format (base64 expected).");
      }
    const base64Clean = base64.split(',')[1]; // remove prefix

      // 🔥 CALL FASTAPI UPLOAD DIRECTLY
      const uploadRes = await api.post("/upload/image", {
        panel_id: panelId.trim(),
        image_base64: base64Clean,
      });

      const uploadData = uploadRes.data;

      // 🔥 CALL FASTAPI PREDICT DIRECTLY
      const predictRes = await api.post("/predict", {
        panel_id: panelId.trim(),
        image_url: uploadData.image_url,
      });

      const prediction = predictRes.data;

      setResult({
        panel_id: uploadData.panel_id,
        image_url: uploadData.image_url,
        ...prediction,
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Panel Image</h1>
          <p className="text-gray-600 mb-8">Upload a solar panel image for analysis (Admin/Debug Tool)</p>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Panel ID */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Panel ID
              </label>
              <input
                type="text"
                value={panelId}
                onChange={(e) => setPanelId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., P-12"
              />
            </div>

            {/* File Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Preview */}
            {preview && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Upload & Analyze'}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Analysis Complete!</h3>
                <div className="space-y-2 text-sm text-green-800">
                  <p><strong>Panel ID:</strong> {result.panel_id}</p>
                  <p><strong>Predicted Class:</strong> {result.predicted_class}</p>
                  {result.status && (
                    <p><strong>Status:</strong> {result.status}</p>
                  )}
                  <p><strong>Confidence:</strong> {formatConfidence(result.confidence)}</p>
                  {typeof result.confidence_normalized === 'number' && (
                    <p><strong>Confidence (normalized):</strong> {(result.confidence_normalized * 100).toFixed(1)}%</p>
                  )}
                  {typeof result.is_suspicious === 'boolean' && (
                    <p>
                      <strong>Suspicious:</strong>{' '}
                      <span className={result.is_suspicious ? 'text-red-700 font-semibold' : 'text-green-700'}>
                        {result.is_suspicious ? 'Yes (requires review)' : 'No'}
                      </span>
                    </p>
                  )}
                  <p>
                    <strong>Image URL:</strong>{' '}
                    <a
                      href={result.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View
                    </a>
                  </p>
                  {result.scores && (
                    <div className="mt-3">
                      <p className="font-semibold mb-1">Class Scores:</p>
                      <ul className="text-xs sm:text-sm space-y-1">
                        {Object.entries(result.scores).map(([label, score]) => (
                          <li key={label} className="flex justify-between">
                            <span>{label}</span>
                            <span>{(score * 100).toFixed(1)}%</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

