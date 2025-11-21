'use client'

import { useEffect, useState } from 'react'
import PanelCard from './PanelCard'

export default function PanelGrid() {
  const [panels, setPanels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPanels()

    const interval = setInterval(fetchPanels, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchPanels = async () => {
    try {
      const response = await fetch('/api/panels')
      if (!response.ok) throw new Error('Failed to fetch panels')
      const data = await response.json()
      console.log("Panel's data: ",data)
      setPanels(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error}
      </div>
    )
  }

  if (panels.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <p className="text-yellow-800 text-lg">No panels found. Add your first panel to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {panels.map((panel) => (
        <PanelCard key={panel.id ?? panel.panel_id} panel={panel} />
      ))}
    </div>
  )
}

