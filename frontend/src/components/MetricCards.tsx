import { DollarSign, Activity, Percent, Flame, Layers } from 'lucide-react';

interface MetricCardsProps {
  data?: Record<string, any>;
}

export default function MetricCards({ data }: MetricCardsProps) {
  // Gracefully fallback to nested kpis object if the top-level keys are missing
  const cashOnHand = data?.cash_on_hand ?? data?.kpis?.cash_on_hand ?? 0;
  const runwayStress = data?.cash_runway_stress ?? data?.kpis?.cash_runway_stress ?? 0;
  const grossMargin = data?.gross_margin ?? data?.kpis?.gross_margin ?? 0;
  const burnRate = data?.burn_rate ?? data?.kpis?.burn_rate ?? 0;
  const workingCapital = data?.working_capital ?? data?.kpis?.working_capital ?? 0;
  const riskLevel = data?.risk_level ?? 'Low';

  const cards = [
    { label: 'Cash on Hand', value: `$${Number(cashOnHand).toLocaleString()}`, change: 'Current Liquidity', color: 'text-blue-600', bg: 'bg-blue-50', icon: DollarSign },
    { label: 'Cash Runway', value: `${runwayStress} Days`, change: 'Based on burn rate', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Activity, customValueColor: riskLevel === 'High' ? 'text-red-500' : 'text-slate-800' },
    { label: 'Gross Margin', value: `${grossMargin}%`, change: 'Profitability', color: 'text-purple-600', bg: 'bg-purple-50', icon: Percent },
    { label: 'Monthly Burn Rate', value: `$${Number(burnRate).toLocaleString()}`, change: 'Capital depletion', color: 'text-orange-600', bg: 'bg-orange-50', icon: Flame },
    { label: 'Working Capital', value: `$${Number(workingCapital).toLocaleString()}`, change: 'Operational buffer', color: 'text-cyan-600', bg: 'bg-cyan-50', icon: Layers },
  ];

  // Map over cards to render UI (identical to your original return block)
  return (
    <div className="flex flex-row gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{card.label}</span>
              <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${card.customValueColor || 'text-slate-800'}`}>{card.value}</h3>
              <p className="text-[11px] font-medium text-slate-400 mt-1">{card.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
