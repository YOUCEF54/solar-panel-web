'use client'

export default function SensorData({ panel }) {
  const formatValue = (value, unit = '') => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'number') {
      return `${value.toFixed(1)}${unit}`
    }
    return value
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-2 gap-3 text-sm">
        {panel.temperature !== null && panel.temperature !== undefined && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
            </svg>
            <span className="text-gray-600">
              {formatValue(panel.temperature, '°C')}
            </span>
          </div>
        )}

        {panel.humidity !== null && panel.humidity !== undefined && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.4 14.4a2 2 0 01.8.4l2.4 2.4a2 2 0 002.8 0l2.4-2.4a2 2 0 01.8-.4M6 12h8M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-gray-600">
              {formatValue(panel.humidity, '%')}
            </span>
          </div>
        )}

        {panel.light !== null && panel.light !== undefined && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.757 15.657a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zM4 11a1 1 0 01-1-1 1 1 0 110-2h1a1 1 0 011 1 1 1 0 01-1 1zM4.464 5.464a1 1 0 001.414-1.414L4.172 3.343a1 1 0 00-1.414 1.414l1.706 1.707z" />
            </svg>
            <span className="text-gray-600">
              {formatValue(panel.light, ' lux')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
