'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function HistoryChart({ data }) {
  // Mock data if no data provided
  const chartData = data && data.length > 0 ? data : [
    { date: '2024-01-01', efficiency: 92, confidence: 0.88 },
    { date: '2024-01-02', efficiency: 94, confidence: 0.91 },
    { date: '2024-01-03', efficiency: 91, confidence: 0.85 },
    { date: '2024-01-04', efficiency: 95, confidence: 0.93 },
    { date: '2024-01-05', efficiency: 93, confidence: 0.89 },
    { date: '2024-01-06', efficiency: 96, confidence: 0.95 },
    { date: '2024-01-07', efficiency: 94, confidence: 0.92 },
  ]

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No historical data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            label={{ value: 'Confidence', angle: 90, position: 'insideRight' }}
            domain={[0, 1]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
            formatter={(value, name) => {
              if (name === 'confidence') {
                return [(value * 100).toFixed(1) + '%', 'Confidence']
              }
              return [value + '%', 'Efficiency']
            }}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="efficiency" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Efficiency"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="confidence" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Confidence"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

