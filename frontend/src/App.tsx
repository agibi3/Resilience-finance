import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MetricCards from './components/MetricCards';
import ScenarioControls from './components/ScenarioControls';
import RunwayChart from './components/RunwayChart';
import AdvisorPanel from './components/AdvisorPanel';
import ScenariosTable from './components/ScenariosTable';

const API_BASE_URL = 'https://resilience-finance-backend.onrender.com';

const DUMMY_METRICS = {
  cash_on_hand: 42500,
  cash_runway_base: 67,
  cash_runway_stress: 28,
  risk_level: 'High',
  gross_margin: 28.7,
  burn_rate: 18650, 
  working_capital: 22100,
  chart_data: [
    { month: 'May 25', baseCase: 85000, stressScenario: 85000 },
    { month: 'Jun 25', baseCase: 75000, stressScenario: 60000 },
    { month: 'Jul 25', baseCase: 65000, stressScenario: 40000 },
    { month: 'Aug 25', baseCase: 55000, stressScenario: 15000 },
    { month: 'Sep 25', baseCase: 48000, stressScenario: 0 },
    { month: 'Oct 25', baseCase: 40000, stressScenario: 0 }
  ], 
  warnings: ["Warning: Your cash runway drops below 30 days soon."],
  recommendations: [{ id: 1, title: "Renegotiate Terms", description: "Optimize supplier contracts." }]
};

const DUMMY_HISTORY = [
  { id: 1, scenario_name: "High Inflation - Delayed Payments", created_at: "2025-05-12T00:00:00.000Z", inflation_rate: 8, payment_terms: 60, sales_growth: 0, resulting_runway: 28, risk_level: "High" }
];

export default function App() {
  const [controls, setControls] = useState({
    inflation_rate: 8,
    inventory_increase: 15,
    wage_increase: 6,
    payment_terms: 60,
    sales_growth: 0
  });

  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Layout Controls
  const [activeTab, setActiveTab] = useState('Resilience');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchSimulation = async (isInitial = false) => {
    setIsSyncing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...controls, scenario_name: isInitial ? "Base Case (Current)" : "High Inflation" })
      });
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data === 'object' && Object.keys(data).length > 0) setMetrics(data);
      }
      const histResponse = await fetch(`${API_BASE_URL}/api/scenarios`);
      if (histResponse.ok) {
        const histData = await histResponse.json();
        if (Array.isArray(histData) && histData.length > 0) setHistory(histData);
      }
    } catch (err) {
      console.warn("Backend sleeping or unreachable. Using dummy layout.", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchSimulation(true);
  }, []);

  const currentMetrics = metrics || DUMMY_METRICS;
  const currentHistory = history || DUMMY_HISTORY;

  // Render content conditionally depending on selection engine
  const renderTabContent = () => {
    switch(activeTab) {
      case 'Resilience':
        return (
          <>
            <MetricCards data={currentMetrics} />
            <div className="flex flex-col lg:flex-row gap-5 items-stretch mt-5">
              <ScenarioControls controls={controls} setControls={setControls} onRun={() => fetchSimulation(false)} />
              <RunwayChart chartData={currentMetrics.chart_data || []} baseDays={currentMetrics.cash_runway_base} stressDays={currentMetrics.cash_runway_stress} />
              <AdvisorPanel warnings={currentMetrics.warnings || []} recommendations={currentMetrics.recommendations || []} />
            </div>
            <ScenariosTable history={currentHistory} />
          </>
        );
      case 'Trends':
        return <div className="p-8 bg-white border rounded-xl font-bold text-slate-400 text-center">Historical Data Trends View (Coming Soon)</div>;
      case 'Cap Days':
        return <div className="p-8 bg-white border rounded-xl font-bold text-slate-400 text-center">Capitalization Milestones Calendar (Coming Soon)</div>;
      case 'Cash Summary':
        return <div className="p-8 bg-white border rounded-xl font-bold text-slate-400 text-center">Comprehensive Cash Inflow/Outflow Breakdown Statement (Coming Soon)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased overflow-x-hidden">
      {/* Background overlay for sliding menu drawer */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}

      {/* Sidebar navigation unit */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Top bar with responsive trigger action connection */}
        <TopBar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative">
          {isSyncing && (
            <div className="absolute top-2 right-6 text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded border border-blue-200 animate-pulse">
              Syncing live infrastructure...
            </div>
          )}

          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
