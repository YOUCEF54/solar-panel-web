'use client'

import Link from 'next/link'
import Image from 'next/image'
import SensorData from './SensorData'

export default function PanelCard({ panel }) {
  console.log("Panel data!!! : ",panel)
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'clean':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
      case 'dirty':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical':
      case 'damaged':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const panelId = panel.id || panel.panel_id

  return (
    <Link href={`/panel/${panelId}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-200">
        {/* Panel Image */}
        {/* <div className="relative h-48 bg-gray-200">
          {panel.imageUrl ? (
            <Image
              src={panel.imageUrl}
              alt={panel.name || `Panel ${panel.id}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div> */}

        {/* Panel Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {panel.name || `Panel ${panelId}`}
          </h3>

          {/* Status Badge */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(panel.status)}`}>
                {panel.status || 'Unknown'}
              </span>
              {panel.last_confidence !== undefined && panel.last_confidence !== null && (
                <span className="text-xs text-gray-500">
                  {(panel.last_confidence * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm text-gray-600">
            {panel.location && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {panel.location}
              </div>
            )}
            {panel.last_update && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(panel.last_update).toLocaleDateString()}
              </div>
            )}
            {panel.efficiency && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Efficiency: {panel.efficiency}%
              </div>
            )}
          </div>

          {/* Sensor Data */}
          <SensorData panel={panel} />
        </div>
      </div>
    </Link>
  )
}

