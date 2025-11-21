'use client'

import { useState, useEffect } from 'react'
import { callFastAPI } from '@/lib/fastapi'
import Navbar from '@/components/Navbar'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function HistoryPage() {
  const [stats, setStats] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPanel, setSelectedPanel] = useState('')
  const [days, setDays] = useState(30)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadData()
  }, [selectedPanel, days])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load statistics
      const statsResponse = await callFastAPI('/history/stats', {
        days,
        ...(selectedPanel && { panel_id: selectedPanel })
      }, 'GET')
      setStats(statsResponse)

      // Load recent predictions
      const predictionsResponse = await callFastAPI('/history/predictions', {
        limit: 50,
        days,
        ...(selectedPanel && { panel_id: selectedPanel })
      }, 'GET')
      setPredictions(predictionsResponse.predictions)

    } catch (err) {
      console.error('Error loading history data:', err)
      setError(err.message || 'Failed to load history data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading history data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold">Error Loading Data</h2>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Prediction History</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panel ID (optional)
                </label>
                <input
                  type="text"
                  value={selectedPanel}
                  onChange={(e) => setSelectedPanel(e.target.value)}
                  placeholder="Enter panel ID or leave empty for all"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                  <option value={365}>Last year</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={loadData}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white rounded-lg shadow p-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'charts', label: 'Charts' },
              { id: 'predictions', label: 'Recent Predictions' }
            ].map((tab) => (
              <button
              key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Key Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Predictions</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total_predictions}</p>
              <p className="text-sm text-gray-600">in last {days} days</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Confidence</h3>
              <p className="text-3xl font-bold text-green-600">{(stats.avg_confidence * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-600">across all predictions</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clean Panels</h3>
              <p className="text-3xl font-bold text-emerald-600">{stats.status_distribution.clean || 0}</p>
              <p className="text-sm text-gray-600">out of {stats.total_predictions}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Processing Time</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.avg_processing_time.toFixed(1)}ms</p>
              <p className="text-sm text-gray-600">per prediction</p>
            </div>
          </div>
        )}

        {activeTab === 'charts' && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class Distribution Pie Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Classes Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(stats.class_distribution).map(([name, value]) => ({
                      name,
                      value
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(stats.class_distribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Confidence Levels Bar Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Levels</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(stats.confidence_levels).map(([level, count]) => ({ level, count }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Trend Line Chart */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Prediction Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.daily_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/* Lines with increased strokeWidth */}
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#8884d8" 
                    activeDot={{ r: 4 }} 
                    strokeWidth={3} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clean" 
                    stroke="#82ca9d" 
                    activeDot={{ r: 4 }} 
                    strokeWidth={3} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="dirty" 
                    stroke="#ffc658" 
                    activeDot={{ r: 4 }} 
                    strokeWidth={3} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Predictions</h3>
              <p className="text-sm text-gray-600">Latest {predictions.length} predictions</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Panel ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prediction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Processing Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictions.map((pred, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pred.panel_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pred.predicted_class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          pred.confidence_level === 'high' ? 'bg-green-100 text-green-800' :
                          pred.confidence_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {(pred.confidence * 100).toFixed(1)}% ({pred.confidence_level})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          pred.status === 'clean' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {pred.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{formatDate(pred.timestamp)}</div>
                          <div className="text-gray-500">{formatTime(pred.timestamp)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pred.processing_time_ms}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {predictions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No predictions found for the selected criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
                    </>
  )
}