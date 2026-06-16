import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MetricCards from './components/MetricCards';
import ScenarioControls from './components/ScenarioControls';
import RunwayChart from './components/RunwayChart';
import AdvisorPanel from './components/AdvisorPanel';
import ScenariosTable from './components/ScenariosTable';

export default function App() {
  const [controls, setControls] = useState({
    inflation_rate: 8,
    inventory_increase: 15,
    wage_increase: 6,
    payment_terms: 60,
    sales_growth: 0
  });

  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSimulation = async (isInitial = false) => {
    try {
      const response = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...controls,
          scenario_name: isInitial ? "Base Case (Current)" : "High Inflation - Delayed Payments"
        })
      });
      const data = await response.json();
      setMetrics(data);
      
      // Sync past history layout
      const histResponse = await fetch('http://localhost:8000/api/scenarios');
      const histData = await histResponse.json();
      setHistory(histData);
    } catch (err) {
      console.error("Failed to sync backend infrastructure metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulation(true);
  }, []);

  if (loading || !metrics) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">
        Loading Performance Dashboard Infrastructure...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto">
          <MetricCards data={metrics} />
          
          <div className="flex flex-col lg:flex-row gap-5 items-stretch">
            <ScenarioControls controls={controls} setControls={setControls} onRun={() => fetchSimulation(false)} />
            <RunwayChart chartData={metrics.chart_data} baseDays={metrics.cash_runway_base} stressDays={metrics.cash_runway_stress} />
            <AdvisorPanel 
              warnings={metrics.warnings} 
              recommendations={metrics.recommendations} 
            />

          </div>

          <ScenariosTable history={history} />
        </main>
      </div>
    </div>
  );
}
