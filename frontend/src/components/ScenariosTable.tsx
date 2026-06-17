import { Eye, Trash2 } from 'lucide-react';

export default function ScenariosTable({ history }:any) {
  // Ensure array safety
  const safeHistory = Array.isArray(history) ? history : [];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm">Recent Scenarios</h3>
        <p className="text-xs text-slate-400 mt-0.5">Your last saved scenario simulations</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-3">Scenario Name</th>
              <th className="px-6 py-3">Created On</th>
              <th className="px-6 py-3">Key Changes</th>
              <th className="px-6 py-3">Cash Runway</th>
              <th className="px-6 py-3">Risk Level</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {safeHistory.map((row, idx) => {
              const rowId = row.id || idx;
              const runway = row.resulting_runway ?? 0;
              const inf = row.inflation_rate ?? 0;
              const terms = row.payment_terms ?? 30;
              const sales = row.sales_growth ?? 0;

              return (
                <tr key={rowId} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-3.5 font-bold text-slate-800">{row.scenario_name || 'Unnamed Scenario'}</td>
                  <td className="px-6 py-3.5 text-slate-400">{formatDate(row.created_at)}</td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {`Inflation ${inf}%, Terms ${terms}d, Sales ${sales}%`}
                  </td>
                  <td className={`px-6 py-3.5 font-bold ${runway < 30 ? 'text-red-500' : 'text-slate-700'}`}>
                    {runway} Days
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      row.risk_level === 'High' ? 'bg-red-50 text-red-600' : 
                      row.risk_level === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {row.risk_level || 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right space-x-2">
                    <button className="text-slate-400 hover:text-slate-600 inline-block"><Eye className="w-4 h-4" /></button>
                    <button className="text-slate-400 hover:text-red-500 inline-block"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
