'use client'

import { useState, useEffect, useCallback } from 'react'
import { getPanels, getPanelById } from '@/lib/fastapi'
import { getPredictionHistory } from '@/lib/fastapi'
import { syncFirebaseAndGetTokens } from '@/lib/backendAuth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/Firebase'
import {
  Sun,
  Droplets,
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
  Zap,
  RefreshCw,
  Server,
  Wifi
} from 'lucide-react'
import FinalStateCard from './FinalStateCard'
import LatestImageCard from './LatestImageCard'
import SensorDataCard from './SensorDataCard'
import ActionsCard from './ActionsCard'
import HistoryCard from './HistoryCard'
import NotificationsCard from './NotificationsCard'
import Navbar from '@/components/Navbar'

export default function DashboardPage() {
  const [selectedPanelId, setSelectedPanelId] = useState(null) // Will be set after fetching available panels
  const [availablePanels, setAvailablePanels] = useState([])
  const [panelData, setPanelData] = useState(null)
  const [recentPredictions, setRecentPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  // Authentication setup (mocked for testing)
  useEffect(() => {
    // Temporarily mock authentication for testing
    const mockUser = { email: 'test@example.com', uid: 'test-uid' };
    setUser(mockUser);

    // Mock backend tokens are already set in AuthProvider
    console.log('Mock authentication set up for testing');

    // Original Firebase auth code (commented out for testing)
    // const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    //   setUser(currentUser)
    //   if (currentUser) {
    //     try {
    //       // Sync Firebase auth with backend to get JWT tokens
    //       await syncFirebaseAndGetTokens()
    //       console.log('Backend authentication synced successfully')
    //     } catch (error) {
    //       console.error('Failed to sync backend authentication:', error)
    //       // If authentication fails, redirect to login
    //       window.location.href = '/auth/login'
    //     }
    //   } else {
    //     // If no user, redirect to login
    //     window.location.href = '/auth/login'
    //   }
    // })
    //
    // return () => unsubscribe()
  }, [])

  // Helper functions for state configuration
  const getStateConfig = (state) => {
    switch (state) {
      case 'clean':
        return {
          color: 'bg-emerald-100 border-emerald-500 text-emerald-800',
          icon: <CheckCircle className="w-12 h-12 text-emerald-600"/>,
          label: 'Clean'
        };
      case 'dirty' :
        return {
          color: 'bg-red-100 border-red-500 text-red-800',
          icon: <AlertTriangle className="w-12 h-12 text-red-600"/>,
          label: 'Dirty'
        };
      case 'Dusty':
        return {
          color: 'bg-red-100 border-red-500 text-red-800',
          icon: <AlertTriangle className="w-12 h-12 text-red-600"/>,
          label: 'Dusty'
        };
      case 'Physical-damage':
        return {
          color: 'bg-red-100 border-red-500 text-red-800',
          icon: <AlertTriangle className="w-12 h-12 text-red-600"/>,
          label: 'Physical Damage'
        };
      case 'Snow-Covered':
        return {
          color: 'bg-red-100 border-red-500 text-red-800',
          icon: <AlertTriangle className="w-12 h-12 text-red-600"/>,
          label: 'Snow Covered'
        };
      case 'Bird-drop':
        return {
          color: 'bg-red-100 border-red-500 text-red-800',
          icon: <AlertTriangle className="w-12 h-12 text-red-600"/>,
          label: 'Bird Drop'
        };
      case 'need_human_validation':
        return {
          color: 'bg-orange-100 border-orange-500 text-orange-800',
          icon: <Camera className="w-12 h-12 text-orange-600"/>,
          label: 'Validation Required'
        };
      case 'wait':
      case 'blocked_humidity':
      case 'blocked_light':
      case 'blocked_temperature':
      case 'blocked_water':
        return {
          color: 'bg-slate-100 border-slate-400 text-slate-700',
          icon: <Clock className="w-12 h-12 text-slate-500"/>,
          label: 'Wait / Blocked'
        };
      default:
        return {
          color: 'bg-gray-50 border-gray-300 text-gray-600',
          icon: <Activity className="w-12 h-12 text-gray-400"/>,
          label: 'Unknown'
        };
    }
  };

  const getStatusMessage = (state) => {
    switch (state) {
      case 'clean': return "Panneau propre – aucun nettoyage nécessaire";
      case 'dirty': return "Panneau sale – nettoyage recommandé";
      case 'wait': return "En attente de meilleures conditions";
      case 'blocked_water': return "Réservoir vide – impossible de nettoyer";
      case 'blocked_humidity': return "Humidité trop élevée – mesure impossible";
      case 'need_human_validation': return "Vision IA incertaine – validation humaine demandée";
      default: return "Système en veille";
    }
  };

  // Human validation handler
  const handleValidation = async (isCorrect) => {
    if (!panelData || !recentPredictions[0]) return;

    try {
      console.log('Submitting human validation:', { isCorrect, prediction: recentPredictions[0] })

      // Here you would typically send this to your backend
      // For now, we'll just log it
      alert(`✅ Validation soumise: ${isCorrect ? 'Confirmé propre' : 'Corrigé en sale'}`)

      // In a real implementation, you would call your API:
      // const response = await fetch('/api/validation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     panel_id: selectedPanelId,
      //     prediction_id: recentPredictions[0].id,
      //     is_correct: isCorrect,
      //     corrected_class: isCorrect ? null : (recentPredictions[0].predicted_class === 'Clean' ? 'Dirty' : 'Clean')
      //   })
      // })

    } catch (error) {
      console.error('Error submitting validation:', error)
      alert(`❌ Erreur lors de la soumission: ${error.message}`)
    }
  };

  // Fetch available panels from API
  useEffect(() => {
    const fetchAvailablePanels = async () => {
      try {
        console.log('Fetching available panels from API')
        const panelsData = await getPanels()
        console.log("S. Fetching available panels from API!",panelsData)
        // Transform API response to match expected format
        const panels = panelsData.map(panel => ({
          id: panel.panel_id, // Use panel_id as id for compatibility
          panel_id: panel.panel_id,
          device_status: 'online', // Assume online since we got data from API
          last_update: panel.last_update
        }))

        console.log(`Found ${panels.length} panels:`, panels.map(p => p.panel_id))
        setAvailablePanels(panels)

        // Set default panel to the first available one
        if (panels.length > 0 && !selectedPanelId) {
          setSelectedPanelId(panels[0].panel_id)
        }
      } catch (error) {
        console.error('Error fetching available panels:', error)
        setError('Failed to load available panels')
      }
    }

    fetchAvailablePanels()
  }, [])

  // Fetch panel data from API
  const fetchPanelData = useCallback(async () => {
    if (!selectedPanelId) {
      console.log('No selectedPanelId, skipping panel data fetch')
      return
    }

    try {
      console.log('Fetching panel data for:', selectedPanelId)
      const panelDataResponse = await getPanelById(selectedPanelId)

      // Fetch predictions separately
      let predictions = []
      try {
        const predictionsResponse = await getPredictionHistory(selectedPanelId, 1) // Get latest prediction
        predictions = predictionsResponse.predictions || []
      } catch (predictionError) {
        console.warn('Could not fetch predictions:', predictionError)
      }

      const latestPrediction = predictions.length > 0 ? predictions[0] : null

      // Combine panel data with latest prediction
      const combinedData = {
        ...panelDataResponse,
        // Use prediction data if available, otherwise fall back to panel data
        final_state: latestPrediction?.status || panelDataResponse.ml_prediction || 'unknown',
        vision_result: latestPrediction?.predicted_class,
        ml_prediction: panelDataResponse.ml_prediction,
        confidence: latestPrediction?.confidence || panelDataResponse.ml_confidence,
        image_url: latestPrediction?.image_url,
        // Keep sensor data as-is
        humidity: panelDataResponse.humidity,
        light: panelDataResponse.light,
        temperature: panelDataResponse.temperature,
        water_level: panelDataResponse.water_level,
        battery_level: panelDataResponse.battery_level,
        device_status: panelDataResponse.device_status || 'online',
        last_update: panelDataResponse.last_update,
        status: (panelDataResponse.device_status || 'online') === 'online' ? 'healthy' : 'offline'
      }

      console.log('Combined panel data:', combinedData)
      setPanelData(combinedData)
      setLoading(false)
      setError(null)
    } catch (error) {
      console.error('Error fetching panel data:', error)
      setError('Failed to load panel data')
      setLoading(false)
    }
  }, [selectedPanelId])

  useEffect(() => {
    fetchPanelData()

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchPanelData, 30000)

    return () => clearInterval(interval)
  }, [fetchPanelData, selectedPanelId])

  // Demo data generator for testing
  const getDemoPanelData = (panelId) => {
    return {
      panel_id: panelId,
      final_state: 'clean',
      vision_result: 'Clean',
      ml_prediction: 'Clean',
      action: 'wait',
      confidence: 0.95,
      humidity: 45,
      light: 850,
      temperature: 22.5,
      water_level: 'OK',
      rgb_delta: 120,
      pre_decision: 'clean_candidate',
      timestamp: new Date().toISOString(),
      last_update: new Date().toISOString(),
      status: 'healthy'
      // Removed demo image_url - only show real uploaded images
    }
  }

  // Load recent predictions for the selected panel
  useEffect(() => {
    if (!selectedPanelId) return

    const loadRecentPredictions = async () => {
      try {
        console.log('Loading predictions for panel:', selectedPanelId)
        const response = await getPredictionHistory(selectedPanelId, 10)
        const predictions = response.predictions || []

        // Transform predictions to match expected format
        const formattedPredictions = predictions.map(prediction => ({
          id: prediction.id || prediction.timestamp, // Use timestamp as fallback ID
          ...prediction,
          // Ensure all expected fields are present
          predicted_class: prediction.predicted_class,
          confidence: prediction.confidence,
          confidence_level: prediction.confidence_level,
          status: prediction.status,
          processing_time_ms: prediction.processing_time_ms,
          all_classes_sorted: prediction.all_classes_sorted,
          image_url: prediction.image_url,
          timestamp: prediction.timestamp
        }))

        if (formattedPredictions.length === 0) {
          console.log('No predictions found for panel:', selectedPanelId)
          setRecentPredictions([])
        } else {
          console.log(`Loaded ${formattedPredictions.length} predictions for panel ${selectedPanelId}`)
          setRecentPredictions(formattedPredictions.slice(0, 5)) // Keep only 5 most recent
        }
      } catch (error) {
        console.error('Error loading predictions from API:', error)
        setRecentPredictions([])
      }
    }

    loadRecentPredictions()
  }, [selectedPanelId, panelData]) // Reload when panel data changes

  // Demo predictions generator for testing
  const getDemoPredictions = (panelId) => {
    const now = new Date()
    return [
      {
        id: 'demo-1',
        panel_id: panelId,
        predicted_class: 'Clean',
        confidence: 0.92,
        status: 'clean',
        confidence_level: 'high',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        processing_time_ms: 245,
        // Removed demo image_url - only show real uploaded images
        all_classes_sorted: [
          { class_name: 'Clean', probability: 0.92 },
          { class_name: 'Dusty', probability: 0.05 },
          { class_name: 'Bird-drop', probability: 0.02 }
        ]
      },
      {
        id: 'demo-2',
        panel_id: panelId,
        predicted_class: 'Dusty',
        confidence: 0.78,
        status: 'dirty',
        confidence_level: 'medium',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        processing_time_ms: 198,
        // Removed demo image_url - only show real uploaded images
        all_classes_sorted: [
          { class_name: 'Dusty', probability: 0.78 },
          { class_name: 'Clean', probability: 0.15 },
          { class_name: 'Physical-Damage', probability: 0.04 }
        ]
      },
      {
        id: 'demo-3',
        panel_id: panelId,
        predicted_class: 'Clean',
        confidence: 0.88,
        status: 'clean',
        confidence_level: 'high',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        processing_time_ms: 267,
        // Removed demo image_url - only show real uploaded images
        all_classes_sorted: [
          { class_name: 'Clean', probability: 0.88 },
          { class_name: 'Snow-Covered', probability: 0.08 },
          { class_name: 'Dusty', probability: 0.03 }
        ]
      }
    ]
  }

  const getPanelStatus = () => {
    console.log("getPanelStatus: ",panelData);
    // if (!panelData) return 'unknown'


    // Determine status based on various factors
    const finalState = panelData.final_state
    const action = panelData.action
    const visionResult = panelData.vision_result
    const mlPrediction = panelData.ml_prediction

    // Priority: final_state > action > vision/ML consensus
    if (finalState) {
      return finalState
    }

    if (action?.includes('blocked')) {
      return action
    }

    if (action === 'start_clean') {
      return visionResult || mlPrediction || 'dirty'
    }

    if (action === 'wait') {
      return 'wait'
    }

    // Fallback to vision/ML results
    return visionResult || mlPrediction || 'unknown'
  }

  if (loading || availablePanels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {availablePanels.length === 0 ? 'Loading available panels...' : 'Loading dashboard...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const currentStatus = getPanelStatus()

  const stateConfig = getStateConfig(currentStatus)
console.log("stat config: ",stateConfig);
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* Modern Navbar */}
      {/* <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Sun size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">SolarGuard AI</h1>
            <p className="text-xs text-slate-500">Real-time Monitoring Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
             <Wifi size={14} className="text-green-500"/> ESP32 Connected
          </div>
          <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs">
            AD
          </div>
        </div>
      </nav> */}
      <Navbar/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Panel Selector */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Panel Selection</h2>
              <p className="text-sm text-slate-600">{availablePanels.length} panels available</p>
            </div>
            <select
              value={selectedPanelId || ''}
              onChange={(e) => setSelectedPanelId(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={availablePanels.length === 0}
            >
              {availablePanels.length === 0 ? (
                <option disabled>Loading panels...</option>
              ) : (
                availablePanels.map((panel) => (
                  <option key={panel.id} value={panel.panel_id}>
                    {panel.panel_id} 
                     {/* ({panel.device_status === 'online' ? '🟢 Online' : '🔴 Offline'}) */}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Notifications/Alerts */}
        <div className="space-y-2">
          {panelData?.water_level === 'VIDE' && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 rounded-r-md animate-pulse">
               <AlertTriangle className="text-red-500 flex-shrink-0" />
               <div>
                 <p className="font-bold text-red-800">⚠️ Réservoir vide !</p>
                 <p className="text-sm text-red-700">Nettoyage impossible tant que le niveau d'eau n'est pas rétabli.</p>
               </div>
            </div>
          )}
          {panelData?.humidity > 80 && (
             <div className="bg-blue-50 border-l-4 border-blue-500 p-4 flex items-center gap-3 rounded-r-md">
                <Droplets className="text-blue-500 flex-shrink-0" />
                <p className="font-bold text-blue-800">☁️ Humidité trop élevée ({panelData.humidity}%). Mesures potentiellement imprécises.</p>
             </div>
          )}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN (Status & Sensors) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Main Status Card */}
            <div className={`relative overflow-hidden rounded-2xl border-2 shadow-sm p-8 transition-all duration-500 ${stateConfig.color}`}>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <div className="flex items-center gap-2 mb-2 opacity-80">
                     <Activity size={18}/>
                     <span className="text-sm font-bold uppercase tracking-wider">État Final du Panneau</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                     {stateConfig.label}
                   </h2>
                   <p className="text-lg font-medium opacity-90 max-w-md">
                     {getStatusMessage(currentStatus)}
                   </p>
                </div>
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  {stateConfig.icon}
                </div>
              </div>

              {/* Decorative background pattern */}
              <div className="absolute -right-10 -bottom-20 opacity-10 transform rotate-12">
                <Sun size={200} />
              </div>
            </div>

            {/* Sensor Data Cards */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <Server size={20} className="text-slate-400"/> Données Capteurs en Direct
                 </h3>
                 <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">ID: {selectedPanelId}</span>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Humidity */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600 mb-2 text-sm font-semibold">
                      <Droplets size={16}/> Humidité
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{panelData?.humidity || 0}<span className="text-lg text-slate-500 font-normal">%</span></div>
                  </div>

                  {/* Light */}
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-600 mb-2 text-sm font-semibold">
                      <Sun size={16}/> Luminosité
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{panelData?.light || 0}</div>
                  </div>

                  {/* Temperature */}
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 text-orange-600 mb-2 text-sm font-semibold">
                      <Thermometer size={16}/> Temp
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{panelData?.temperature || 0}<span className="text-lg text-slate-500 font-normal">°C</span></div>
                  </div>

                  {/* RGB Delta */}
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-600 mb-2 text-sm font-semibold">
                      <Zap size={16}/> ΔRGB
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{panelData?.rgb_delta || 0}</div>
                  </div>
               </div>

               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* RGB Details */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500 uppercase">Capteur Couleur (Raw)</span>
                     <div className="flex gap-2 text-xs font-mono">
                        <span className="text-red-600 font-bold">R:{panelData?.R || 0}</span>
                        <span className="text-green-600 font-bold">G:{panelData?.G || 0}</span>
                        <span className="text-blue-600 font-bold">B:{panelData?.B || 0}</span>
                     </div>
                  </div>

                   {/* Water Level */}
                   <div className={`rounded-lg p-3 border flex justify-between items-center ${panelData?.water_level === 'OK' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                     <span className="text-xs font-bold text-slate-500 uppercase">Niveau d'eau</span>
                     <span className={`text-sm font-bold ${panelData?.water_level === 'OK' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {panelData?.water_level || 'UNKNOWN'}
                     </span>
                  </div>
               </div>
            </div>

            {/* Action Command */}
            <div className="bg-slate-900 rounded-xl shadow-sm p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <h3 className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Dernière Commande Envoyée</h3>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-2xl font-mono text-green-400">Action : {panelData?.action || 'wait'}</p>
                  </div>
               </div>
               <div className="bg-white/10 px-4 py-2 rounded text-xs font-mono text-slate-300 border border-white/10">
                  backend_decision_engine
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Vision & History) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Image & Vision */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Camera size={18}/> Vision IA
                </h3>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                   Live Feed <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                </span>
              </div>

              <div className="relative aspect-video bg-slate-900 group">
                {recentPredictions[0]?.image_url ? (
                  <img
                    src={recentPredictions[0].image_url}
                    alt="Solar Panel Analysis"
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Camera size={48} />
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white pt-10">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-xs text-slate-300 mb-1">Résultat d'analyse</p>
                         <p className="font-bold text-lg capitalize flex items-center gap-2">
                           {recentPredictions[0]?.predicted_class || 'No Data'}
                           {recentPredictions[0]?.confidence && (
                             <span className={`px-2 py-0.5 text-[10px] rounded-full text-black font-bold ${(recentPredictions[0].confidence * 100) > 80 ? 'bg-green-400' : 'bg-yellow-400'}`}>
                               {(recentPredictions[0].confidence * 100).toFixed(1)}% Confiance
                             </span>
                           )}
                         </p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-400">Timestamp</p>
                         <p className="font-mono text-xs">{recentPredictions[0]?.timestamp ? new Date(recentPredictions[0].timestamp).toLocaleTimeString() : 'N/A'}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* HUMAN VALIDATION BUTTONS */}
              {panelData?.final_state === 'need_human_validation' && (
                <div className="p-4 bg-orange-50 border-t border-orange-100 animate-in fade-in slide-in-from-top-2">
                   <p className="text-sm text-orange-800 font-medium mb-3 text-center flex items-center justify-center gap-2">
                     <AlertTriangle size={16}/> L'IA est incertaine. Veuillez confirmer :
                   </p>
                   <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleValidation(true)}
                        className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 hover:border-green-400 transition font-semibold shadow-sm"
                      >
                        <CheckCircle size={16}/> C'est Propre
                      </button>
                      <button
                        onClick={() => handleValidation(false)}
                        className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 hover:border-red-400 transition font-semibold shadow-sm"
                      >
                        <XCircle size={16}/> C'est Sale
                      </button>
                   </div>
                </div>
              )}
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <Clock size={18}/> Historique des Décisions
                </h3>
              </div>
              <div className="overflow-auto flex-1">
                <table className="w-full text-sm text-left">
                   <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3">Heure</th>
                        <th className="px-4 py-3">État</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {recentPredictions && recentPredictions.length > 0 ? recentPredictions.map((prediction, idx) => (
                        <tr key={prediction.id || idx} className="hover:bg-slate-50">
                           <td className="px-4 py-3 font-mono text-slate-600 text-xs">{prediction.timestamp ? new Date(prediction.timestamp).toLocaleTimeString() : 'N/A'}</td>
                           <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                prediction.status === 'clean' ? 'bg-green-100 text-green-700' :
                                prediction.status === 'dirty' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {prediction.status || prediction.predicted_class || 'unknown'}
                              </span>
                           </td>
                           <td className="px-4 py-3 text-xs text-slate-600 font-mono">
                             {prediction.status === 'dirty' ? 'start_clean' : 'wait'}
                           </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-slate-400">Aucun historique disponible</td>
                        </tr>
                      )}
                   </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}