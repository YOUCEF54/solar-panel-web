'use client'

import { useState } from 'react'

const CLASS_OPTIONS = [
  { value: 'clean', label: 'Clean' },
  { value: 'dusty', label: 'Dusty' },
  { value: 'bird_drop', label: 'Bird drop' },
  { value: 'damaged', label: 'Damaged' },
]

export default function PredictionFeedback({ panel }) {
  const [submitting, setSubmitting] = useState(false)
  const [correctedClass, setCorrectedClass] = useState(
    (panel?.predictions?.condition || '').toLowerCase() || 'clean',
  )
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (isCorrect) => {
    setSubmitting(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch(`/api/panels/${encodeURIComponent(panel.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback: {
            is_correct: isCorrect,
            predicted_class: panel.predictions.condition,
            corrected_class: isCorrect ? panel.predictions.condition : correctedClass,
            confidence: panel.predictions.confidence_raw ?? panel.predictions.confidence,
            timestamp: panel.predictions.timestamp,
          },
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to submit feedback')
      }

      setMessage(isCorrect ? 'Feedback submitted as correct.' : 'Correction submitted.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <p className="text-sm text-gray-700 mb-2">Is this prediction correct?</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
          >
            Mark as correct
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
          >
            Mark as incorrect
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">If incorrect, select the correct class:</span>
          <select
            value={correctedClass}
            onChange={(e) => setCorrectedClass(e.target.value)}
            className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white"
          >
            {CLASS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {message && <p className="mt-2 text-xs text-green-700">{message}</p>}
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  )
}

