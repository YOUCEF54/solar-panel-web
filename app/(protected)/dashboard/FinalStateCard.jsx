export default function FinalStateCard({ status, panelData }) {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || 'unknown'

    switch (statusLower) {
      case 'clean':
        return {
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          title: 'Panneau Propre',
          message: 'Aucun nettoyage nécessaire',
          icon: '✅'
        }

      case 'dirty':
        return {
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          title: 'Panneau Sale',
          message: 'Nettoyage recommandé',
          icon: '🧽'
        }

      case 'wait':
        return {
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          title: 'En Attente',
          message: 'Conditions optimales requises',
          icon: '⏳'
        }

      case 'blocked_humidity':
        return {
          color: 'bg-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          title: 'Humidité Élevée',
          message: 'Mesure impossible - trop humide',
          icon: '💧'
        }

      case 'blocked_light':
        return {
          color: 'bg-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-800',
          title: 'Luminosité Insuffisante',
          message: 'Mesure impossible - lumière faible',
          icon: '🌙'
        }

      case 'blocked_temperature':
        return {
          color: 'bg-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          title: 'Température Extrême',
          message: 'Mesure impossible - température inadéquate',
          icon: '🌡️'
        }

      case 'blocked_water':
        return {
          color: 'bg-cyan-500',
          bgColor: 'bg-cyan-50',
          borderColor: 'border-cyan-200',
          textColor: 'text-cyan-800',
          title: 'Réservoir Vide',
          message: 'Impossible de nettoyer - eau insuffisante',
          icon: '🚫'
        }

      case 'need_human_validation':
        return {
          color: 'bg-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800',
          title: 'Validation Humaine Requise',
          message: 'IA incertaine - confirmation nécessaire',
          icon: '🤔'
        }

      default:
        return {
          color: 'bg-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          title: 'État Inconnu',
          message: 'Statut non déterminé',
          icon: '❓'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6 shadow-lg`}>
      {/* Header with Status Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 ${config.color} rounded-full animate-pulse`}></div>
          <h2 className="text-2xl font-bold text-gray-900">État Final du Panneau</h2>
        </div>
        <span className="text-3xl">{config.icon}</span>
      </div>

      {/* Main Status Display */}
      <div className="text-center mb-6">
        <h3 className={`text-4xl font-bold mb-2 ${config.textColor}`}>
          {config.title}
        </h3>
        <p className={`text-lg ${config.textColor}`}>
          {config.message}
        </p>
      </div>

      {/* Status Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white bg-opacity-50 rounded-lg p-3">
          <div className="font-semibold text-gray-700">Vision IA</div>
          <div className={`font-bold ${config.textColor}`}>
            {panelData?.vision_result || 'N/A'}
          </div>
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg p-3">
          <div className="font-semibold text-gray-700">ML Decision</div>
          <div className={`font-bold ${config.textColor}`}>
            {panelData?.ml_prediction || 'N/A'}
          </div>
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg p-3">
          <div className="font-semibold text-gray-700">Action</div>
          <div className={`font-bold ${config.textColor}`}>
            {panelData?.action || 'Aucune'}
          </div>
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg p-3">
          <div className="font-semibold text-gray-700">Dernière MAJ</div>
          <div className="font-bold text-gray-600">
            {panelData?.timestamp ? new Date(panelData.timestamp).toLocaleTimeString() : 'N/A'}
          </div>
        </div>
      </div>

      {/* Confidence Indicator if available */}
      {panelData?.confidence && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Confiance IA</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${config.color}`}
                  style={{ width: `${Math.min(panelData.confidence * 100, 100)}%` }}
                ></div>
              </div>
              <span className={`text-sm font-bold ${config.textColor}`}>
                {(panelData.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}