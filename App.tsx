
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { analyzeFoodImage } from './services/geminiService';
import { NutritionData, AppState, SavedEntry, ViewType } from './types';
import NutritionCard from './components/NutritionCard';
import ExerciseRecommendation from './components/ExerciseRecomendation';
import StatsView from './components/StatsView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('scanner');
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState<SavedEntry[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sound generator for "bib" effect
  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime); // Sharp high beep
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Sound blocked by browser or not supported.");
    }
  }, []);

  // Global click listener for the beep effect
  useEffect(() => {
    const handleGlobalClick = () => playBeep();
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, [playBeep]);

  useEffect(() => {
    const saved = localStorage.getItem('fitscan_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fitscan_history', JSON.stringify(history));
  }, [history]);

  const saveToHistory = (data: NutritionData) => {
    const newEntry: SavedEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      calories: data.calories,
      protein: data.protein,
      mealName: data.mealName
    };
    setHistory(prev => [...prev, newEntry]);
  };

  const processAnalysis = async (file: File) => {
    setStatus(AppState.LOADING);
    setErrorMessage(null);
    setNutrition(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      setImagePreview(base64String);

      try {
        const result = await analyzeFoodImage(base64Data, description);
        setNutrition(result);
        saveToHistory(result);
        setStatus(AppState.RESULT);
      } catch (error) {
        console.error(error);
        setErrorMessage("ERRO DE ESCANEAMENTO: Re-tente com dados manuais ou iluminação superior.");
        setStatus(AppState.ERROR);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processAnalysis(file);
  };

  const reset = () => {
    setStatus(AppState.IDLE);
    setNutrition(null);
    setImagePreview(null);
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 selection:bg-cyan-500 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <header className="sticky top-0 z-50 glass-card px-6 py-4 flex items-center justify-between border-b border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white text-2xl shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <span className="animate-pulse">📡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-futuristic text-cyan-400 tracking-tighter neon-text">FITSCAN_OS</h1>
            <p className="text-[10px] text-cyan-500/70 uppercase font-bold tracking-[0.2em]">Bio-Feedback System</p>
          </div>
        </div>
        
        {status !== AppState.IDLE && view === 'scanner' && (
          <button 
            onClick={reset} 
            className="text-[10px] font-bold text-cyan-400 border border-cyan-500/40 px-3 py-1.5 rounded-md uppercase tracking-widest hover:bg-cyan-500/10 transition-colors"
          >
            Reset
          </button>
        )}
      </header>

      <main className="relative p-4 max-w-lg mx-auto z-10">
        {view === 'stats' ? (
          <StatsView history={history} />
        ) : (
          <>
            {status === AppState.IDLE && (
              <div className="mt-8 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="w-32 h-32 mb-8 relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 glass-card rounded-full flex items-center justify-center border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                    <span className="text-6xl">👁️</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2 text-center font-futuristic text-white">INICIAR ESCANEAMENTO</h2>
                <p className="text-slate-400 mb-8 text-center text-sm px-4">
                  Aponte o sensor ótico para a biomassa alimentar.
                </p>

                <div className="w-full mb-8">
                  <div className="flex justify-between mb-2 px-1">
                    <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Entrada de Contexto</label>
                    <span className="text-[8px] text-slate-500 uppercase font-mono">Input_Manual</span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o conteúdo do prato..."
                    className="w-full p-4 glass-card rounded-xl text-cyan-100 placeholder:text-slate-600 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-sm resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 p-6 rounded-2xl font-bold shadow-lg shadow-cyan-900/20 hover:bg-cyan-600/40 transition-all group"
                  >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                    <span className="text-[11px] uppercase tracking-widest">Ativar Câmera</span>
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center glass-card border-slate-700 text-slate-400 p-6 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                  >
                    <span className="text-3xl mb-2">📂</span>
                    <span className="text-[11px] uppercase tracking-widest">Base de Dados</span>
                  </button>
                </div>
              </div>
            )}

            {status === AppState.LOADING && (
              <div className="mt-20 text-center flex flex-col items-center animate-in fade-in duration-300">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-cyan-400 font-mono text-[8px] uppercase">Processing</div>
                </div>
                <p className="font-bold text-cyan-400 font-futuristic animate-pulse">PROCESSANDO BIOMETRIA...</p>
                <div className="mt-4 flex gap-1 h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '40%'}}></div>
                </div>
              </div>
            )}

            {status === AppState.RESULT && nutrition && (
              <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/40">
                  <img src={imagePreview!} className="w-full h-48 object-cover grayscale-[20%] contrast-125" alt="Prato" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-[0.3em] font-futuristic">Scan_Complete.lnk</p>
                  </div>
                </div>
                
                <NutritionCard data={nutrition} />
                <ExerciseRecommendation calories={nutrition.calories} />
                
                <button 
                  onClick={reset}
                  className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold font-futuristic text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all uppercase tracking-widest border border-cyan-400/50"
                >
                  Novo Escaneamento
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Futuristic Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-cyan-500/20 h-20 flex justify-around items-center px-4 z-50 rounded-t-3xl">
        <button 
          onClick={() => setView('scanner')}
          className={`relative flex flex-col items-center group transition-all duration-300 ${view === 'scanner' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          {view === 'scanner' && <div className="absolute -top-1 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]"></div>}
          <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🧬</span>
          <span className="text-[9px] font-bold uppercase tracking-widest font-futuristic">Scanner</span>
        </button>
        
        <button 
          onClick={() => setView('stats')}
          className={`relative flex flex-col items-center group transition-all duration-300 ${view === 'stats' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          {view === 'stats' && <div className="absolute -top-1 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]"></div>}
          <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📑</span>
          <span className="text-[9px] font-bold uppercase tracking-widest font-futuristic">Log_Data</span>
        </button>
      </nav>

      <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleFileChange} />
      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default App;
