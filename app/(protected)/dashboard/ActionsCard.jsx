export default function ActionsCard({ panelData }) {
  const getActionConfig = (action) => {
    if (!action) return null

    const actionLower = action.toLowerCase()

    if (actionLower === 'start_clean') {
      return {
        title: 'Nettoyage en cours',
        message: 'Action envoyée : start_clean',
        status: 'active',
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        icon: '🧽',
        description: 'Le système de nettoyage est actif'
      }
    }

    if (actionLower === 'wait') {
      return {
        title: 'En attente',
        message: 'Action envoyée : wait',
        status: 'waiting',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        icon: '⏳',
        description: 'Attente de conditions optimales'
      }
    }

    if (actionLower.includes('blocked')) {
      const blockReason = actionLower.replace('blocked_', '')
      let reasonText = ''

      switch (blockReason) {
        case 'humidity':
          reasonText = 'Humidité trop élevée'
          break
        case 'light':
          reasonText = 'Luminosité insuffisante'
          break
        case 'temperature':
          reasonText = 'Température inadéquate'
          break
        case 'water':
          reasonText = 'Réservoir d\'eau vide'
          break
        default:
          reasonText = 'Condition bloquante détectée'
      }

      return {
        title: 'Action Bloquée',
        message: `Action envoyée : ${action}`,
        status: 'blocked',
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        icon: '🚫',
        description: reasonText
      }
    }

    if (actionLower === 'stop' || actionLower === 'idle') {
      return {
        title: 'Système Arrêté',
        message: 'Action envoyée : stop',
        status: 'stopped',
        color: 'bg-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-800',
        icon: '⏹️',
        description: 'Système en veille'
      }
    }

    // Default case
    return {
      title: 'Action Inconnue',
      message: `Action envoyée : ${action}`,
      status: 'unknown',
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      icon: '❓',
      description: 'Action non reconnue'
    }
  }

  const actionConfig = getActionConfig(panelData?.action)

  if (!actionConfig) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="text-center text-gray-500">
          <span className="text-2xl mb-2 block">⚪</span>
          <p className="font-medium">Aucune action en cours</p>
          <p className="text-sm">Le système est inactif</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${actionConfig.bgColor} ${actionConfig.borderColor} border-2 rounded-xl p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Actions et Commandes</h2>
        <div className={`w-3 h-3 ${actionConfig.color} rounded-full ${
          actionConfig.status === 'active' ? 'animate-pulse' : ''
        }`}></div>
      </div>

      {/* Action Display */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{actionConfig.icon}</div>
        <h3 className={`text-2xl font-bold mb-2 ${actionConfig.textColor}`}>
          {actionConfig.title}
        </h3>
        <p className={`text-lg font-medium ${actionConfig.textColor}`}>
          {actionConfig.message}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          {actionConfig.description}
        </p>
      </div>

      {/* Action Details */}
      <div className="bg-white bg-opacity-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Détails de l&apos;Action</h4>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">État du système:</span>
            <span className={`font-bold ${actionConfig.textColor}`}>
              {actionConfig.status === 'active' && 'ACTIF'}
              {actionConfig.status === 'waiting' && 'EN ATTENTE'}
              {actionConfig.status === 'blocked' && 'BLOQUÉ'}
              {actionConfig.status === 'stopped' && 'ARRÊTÉ'}
              {actionConfig.status === 'unknown' && 'INCONNU'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Commande MQTT:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {panelData?.mqtt_command || panelData?.action || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Dernière exécution:</span>
            <span className="text-gray-900">
              {panelData?.action_timestamp
                ? new Date(panelData.action_timestamp).toLocaleString()
                : panelData?.timestamp
                  ? new Date(panelData.timestamp).toLocaleString()
                  : 'N/A'
              }
            </span>
          </div>

          {panelData?.action_duration && (
            <div className="flex justify-between">
              <span className="text-gray-600">Durée estimée:</span>
              <span className="text-gray-900">{panelData.action_duration}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicator for Active Actions */}
      {actionConfig.status === 'active' && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-700">Progression</span>
            <span className="text-gray-600">En cours...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 ${actionConfig.color} rounded-full animate-pulse`} style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Warning for Blocked Actions */}
      {actionConfig.status === 'blocked' && (
        <div className="mt-4 bg-red-100 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">⚠️</span>
            <span className="text-sm text-red-800 font-medium">
              Action impossible - résoudre la condition bloquante
            </span>
          </div>
        </div>
      )}
    </div>
  )
}