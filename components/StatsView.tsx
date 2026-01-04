
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SavedEntry } from '../types';

interface StatsViewProps {
  history: SavedEntry[];
}

const StatsView: React.FC<StatsViewProps> = ({ history }) => {
  const chartData = useMemo(() => {
    const last30Days: Record<string, { date: string, calories: number, protein: number }> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      last30Days[dateStr] = { date: dateStr, calories: 0, protein: 0 };
    }
    history.forEach(entry => {
      const d = new Date(entry.date);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (last30Days[dateStr]) {
        last30Days[dateStr].calories += entry.calories;
        last30Days[dateStr].protein += entry.protein;
      }
    });
    return Object.values(last30Days);
  }, [history]);

  const totals = useMemo(() => {
    return history.reduce((acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein
    }), { calories: 0, protein: 0 });
  }, [history]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-3xl border-l-4 border-cyan-500 relative">
           <div className="absolute top-2 right-3 text-cyan-500/20 font-black text-xl italic">KCAL</div>
          <span className="text-[9px] text-cyan-500 uppercase font-bold tracking-[0.2em]">Total_Calorias</span>
          <div className="text-3xl font-black text-white neon-text">{totals.calories.toLocaleString()}</div>
        </div>
        <div className="glass-card p-5 rounded-3xl border-l-4 border-purple-500 relative">
          <div className="absolute top-2 right-3 text-purple-500/20 font-black text-xl italic">PROT</div>
          <span className="text-[9px] text-purple-500 uppercase font-bold tracking-[0.2em]">Total_Proteína</span>
          <div className="text-3xl font-black text-white" style={{textShadow: '0 0 8px rgba(168, 85, 247, 0.6)'}}>{totals.protein.toLocaleString()}g</div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-700/40">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold font-futuristic text-white text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="text-cyan-400">📊</span> Histórico Mensal
          </h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="date" fontSize={8} tickMargin={8} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis fontSize={8} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #0ea5e9', fontSize: '10px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{fontSize: '9px', textTransform: 'uppercase', color: '#64748b'}} />
              <Bar name="KCAL" dataKey="calories" fill="#06b6d4" radius={[2, 2, 0, 0]} />
              <Bar name="PROT" dataKey="protein" fill="#a855f7" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-slate-700/40 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold font-futuristic text-cyan-400 text-[10px] uppercase tracking-[0.3em]">Log_Refeições_Recentes</h3>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-10 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">Nenhum registro no banco de dados.</div>
          ) : (
            history.slice().reverse().map(entry => (
              <div key={entry.id} className="p-4 border-b border-slate-800/50 flex justify-between items-center last:border-0 hover:bg-cyan-500/5 transition-colors">
                <div className="flex gap-3 items-center">
                  <div className="w-1 h-8 bg-cyan-500/30 rounded-full"></div>
                  <div>
                    <div className="font-bold text-white text-xs uppercase tracking-wider">{entry.mealName}</div>
                    <div className="text-[8px] text-slate-500 font-mono">
                      {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-black text-sm">{entry.calories} kcal</div>
                  <div className="text-purple-400 font-bold text-[9px] uppercase tracking-tighter">{entry.protein}g PROT</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsView;
