import Image from 'next/image'
import { useState } from 'react'

export default function LatestImageCard({ panelData, predictions }) {
  const [showValidation, setShowValidation] = useState(false)
  console.log("Last image card: ",panelData)

  // Get the latest prediction with image
  const latestPrediction = predictions.find(pred => pred.image_url) || predictions[0]

  const handleValidation = async (isCorrect) => {
    try {
      console.log('Validation submitted:', { isCorrect, predictionId: latestPrediction?.id })

      // Call the feedback API to submit human validation
      const response = await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          panel_id: latestPrediction?.panel_id || 'P-TEST-3',
          prediction_id: latestPrediction?.id,
          is_correct: isCorrect,
          predicted_class: latestPrediction?.predicted_class,
          corrected_class: isCorrect ? null : (latestPrediction?.predicted_class === 'Clean' ? 'Dirty' : 'Clean'),
          confidence: latestPrediction?.confidence,
          timestamp: latestPrediction?.timestamp,
          reason: isCorrect ? 'Human confirmed AI prediction' : 'Human corrected AI prediction'
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Feedback submitted successfully:', result)
        alert(`✅ Validation soumise avec succès! ${result.message}`)
      } else {
        const error = await response.json()
        console.error('Error submitting feedback:', error)
        alert(`❌ Erreur lors de la soumission: ${error.detail || 'Erreur inconnue'}`)
        return
      }

      setShowValidation(false)

    } catch (error) {
      console.error('Error submitting validation:', error)
      alert(`❌ Erreur réseau: ${error.message}`)
    }
  }

  const needsHumanValidation = panelData?.final_state === 'need_human_validation' ||
                              (latestPrediction?.confidence_level === 'low')

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Dernière Image Analysée</h2>
        {latestPrediction && (
          <span className="text-sm text-gray-500">
            {new Date(latestPrediction.timestamp).toLocaleString()}
          </span>
        )}
      </div>

      {latestPrediction?.image_url ? (
        <div className="space-y-4">
          {/* Image Display */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={latestPrediction.image_url}
              alt="Latest panel image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* AI Analysis Results */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Résultats IA</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Vision IA:</span>
                <span className={`ml-2 font-bold ${
                  latestPrediction.predicted_class === 'Clean' ? 'text-green-600' :
                  latestPrediction.predicted_class === 'Dirty' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {latestPrediction.predicted_class || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-gray-600">Confiance:</span>
                <span className={`ml-2 font-bold ${
                  latestPrediction.confidence_level === 'high' ? 'text-green-600' :
                  latestPrediction.confidence_level === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {(latestPrediction.confidence * 100).toFixed(1)}% ({latestPrediction.confidence_level})
                </span>
              </div>
            </div>

            {/* Top 3 Classes */}
            {latestPrediction.all_classes_sorted && (
              <div className="mt-3">
                <span className="text-sm text-gray-600">Top prédictions:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {latestPrediction.all_classes_sorted.slice(0, 3).map((item, index) => (
                    <span
                      key={item.class_name}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.class_name}: {(item.probability * 100).toFixed(1)}%
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Human Validation Section */}
          {needsHumanValidation && (
            <div className="border-2 border-amber-200 bg-amber-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-amber-800">🤔 Validation Humaine Requise</h4>
                <span className="text-xs text-amber-600">IA incertaine</span>
              </div>

              {!showValidation ? (
                <button
                  onClick={() => setShowValidation(true)}
                  className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Valider manuellement
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-amber-700">
                    L&apos;IA n&apos;est pas sûre de son analyse. Confirmez l&apos;état du panneau :
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleValidation(true)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✅ Confirmer : Propre
                    </button>
                    <button
                      onClick={() => handleValidation(false)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      🧽 Confirmer : Sale
                    </button>
                  </div>
                  <button
                    onClick={() => setShowValidation(false)}
                    className="w-full text-sm text-amber-600 hover:text-amber-800"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Processing Info */}
          <div className="text-xs text-gray-500 text-center">
            Image traitée en {latestPrediction.processing_time_ms}ms • {latestPrediction.panel_id}
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Aucune image récente</p>
            <p className="text-sm">Les images apparaîtront ici après analyse</p>
          </div>
        </div>
      )}
    </div>
  )
}