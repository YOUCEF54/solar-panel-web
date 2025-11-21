export default function NotificationsCard({ panelData, status }) {
  const generateNotifications = (panelData, status) => {
    const notifications = []

    // Water level alerts
    if (panelData?.water_level === 'VIDE' || panelData?.water === 'VIDE' || panelData?.water === 'LOW') {
      notifications.push({
        id: 'water_empty',
        type: 'critical',
        icon: '🚫',
        title: 'Réservoir vide !',
        message: 'Nettoyage impossible.',
        color: 'bg-red-100 border-red-200 text-red-800'
      })
    }

    // Humidity alerts
    if (panelData?.humidity > 80) {
      notifications.push({
        id: 'high_humidity',
        type: 'warning',
        icon: '☁️',
        title: 'Humidité trop élevée',
        message: 'Mesure impossible en conditions humides.',
        color: 'bg-blue-100 border-blue-200 text-blue-800'
      })
    }

    // Light level alerts
    if (panelData?.light < 100) {
      notifications.push({
        id: 'low_light',
        type: 'warning',
        icon: '🌙',
        title: 'Luminosité insuffisante',
        message: 'Conditions d\'analyse suboptimales.',
        color: 'bg-purple-100 border-purple-200 text-purple-800'
      })
    }

    // Temperature alerts
    if (panelData?.temperature > 35 || panelData?.temperature < 5) {
      notifications.push({
        id: 'extreme_temp',
        type: 'critical',
        icon: '🌡️',
        title: 'Température extrême',
        message: 'Conditions de fonctionnement limites.',
        color: 'bg-orange-100 border-orange-200 text-orange-800'
      })
    }

    // Human validation needed
    if (status === 'need_human_validation') {
      notifications.push({
        id: 'human_validation',
        type: 'info',
        icon: '🤖',
        title: 'Validation IA incertaine',
        message: 'Confirmation humaine requise.',
        color: 'bg-amber-100 border-amber-200 text-amber-800'
      })
    }

    // Cleaning completed
    if (panelData?.last_action === 'cleaning_completed' || panelData?.action_status === 'completed') {
      notifications.push({
        id: 'cleaning_done',
        type: 'success',
        icon: '🟢',
        title: 'Nettoyage terminé',
        message: 'Opération réalisée avec succès.',
        color: 'bg-green-100 border-green-200 text-green-800'
      })
    }

    // Panel is dirty and ready for cleaning
    if (status === 'dirty' && panelData?.action === 'start_clean') {
      notifications.push({
        id: 'ready_to_clean',
        type: 'info',
        icon: '🧽',
        title: 'Prêt pour nettoyage',
        message: 'Panneau sale détecté - nettoyage en cours.',
        color: 'bg-blue-100 border-blue-200 text-blue-800'
      })
    }

    // System blocked
    if (status?.includes('blocked')) {
      notifications.push({
        id: 'system_blocked',
        type: 'critical',
        icon: '🚫',
        title: 'Système bloqué',
        message: 'Résoudre les conditions bloquantes.',
        color: 'bg-red-100 border-red-200 text-red-800'
      })
    }

    // No notifications
    if (notifications.length === 0) {
      notifications.push({
        id: 'all_good',
        type: 'success',
        icon: '✅',
        title: 'Système opérationnel',
        message: 'Toutes les conditions sont optimales.',
        color: 'bg-green-100 border-green-200 text-green-800'
      })
    }

    return notifications
  }

  const notifications = generateNotifications(panelData, status)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {notifications.length}
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 ${notification.color}`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg flex-shrink-0">{notification.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm opacity-90">
                  {notification.message}
                </p>
                {notification.timestamp && (
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          {notifications.filter(n => n.type === 'critical').length > 0 && (
            <span className="text-red-600 font-bold">
              ⚠️ {notifications.filter(n => n.type === 'critical').length} critique(s)
            </span>
          )}
          {notifications.filter(n => n.type === 'warning').length > 0 && (
            <span className="text-yellow-600 font-bold ml-2">
              ⚡ {notifications.filter(n => n.type === 'warning').length} avertissement(s)
            </span>
          )}
          {notifications.filter(n => n.type === 'success').length > 0 && (
            <span className="text-green-600 font-bold ml-2">
              ✅ {notifications.filter(n => n.type === 'success').length} succès
            </span>
          )}
        </div>
      </div>
    </div>
  )
}