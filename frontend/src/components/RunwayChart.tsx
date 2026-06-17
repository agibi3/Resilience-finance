import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RunwayChart({ chartData, baseDays, stressDays }:any) {
  // Prevent calculations from outputting NaN strings
  const safeBase = baseDays ?? 0;
  const safeStress = stressDays ?? 0;
  const difference = safeBase - safeStress;

  return (
    <div className="bg-white w-full p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-slate-800 text-sm">Cash Runway Projection</h3>
            <span className="text-slate-400 text-xs cursor-pointer">ⓘ</span>
          </div>
          <select className="text-xs border border-slate-200 rounded p-1 bg-white font-medium text-slate-500">
            <option>View by: Monthly</option>
          </select>
        </div>
        <p className="text-xs text-slate-400 mb-4">See how long your cash will last under the selected scenario.</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
              <Line type="monotone" dataKey="baseCase" name="Base Case (Current)" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="stressScenario" name="Stress Scenario" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-slate-100 pt-4 mt-2 text-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Runway (Base Case)</span>
          <p className="text-sm font-extrabold text-blue-600 mt-0.5">{safeBase} Days</p>
          <span className="text-[10px] text-slate-400 font-medium">(Dec 18, 2025)</span>
        </div>
        <div className="border-x border-slate-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Runway (Stress Scenario)</span>
          <p className="text-sm font-extrabold text-red-500 mt-0.5">{safeStress} Days</p>
          <span className="text-[10px] text-slate-400 font-medium">(Aug 9, 2025)</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Difference</span>
          <p className="text-sm font-extrabold text-red-600 mt-0.5">-{difference} Days</p>
          <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase tracking-wide">High Risk</span>
        </div>
      </div>
    </div>
  );
}
