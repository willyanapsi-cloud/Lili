
import React from 'react';
import { NutritionData } from '../types';

interface NutritionCardProps {
  data: NutritionData;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ data }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border-l-4 border-cyan-500 relative overflow-hidden">
      {/* HUD Lines */}
      <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-cyan-500/30 opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/30 opacity-40"></div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold font-futuristic text-white uppercase tracking-tighter">{data.mealName}</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <p className="text-[10px] text-cyan-500 uppercase font-bold tracking-widest">Análise Biométrica_v4.2</p>
          </div>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-lg text-center shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
          <span className="block text-2xl font-black text-cyan-400 neon-text">{data.calories}</span>
          <span className="text-[8px] text-cyan-500 uppercase font-bold">KCAL_UNIT</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl relative">
          <div className="absolute top-1 left-1 w-1 h-1 bg-cyan-400"></div>
          <span className="block text-[8px] text-slate-500 uppercase font-bold mb-1">Carbs_g</span>
          <span className="text-xl font-bold text-white">{data.carbs}</span>
          <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-500" style={{width: `${Math.min(data.carbs, 100)}%`}}></div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl relative">
          <div className="absolute top-1 left-1 w-1 h-1 bg-purple-400"></div>
          <span className="block text-[8px] text-slate-500 uppercase font-bold mb-1">Prot_g</span>
          <span className="text-xl font-bold text-white">{data.protein}</span>
          <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
             <div className="h-full bg-purple-500" style={{width: `${Math.min(data.protein, 100)}%`}}></div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl relative">
          <div className="absolute top-1 left-1 w-1 h-1 bg-amber-400"></div>
          <span className="block text-[8px] text-slate-500 uppercase font-bold mb-1">Fat_g</span>
          <span className="text-xl font-bold text-white">{data.fats}</span>
          <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
             <div className="h-full bg-amber-500" style={{width: `${Math.min(data.fats, 100)}%`}}></div>
          </div>
        </div>
      </div>

      {data.observations && (
        <div className="mt-6 p-4 bg-cyan-500/5 rounded-xl border-t border-cyan-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-cyan-400 text-xs font-bold uppercase font-mono tracking-widest">IA_REPORT:</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            {data.observations}
          </p>
        </div>
      )}
    </div>
  );
};

export default NutritionCard;
