import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Sun, 
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
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  updateDoc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';

// --- Firebase Initialization ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Constants & Types ---
const PANEL_ID = "panel_001";
// NOTE: We map the document path to the environment's allowed path structure
// In a real production app, this might just be collection(db, 'panels')
const PANEL_PATH = `artifacts/${appId}/public/data/panels/${PANEL_ID}`;

// Mock initial data structure ensuring the dashboard looks good even before first DB write
const INITIAL_DATA = {
  final_state: 'wait',
  action: 'wait',
  humidity: 45,
  light: 300,
  temperature: 24,
  water_level: 'OK',
  rgb: { r: 100, g: 100, b: 100 },
  delta_rgb: 0,
  vision_result: 'clean',
  vision_confidence: 0,
  image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
  timestamp: null,
  history: []
};

export default function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Auth Setup
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth failed", err);
        setError("Authentication failed. Please refresh.");
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Listener
  useEffect(() => {
    if (!user) return;

    // The logic requested in Section 2: onSnapshot for real-time updates
    const docRef = doc(db, `artifacts/${appId}/public/data/panels`, PANEL_ID);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data());
      } else {
        // If doc doesn't exist, create it with initial data so the dashboard isn't empty
        setDoc(docRef, {
            ...INITIAL_DATA,
            timestamp: serverTimestamp()
        });
        setData(INITIAL_DATA);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error:", err);
      setError("Failed to load live data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- Helper Functions ---

  // Logic from Section A: Visual Colors
  const getStateConfig = (state) => {
    switch (state) {
      case 'clean': 
        return { color: 'bg-emerald-100 border-emerald-500 text-emerald-800', icon: <CheckCircle className="w-12 h-12 text-emerald-600"/>, label: 'Clean' };
      case 'dirty': 
        return { color: 'bg-red-100 border-red-500 text-red-800', icon: <AlertTriangle className="w-12 h-12 text-red-600"/>, label: 'Dirty' };
      case 'need_human_validation': 
        return { color: 'bg-orange-100 border-orange-500 text-orange-800', icon: <Camera className="w-12 h-12 text-orange-600"/>, label: 'Validation Required' };
      case 'wait': 
      case 'blocked_humidity': 
      case 'blocked_light': 
      case 'blocked_temperature': 
      case 'blocked_water':
        return { color: 'bg-slate-100 border-slate-400 text-slate-700', icon: <Clock className="w-12 h-12 text-slate-500"/>, label: 'Wait / Blocked' };
      default: 
        return { color: 'bg-gray-50 border-gray-300 text-gray-600', icon: <Activity className="w-12 h-12 text-gray-400"/>, label: 'Unknown' };
    }
  };

  // Logic from Section A: Status Messages
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

  // Logic from Section B: Human Validation
  const handleValidation = async (decision) => {
    if (!user || !data) return;
    
    const newAction = decision === 'dirty' ? 'start_clean' : 'wait';
    const docRef = doc(db, `artifacts/${appId}/public/data/panels`, PANEL_ID);

    try {
      await updateDoc(docRef, {
        final_state: decision,
        action: newAction,
        // Add to history
        history: [
          {
            date: new Date().toLocaleTimeString(),
            final_state: decision,
            ml_decision: data.vision_result, // assuming ML matched vision for this simple history entry
            vision_decision: data.vision_result,
            sensors_status: 'Human Override',
            action: newAction
          },
          ...(data.history || []).slice(0, 9) // Keep last 10
        ]
      });
    } catch (e) {
      console.error("Error updating validation:", e);
    }
  };

  // Simulation Tool: To allow the user to see the dashboard change without a physical ESP32
  const simulateNewData = async (type) => {
    if (!user) return;
    const docRef = doc(db, `artifacts/${appId}/public/data/panels`, PANEL_ID);
    
    let updatePayload = {};
    
    if (type === 'dirty') {
        updatePayload = {
            final_state: 'dirty',
            action: 'start_clean',
            humidity: 45,
            light: 600,
            water_level: 'OK',
            vision_result: 'dirty',
            vision_confidence: 92,
            image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80' // Dusty panel image
        };
    } else if (type === 'clean') {
        updatePayload = {
            final_state: 'clean',
            action: 'wait',
            humidity: 40,
            light: 850,
            water_level: 'OK',
            vision_result: 'clean',
            vision_confidence: 98,
            image_url: 'https://plus.unsplash.com/premium_photo-1664302152996-30a264263eb0?auto=format&fit=crop&w=800&q=80' // Clean panel
        };
    } else if (type === 'validation') {
        updatePayload = {
            final_state: 'need_human_validation',
            action: 'wait',
            humidity: 55,
            light: 400,
            water_level: 'OK',
            vision_result: 'dirty',
            vision_confidence: 65, // Low confidence triggers validation
            image_url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=800&q=80' // Ambiguous image
        };
    } else if (type === 'error') {
        updatePayload = {
            final_state: 'blocked_water',
            action: 'blocked',
            humidity: 30,
            light: 800,
            water_level: 'VIDE',
            vision_result: 'clean',
            vision_confidence: 0,
            image_url: data?.image_url
        };
    }

    // Update history with the new simulation
    const newHistoryItem = {
        date: new Date().toLocaleTimeString(),
        final_state: updatePayload.final_state,
        ml_decision: updatePayload.vision_result,
        vision_decision: updatePayload.vision_result,
        sensors_status: updatePayload.water_level === 'OK' ? 'OK' : 'ALERT',
        action: updatePayload.action
    };

    await updateDoc(docRef, {
        ...updatePayload,
        timestamp: serverTimestamp(),
        history: [newHistoryItem, ...(data?.history || []).slice(0, 9)]
    });
  };


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
      <RefreshCw className="animate-spin mr-2"/> Connecting to Dashboard...
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-500">
      <AlertTriangle className="mr-2"/> {error}
    </div>
  );

  // Safe defaults if data fields are missing
  const {
    final_state = 'wait',
    humidity = 0,
    light = 0,
    temperature = 0,
    water_level = 'OK',
    rgb = {r:0, g:0, b:0},
    delta_rgb = 0,
    action = 'wait',
    image_url = '',
    vision_result = '',
    vision_confidence = 0,
    history = []
  } = data || {};

  const stateConfig = getStateConfig(final_state);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
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
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* 🟤 Section F: Notifications */}
        <div className="space-y-2">
          {water_level === 'VIDE' && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 rounded-r-md animate-pulse">
               <AlertTriangle className="text-red-500 flex-shrink-0" />
               <div>
                 <p className="font-bold text-red-800">⚠️ Réservoir vide !</p>
                 <p className="text-sm text-red-700">Nettoyage impossible tant que le niveau d'eau n'est pas rétabli.</p>
               </div>
            </div>
          )}
          {humidity > 80 && (
             <div className="bg-blue-50 border-l-4 border-blue-500 p-4 flex items-center gap-3 rounded-r-md">
                <Droplets className="text-blue-500 flex-shrink-0" />
                <p className="font-bold text-blue-800">☁️ Humidité trop élevée ({humidity}%). Mesures potentiellement imprécises.</p>
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (Status & Sensors) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 🟢 Section A: Main Status Card */}
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
                     {getStatusMessage(final_state)}
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

            {/* 🔵 Section C: Sensor Data */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <Server size={20} className="text-slate-400"/> Données Capteurs en Direct
                 </h3>
                 <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">ID: {PANEL_ID}</span>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Humidity */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600 mb-2 text-sm font-semibold">
                      <Droplets size={16}/> Humidité
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{humidity}<span className="text-lg text-slate-500 font-normal">%</span></div>
                  </div>

                  {/* Light */}
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-600 mb-2 text-sm font-semibold">
                      <Sun size={16}/> Luminosité
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{light}</div>
                  </div>

                  {/* Temperature */}
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 text-orange-600 mb-2 text-sm font-semibold">
                      <Thermometer size={16}/> Temp
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{temperature}<span className="text-lg text-slate-500 font-normal">°C</span></div>
                  </div>

                  {/* RGB Delta */}
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-600 mb-2 text-sm font-semibold">
                      <Zap size={16}/> ΔRGB
                    </div>
                    <div className="text-3xl font-bold text-slate-800">{delta_rgb}</div>
                  </div>
               </div>

               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* RGB Details */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500 uppercase">Capteur Couleur (Raw)</span>
                     <div className="flex gap-2 text-xs font-mono">
                        <span className="text-red-600 font-bold">R:{rgb.r}</span>
                        <span className="text-green-600 font-bold">G:{rgb.g}</span>
                        <span className="text-blue-600 font-bold">B:{rgb.b}</span>
                     </div>
                  </div>

                   {/* Water Level */}
                   <div className={`rounded-lg p-3 border flex justify-between items-center ${water_level === 'OK' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                     <span className="text-xs font-bold text-slate-500 uppercase">Niveau d'eau</span>
                     <span className={`text-sm font-bold ${water_level === 'OK' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {water_level}
                     </span>
                  </div>
               </div>
            </div>

            {/* 🟠 Section D: Action Command */}
            <div className="bg-slate-900 rounded-xl shadow-sm p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <h3 className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Dernière Commande Envoyée</h3>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-2xl font-mono text-green-400">Action : {action}</p>
                  </div>
               </div>
               <div className="bg-white/10 px-4 py-2 rounded text-xs font-mono text-slate-300 border border-white/10">
                  backend_decision_engine
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Vision & History) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 🟣 Section B: Image & Vision */}
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
                <img 
                  src={image_url || "/placeholder.svg"} 
                  alt="Solar Panel Analysis" 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white pt-10">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-xs text-slate-300 mb-1">Résultat d'analyse</p>
                         <p className="font-bold text-lg capitalize flex items-center gap-2">
                           {vision_result}
                           <span className={`px-2 py-0.5 text-[10px] rounded-full text-black font-bold ${vision_confidence > 80 ? 'bg-green-400' : 'bg-yellow-400'}`}>
                             {vision_confidence}% Confiance
                           </span>
                         </p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-400">Timestamp</p>
                         <p className="font-mono text-xs">{new Date().toLocaleTimeString()}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* HUMAN VALIDATION BUTTONS */}
              {/* Only shown if state is need_human_validation as per Section B */}
              {final_state === 'need_human_validation' && (
                <div className="p-4 bg-orange-50 border-t border-orange-100 animate-in fade-in slide-in-from-top-2">
                   <p className="text-sm text-orange-800 font-medium mb-3 text-center flex items-center justify-center gap-2">
                     <AlertTriangle size={16}/> L'IA est incertaine. Veuillez confirmer :
                   </p>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleValidation('clean')}
                        className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 hover:border-green-400 transition font-semibold shadow-sm"
                      >
                        <CheckCircle size={16}/> C'est Propre
                      </button>
                      <button 
                        onClick={() => handleValidation('dirty')}
                        className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 hover:border-red-400 transition font-semibold shadow-sm"
                      >
                        <XCircle size={16}/> C'est Sale
                      </button>
                   </div>
                </div>
              )}
            </div>

            {/* 🟡 Section E: History Table */}
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
                      {history && history.length > 0 ? history.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                           <td className="px-4 py-3 font-mono text-slate-600 text-xs">{row.date}</td>
                           <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                row.final_state === 'clean' ? 'bg-green-100 text-green-700' :
                                row.final_state === 'dirty' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {row.final_state}
                              </span>
                           </td>
                           <td className="px-4 py-3 text-xs text-slate-600 font-mono">{row.action}</td>
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

        {/* Simulation Controls - Added for Demo Purposes */}
        <div className="mt-12 border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400 uppercase font-bold mb-4 text-center">
            🛠️ Simulation Dashboard (For Demo Only - Simulates ESP32 Data)
          </p>
          <div className="flex flex-wrap justify-center gap-4">
             <button 
               onClick={() => simulateNewData('clean')}
               className="px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition shadow-sm"
             >
               Simulate: CLEAN State
             </button>
             <button 
               onClick={() => simulateNewData('dirty')}
               className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition shadow-sm"
             >
               Simulate: DIRTY State
             </button>
             <button 
               onClick={() => simulateNewData('validation')}
               className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition shadow-sm"
             >
               Simulate: LOW CONFIDENCE (Validation)
             </button>
              <button 
               onClick={() => simulateNewData('error')}
               className="px-4 py-2 bg-slate-600 text-white rounded text-sm hover:bg-slate-700 transition shadow-sm"
             >
               Simulate: ERROR (Empty Tank)
             </button>
          </div>
        </div>

      </main>
    </div>
  );
}