
import React from 'react';

interface ExerciseRecommendationProps {
  calories: number;
}

const ExerciseRecommendation: React.FC<ExerciseRecommendationProps> = ({ calories }) => {
  const walkingMin = Math.round((calories / 280) * 60);
  const runningMin = Math.round((calories / 700) * 60);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-bold font-futuristic text-white mb-6 flex items-center gap-3">
        <span className="text-2xl">⚡</span> PROTOCOLO DE QUEIMA
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 text-center group hover:bg-cyan-500/10 transition-colors">
          <div className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all">🚶</div>
          <span className="block text-[8px] text-cyan-500 font-bold uppercase tracking-[0.2em] mb-1">Steady State</span>
          <span className="text-2xl font-black text-white">{walkingMin} <span className="text-[10px] text-slate-500 font-normal">MIN</span></span>
          <p className="text-[8px] text-slate-600 mt-2">VELOCIDADE_CRUZEIRO: 5KM/H</p>
        </div>

        <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5 text-center group hover:bg-purple-500/10 transition-colors">
          <div className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all">🏃</div>
          <span className="block text-[8px] text-purple-500 font-bold uppercase tracking-[0.2em] mb-1">High Intensity</span>
          <span className="text-2xl font-black text-white">{runningMin} <span className="text-[10px] text-slate-500 font-normal">MIN</span></span>
          <p className="text-[8px] text-slate-600 mt-2">VELOCIDADE_MAX: 10KM/H</p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <span className="text-xl mt-1">📡</span>
        <p className="text-[9px] text-slate-500 leading-tight uppercase font-medium tracking-wide">
          Dados estimados baseados em perfil biométrico padrão. A eficácia metabólica varia conforme o hardware humano individual.
        </p>
      </div>
    </div>
  );
};

export default ExerciseRecommendation;
