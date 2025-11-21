export default function SensorDataCard({ panelData }) {
  const getSensorStatus = (value, type) => {
    if (value === null || value === undefined) return { status: 'unknown', color: 'text-gray-500' }

    switch (type) {
      case 'humidity':
        if (value > 80) return { status: 'high', color: 'text-red-600' }
        if (value > 60) return { status: 'medium', color: 'text-yellow-600' }
        return { status: 'good', color: 'text-green-600' }

      case 'temperature':
        if (value > 35 || value < 5) return { status: 'extreme', color: 'text-red-600' }
        if (value > 30 || value < 10) return { status: 'warning', color: 'text-yellow-600' }
        return { status: 'good', color: 'text-green-600' }

      case 'light':
        if (value < 100) return { status: 'low', color: 'text-yellow-600' }
        if (value < 50) return { status: 'very_low', color: 'text-red-600' }
        return { status: 'good', color: 'text-green-600' }

      case 'water':
        if (value === 'VIDE' || value === 'LOW') return { status: 'empty', color: 'text-red-600' }
        return { status: 'good', color: 'text-green-600' }

      default:
        return { status: 'unknown', color: 'text-gray-500' }
    }
  }

  const sensors = [
    {
      key: 'humidity',
      label: 'Humidité',
      value: panelData?.humidity,
      unit: '%',
      icon: '💧',
      description: 'Niveau d\'humidité ambiant'
    },
    {
      key: 'light',
      label: 'Luminosité',
      value: panelData?.light,
      unit: 'lux',
      icon: '☀️',
      description: 'Intensité lumineuse'
    },
    {
      key: 'temperature',
      label: 'Température',
      value: panelData?.temperature,
      unit: '°C',
      icon: '🌡️',
      description: 'Température ambiante'
    },
    {
      key: 'water_level',
      label: 'Niveau d\'Eau',
      value: panelData?.water_level || panelData?.water,
      unit: '',
      icon: '🚰',
      description: 'État du réservoir d\'eau',
      isText: true
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Capteurs en Direct</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {sensors.map((sensor) => {
          const sensorStatus = getSensorStatus(sensor.value, sensor.key)

          return (
            <div key={sensor.key} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{sensor.icon}</span>
                  <span className="font-medium text-gray-900">{sensor.label}</span>
                </div>
                <span className={`text-sm font-bold ${sensorStatus.color}`}>
                  {sensor.value !== null && sensor.value !== undefined
                    ? sensor.isText
                      ? sensor.value
                      : `${sensor.value}${sensor.unit}`
                    : 'N/A'
                  }
                </span>
              </div>

              <p className="text-xs text-gray-600 mb-2">{sensor.description}</p>

              {/* Status indicator */}
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${sensorStatus.color}`}>
                  {sensorStatus.status === 'good' && 'Conditions optimales'}
                  {sensorStatus.status === 'medium' && 'Conditions acceptables'}
                  {sensorStatus.status === 'high' && 'Trop élevé'}
                  {sensorStatus.status === 'low' && 'Trop faible'}
                  {sensorStatus.status === 'very_low' && 'Très faible'}
                  {sensorStatus.status === 'extreme' && 'Conditions extrêmes'}
                  {sensorStatus.status === 'empty' && 'Réservoir vide'}
                  {sensorStatus.status === 'unknown' && 'Donnée indisponible'}
                </span>

                {sensor.key === 'humidity' && sensor.value > 60 && (
                  <span className="text-red-600 font-bold">⚠️ Risque mesure</span>
                )}
                {sensor.key === 'light' && sensor.value < 100 && (
                  <span className="text-yellow-600 font-bold">⚠️ Lumière faible</span>
                )}
                {sensor.key === 'temperature' && (sensor.value > 35 || sensor.value < 5) && (
                  <span className="text-red-600 font-bold">⚠️ Température extrême</span>
                )}
                {(sensor.key === 'water_level' || sensor.key === 'water') &&
                 (sensor.value === 'VIDE' || sensor.value === 'LOW') && (
                  <span className="text-red-600 font-bold">🚫 Nettoyage impossible</span>
                )}
              </div>
            </div>
          )
        })}

        {/* RGB Delta Section */}
        {panelData?.rgb_delta !== undefined && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎨</span>
                <span className="font-medium text-gray-900">ΔRGB</span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {panelData.rgb_delta}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">Différence de couleur détectée</p>
            <div className="text-xs text-gray-500">
              Valeur de référence pour l&apos;analyse couleur
            </div>
          </div>
        )}

        {/* Pre-decision Section */}
        {panelData?.pre_decision && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🤖</span>
                <span className="font-medium text-blue-900">Pré-décision Locale</span>
              </div>
              <span className={`text-sm font-bold ${
                panelData.pre_decision.includes('clean') ? 'text-green-600' : 'text-red-600'
              }`}>
                {panelData.pre_decision}
              </span>
            </div>
            <p className="text-xs text-blue-700">
              Décision basée sur les capteurs avant analyse IA complète
            </p>
          </div>
        )}

        {/* Last Update Timestamp */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-200">
          Dernière mise à jour: {panelData?.timestamp
            ? new Date(panelData.timestamp).toLocaleString()
            : 'Jamais'
          }
        </div>
      </div>
    </div>
  )
}