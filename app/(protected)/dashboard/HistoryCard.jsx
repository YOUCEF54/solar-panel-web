export default function HistoryCard({ panelId, predictions, panelData }) {
  // Combine predictions with current panel state for a complete history
  const getHistoryItems = () => {
    const historyItems = []

    // Add current state as most recent
    if (panelData) {
      historyItems.push({
        id: 'current',
        timestamp: panelData.timestamp || new Date().toISOString(),
        final_state: panelData.final_state || panelData.status,
        ml_prediction: panelData.ml_prediction,
        vision_result: panelData.vision_result,
        sensors: {
          humidity: panelData.humidity,
          light: panelData.light,
          temperature: panelData.temperature,
          water_level: panelData.water_level || panelData.water
        },
        action: panelData.action,
        is_current: true
      })
    }

    // Add prediction history
    predictions.forEach(pred => {
      historyItems.push({
        id: pred.id,
        timestamp: pred.timestamp,
        final_state: pred.status,
        ml_prediction: pred.predicted_class,
        vision_result: pred.predicted_class, // Same as ML for now
        sensors: null, // Historical predictions may not have sensor data
        action: pred.status === 'dirty' ? 'start_clean' : 'wait',
        confidence: pred.confidence,
        is_current: false
      })
    })

    // Sort by timestamp (most recent first)
    return historyItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const historyItems = getHistoryItems()

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-500'

    const statusLower = status.toLowerCase()
    if (statusLower.includes('clean')) return 'text-green-600 bg-green-100'
    if (statusLower.includes('dirty')) return 'text-red-600 bg-red-100'
    if (statusLower.includes('wait')) return 'text-yellow-600 bg-yellow-100'
    if (statusLower.includes('blocked')) return 'text-red-600 bg-red-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getActionIcon = (action) => {
    if (!action) return '⏸️'

    const actionLower = action.toLowerCase()
    if (actionLower === 'start_clean') return '🧽'
    if (actionLower === 'wait') return '⏳'
    if (actionLower.includes('blocked')) return '🚫'
    if (actionLower === 'stop') return '⏹️'
    return '❓'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Historique des Décisions</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {historyItems.length} entrées
        </span>
      </div>

      {historyItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  État Final
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vision IA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capteurs
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyItems.map((item, index) => {
                const { date, time } = formatDateTime(item.timestamp)

                return (
                  <tr key={item.id} className={`${item.is_current ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                    {/* Date & Time */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{date}</span>
                        <span className="text-sm text-gray-500">{time}</span>
                        {item.is_current && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            ACTUEL
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Final State */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.final_state)}`}>
                        {item.final_state || 'N/A'}
                      </span>
                      {item.confidence && (
                        <div className="text-xs text-gray-500 mt-1">
                          {(item.confidence * 100).toFixed(1)}%
                        </div>
                      )}
                    </td>

                    {/* AI Vision */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">
                          {item.vision_result || item.ml_prediction || 'N/A'}
                        </span>
                        {item.ml_prediction && item.ml_prediction !== item.vision_result && (
                          <span className="text-xs text-gray-500">
                            ML: {item.ml_prediction}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Sensors */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {item.sensors ? (
                        <div className="text-xs space-y-1">
                          {item.sensors.humidity !== undefined && (
                            <div className="flex justify-between">
                              <span>💧</span>
                              <span>{item.sensors.humidity}%</span>
                            </div>
                          )}
                          {item.sensors.temperature !== undefined && (
                            <div className="flex justify-between">
                              <span>🌡️</span>
                              <span>{item.sensors.temperature}°C</span>
                            </div>
                          )}
                          {item.sensors.light !== undefined && (
                            <div className="flex justify-between">
                              <span>☀️</span>
                              <span>{item.sensors.light}lux</span>
                            </div>
                          )}
                          {item.sensors.water_level && (
                            <div className="flex justify-between">
                              <span>🚰</span>
                              <span>{item.sensors.water_level}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getActionIcon(item.action)}</span>
                        <span className="text-sm text-gray-900">
                          {item.action || 'Aucune'}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun historique</h3>
          <p className="text-gray-600">Les décisions apparaîtront ici après les premières analyses.</p>
        </div>
      )}

      {/* Summary Stats */}
      {historyItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">
                {historyItems.filter(item => item.final_state?.toLowerCase().includes('clean')).length}
              </div>
              <div className="text-xs text-gray-600">Nettoyages</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">
                {historyItems.filter(item => item.final_state?.toLowerCase().includes('dirty')).length}
              </div>
              <div className="text-xs text-gray-600">Sales détectés</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">
                {historyItems.filter(item => item.action === 'start_clean').length}
              </div>
              <div className="text-xs text-gray-600">Actions nettoyage</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">
                {historyItems.filter(item => item.final_state?.toLowerCase().includes('blocked')).length}
              </div>
              <div className="text-xs text-gray-600">Bloquages</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}