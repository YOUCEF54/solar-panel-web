import Navbar from '@/components/Navbar'
import Image from 'next/image'
import StatusBadge from './StatusBadge'
import HistoryChart from './HistoryChart'
import PredictionFeedback from './PredictionFeedback'
import Link from 'next/link'
import { headers } from 'next/headers'

async function getPanelData(id) {
  const headersList = headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = host ? `${protocol}://${host}` : ''

  try {
    const res = await fetch(`${baseUrl}/api/panels/${id}`, { cache: 'no-store' })
    if (!res.ok) {
      throw new Error('Failed to fetch panel data')
    }

    const raw = await res.json()
    const history = Array.isArray(raw.history) ? raw.history : []
    const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
    const latest = sortedHistory[0] || null

    const panel_id = raw.panel_id || id
    const predictedClass = (latest?.predicted_class || '').toLowerCase()

    let status = 'unknown'
    if (predictedClass.includes('clean')) status = 'clean'
    else if (predictedClass.includes('dust')) status = 'dusty'
    else if (predictedClass.includes('damage')) status = 'damaged'
    else if (predictedClass.includes('bird')) status = 'bird_drop'

    const confidenceRaw = typeof latest?.confidence === 'number' ? latest.confidence : null
    const confidenceNormalized =
      typeof confidenceRaw === 'number' ? (confidenceRaw > 1 ? confidenceRaw / 100 : confidenceRaw) : null
    const isSuspicious = typeof confidenceNormalized === 'number' ? confidenceNormalized < 0.65 : false

    return {
      id: panel_id,
      panel_id,
      name: raw.name || `Solar Panel ${panel_id}`,
      status,
      imageUrl: latest?.image_url || null,
      location: raw.location || 'Unknown location',
      efficiency: raw.efficiency ?? null,
      lastChecked: latest?.timestamp || null,
      predictions: {
        condition: latest?.predicted_class || 'Unknown',
        confidence: confidenceNormalized,
        confidence_raw: confidenceRaw,
        timestamp: latest?.timestamp || null,
        is_suspicious: isSuspicious,
      },
      history: sortedHistory,
    }
  } catch (error) {
    console.error('Error loading panel detail, using fallback data:', error)
    return {
      id,
      panel_id: id,
      name: `Solar Panel ${id}`,
      status: 'unknown',
      imageUrl: null,
      location: 'Unknown location',
      efficiency: null,
      lastChecked: null,
      predictions: {
        condition: 'Unknown',
        confidence: null,
        confidence_raw: null,
        timestamp: null,
        is_suspicious: false,
      },
      history: [],
    }
  }
}


function formatConfidence(value) {
  if (typeof value !== 'number') return 'N/A'
  return value > 1 ? `${value.toFixed(2)}%` : `${(value * 100).toFixed(1)}%`
}

export default async function PanelDetailPage({ params }) {
  const panel = await getPanelData(params.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{panel.name}</h1>
              <p className="text-gray-600">{panel.location}</p>
            </div>
            <StatusBadge status={panel.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Current Image</h2>
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              {panel.imageUrl ? (
                <Image
                  src={panel.imageUrl}
                  alt={panel.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No image available</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Last updated: {new Date(panel.lastChecked).toLocaleString()}
            </div>
          </div>

          {/* Predictions & Stats */}
          <div className="space-y-6">
            {/* ML Predictions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">ML Predictions</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-semibold text-lg">{panel.predictions.condition}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-semibold text-lg">{formatConfidence(panel.predictions.confidence)}</span>
                </div>
                {typeof panel.predictions.is_suspicious === 'boolean' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Suspicious:</span>
                    <span
                      className={panel.predictions.is_suspicious ? 'text-red-700 font-semibold' : 'text-green-700'}
                    >
                      {panel.predictions.is_suspicious ? 'Yes (requires review)' : 'No'}
                    </span>
                  </div>
                )}
                {typeof panel.predictions.confidence === 'number' && (
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, panel.predictions.confidence * 100))}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <PredictionFeedback panel={panel} />
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className="font-semibold text-lg">{panel.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${panel.efficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Chart */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Historical Data</h2>
          <HistoryChart
            data={panel.history.map((item) => ({
              date: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '',
              efficiency: panel.efficiency ?? null,
              confidence:
                typeof item.confidence === 'number'
                  ? item.confidence > 1
                    ? item.confidence / 100
                    : item.confidence
                  : null,
            }))}
          />
        </div>
      </main>
    </div>
  )
}

