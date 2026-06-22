import { useState } from "react";
import axios from "axios";

// Layout & Navigation Components
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

// Resilience Tab Core Dashboard Sub-components
import MetricCards from "./components/MetricCards";
import ScenarioControls from "./components/ScenarioControls";
import RunwayChart from "./components/RunwayChart";
import AdvisorPanel from "./components/AdvisorPanel";
import ScenariosTable from "./components/ScenariosTable";

// Additional Page Views
import Trends from "./pages/Trends";
import CashSummary from "./pages/CashSummary";
import CapDays from "./pages/CapDays";

// ==========================================
// TypeScript Interfaces
// ==========================================

interface ScenarioControlsState {
  inflation_rate: number;
  inventory_increase: number;
  wage_increase: number;
  payment_terms: number;
  sales_growth: number;
}

interface AnalysisData {
  trend_data: Array<Record<string, any>>;
  trend_metrics: string[];
  cash_runway_base?: number;
  cash_runway_stress?: number;
  warnings?: string[];
  recommendations?: string[];
  [key: string]: any; // Fallback for unstructured payload metadata
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  // --- Component State ---
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Resilience");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const [controls, setControls] = useState<ScenarioControlsState>({
    inflation_rate: 8,
    inventory_increase: 15,
    wage_increase: 6,
    payment_terms: 60,
    sales_growth: 0,
  });

  // ==========================================
  // Core API Service Handlers
  // ==========================================
  
  async function handleAnalyze(file: File, period: string) {
    try {
      setIsSyncing(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("period", period);

      const res = await axios.post<AnalysisData>(
        `${API_BASE_URL}/api/analyze`,
        formData
      );
      setAnalysis(res.data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis engine run failed. Please verify file integrity.");
    } finally {
      setIsSyncing(false);
    }
  }

  // ==========================================
  // Dynamic Tab Router
  // =========================================
  console.log(analysis)
  function renderTabContent() {
    switch (activeTab) {
      case "Resilience":
        return (
          <>
            <MetricCards data={analysis} />
            
            <div className="flex flex-row gap-5 mt-5">
              <ScenarioControls 
                controls={controls} 
                setControls={setControls} 
                onRun={() => { /* Handler for /api/simulate endpoint integration */ }} 
              />
              <RunwayChart 
                chartData={analysis?.trend_data || []} 
                baseDays={analysis?.cash_runway_base || 0} 
                stressDays={analysis?.cash_runway_stress || 0} 
              />
              <AdvisorPanel 
                warnings={analysis?.warnings || []} 
                recommendations={analysis?.recommendations || []} 
              />
            </div>
            
            <ScenariosTable history={[]} />
          </>
        );
      case "Trends":
        return (
          <Trends 
            data={analysis?.trend_data || []} 
            metrics={analysis?.trend_metrics || []} 
          />
        );
      case "Cash Summary":
        return <CashSummary summary={analysis} />;
      case "Cap Days":
        return <CapDays metrics={analysis} />;
      default:
        return null;
    }
  }

  // ==========================================
  // Main Render Template
  // ==========================================
  
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Mobile Sidebar Navigation Overlay Background Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Navigation Layout Controls */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          onAnalyze={handleAnalyze} 
        />

        {/* Dynamic Inner Layout Body wrapper */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative">
          {isSyncing && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-md bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold animate-pulse z-50 shadow-xs">
              Analyzing dataset...
            </div>
          )}

          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
