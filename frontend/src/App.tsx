import { useState, useEffect } from "react";
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

interface ChartPoint {
  month: string;
  baseCase: number;
  stressScenario: number;
}

interface AdvisorInsight {
  title: string;
  description: string;
  severity: string;
}

interface AnalysisData {
  filename?: string;
  dataset_type?: string;
  business_domain?: string;
  executive_summary?: string;
  trend_metrics?: string[];
  trend_data?: ChartPoint[];
  chart_data?: ChartPoint[];
  risks?: string[];
  opportunities?: string[];
  insights?: AdvisorInsight[];
  cash_on_hand?: number;
  cash_runway_base?: number;
  cash_runway_stress?: number;
  gross_margin?: number;
  burn_rate?: number;
  working_capital?: number;
  risk_level?: string;
  kpis?: {
    cash_on_hand: number;
    cash_runway_base: number;
    cash_runway_stress: number;
    gross_margin: number;
    burn_rate: number;
    working_capital: number;
    risk_level: string;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function App() {
  // --- Core Application State ---
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [scenarioHistory, setScenarioHistory] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Resilience");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // --- Macroeconomic Controller Baseline State ---
  const [controls, setControls] = useState<ScenarioControlsState>({
    inflation_rate: 0,
    inventory_increase: 0,
    wage_increase: 0,
    payment_terms: 30,
    sales_growth: 0,
  });

  // --- Lifecycle Hook: Initial Load Fetching Database History ---
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsSyncing(true);
        
        const latestRes = await axios.get(`${API_BASE_URL}/api/analysis/latest`);
        
        if (latestRes.data && !latestRes.data.message) {
          const rawAnalysis = latestRes.data.analysis_json || latestRes.data;
          
          const baselineRes = await axios.post(`${API_BASE_URL}/api/simulate`, {
            scenario_name: "Baseline Initialization",
            inflation_rate: 0,
            inventory_increase: 0,
            wage_increase: 0,
            payment_terms: 30,
            sales_growth: 0,
          });

          setAnalysis({
            ...rawAnalysis,
            ...baselineRes.data,
            kpis: { ...baselineRes.data },
            trend_data: baselineRes.data.chart_data || rawAnalysis.trend_data || []
          });
        }

        const historyRes = await axios.get(`${API_BASE_URL}/api/scenarios`);
        setScenarioHistory(historyRes.data);
      } catch (error) {
        console.error("Error loading initializing environment data:", error);
      } finally {
        setIsSyncing(false);
      }
    }
    loadInitialData();
  }, []);

  // ==========================================
  // Core Business Execution Handlers
  // ==========================================

  async function handleAnalyze(file: File, period: string) {
    try {
      setIsSyncing(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("period", period);

      // FIX: Removed manual 'Content-Type' header assignment so Axios and the browser 
      // can automatically inject the multipart boundary hash.
      const response = await axios.post<any>(
        `${API_BASE_URL}/api/analyze`,
        formData
      );

      const dynamicPayload = response.data.analysis_json || response.data;

      const baselineRes = await axios.post(`${API_BASE_URL}/api/simulate`, {
        scenario_name: "Baseline Run",
        inflation_rate: 0,
        inventory_increase: 0,
        wage_increase: 0,
        payment_terms: 30,
        sales_growth: 0,
      });

      const simResults = baselineRes.data;

      setAnalysis({
        ...dynamicPayload,
        ...simResults,
        kpis: {
          cash_on_hand: simResults.cash_on_hand,
          cash_runway_base: simResults.cash_runway_base,
          cash_runway_stress: simResults.cash_runway_stress,
          gross_margin: simResults.gross_margin,
          burn_rate: simResults.burn_rate,
          working_capital: simResults.working_capital,
          risk_level: simResults.risk_level,
        },
        trend_data: simResults.chart_data || dynamicPayload.trend_data || []
      });

      setControls({
        inflation_rate: 0,
        inventory_increase: 0,
        wage_increase: 0,
        payment_terms: 30,
        sales_growth: 0,
      });

      const historyRes = await axios.get(`${API_BASE_URL}/api/scenarios`);
      setScenarioHistory(historyRes.data);

    } catch (error: any) {
      console.error("File processing analytics pipe failed:", error);
      
      // FIX: Upgraded diagnostic reporting to expose actual error strings passing through the network
      const backendError = error.response?.data?.detail 
        || error.response?.data?.message 
        || error.message 
        || "Server communication error";
        
      alert(`Upload Analysis Failed: ${backendError}`);
    } finally {
      setIsSyncing(false);
    }
  }

  async function executeSimulation() {
    if (!analysis) {
      alert("No financial context loaded. Please analyze a data profile template before simulation execution.");
      return;
    }

    try {
      setIsSyncing(true);
      
      const payload = {
        ...controls,
        scenario_name: `Dashboard Run (Inflation ${controls.inflation_rate}%)`,
      };

      const response = await axios.post(`${API_BASE_URL}/api/simulate`, payload);
      const results = response.data;

      setAnalysis((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...results,
          kpis: {
            cash_on_hand: results.cash_on_hand,
            cash_runway_base: results.cash_runway_base,
            cash_runway_stress: results.cash_runway_stress,
            gross_margin: results.gross_margin,
            burn_rate: results.burn_rate,
            working_capital: results.working_capital,
            risk_level: results.risk_level,
          },
          trend_data: results.chart_data,
        };
      });

      const historyRes = await axios.get(`${API_BASE_URL}/api/scenarios`);
      setScenarioHistory(historyRes.data);
    } catch (error: any) {
      console.error("Macro stress simulation failure execution details:", error);
      const backendError = error.response?.data?.detail || "Simulation calculation processing failure.";
      alert(`Simulation Failed: ${backendError}`);
    } finally {
      setIsSyncing(false);
    }
  }

  function renderTabContent() {
    switch (activeTab) {
      case "Resilience":
        return (
          <div className="space-y-6">
            <MetricCards data={analysis} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-1 flex">
                <ScenarioControls
                  controls={controls}
                  setControls={setControls}
                  onRun={executeSimulation}
                />
              </div>
              <div className="lg:col-span-2 flex">
                <RunwayChart
                  chartData={analysis?.trend_data || analysis?.chart_data || []}
                  baseDays={analysis?.cash_runway_base ?? 0}
                  stressDays={analysis?.cash_runway_stress ?? 0}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ScenariosTable history={scenarioHistory} />
              </div>
              <div className="lg:col-span-1">
                <AdvisorPanel
                  warnings={analysis?.risks || []}
                  recommendations={analysis?.insights || []}
                  activeContext={analysis}
                />
              </div>
            </div>
          </div>
        );

      case "Trends":
        return <Trends data={analysis?.trend_data || []} metrics={analysis?.trend_metrics || []} />;
      case "Cash Summary":
        return <CashSummary summary={analysis} />;
      case "Cap Days":
        return <CapDays metrics={analysis} />;
      default:
        return (
          <div className="text-center py-12 text-slate-400 text-sm font-medium">
            View layer initialization context exception. Tab target missing.
          </div>
        );
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-all duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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

        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative">
          {isSyncing && (
            <div className="fixed top-6 right-6 px-3 py-2 rounded-lg bg-blue-600 border border-blue-500 text-white text-xs font-bold animate-pulse z-50 shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Syncing Core Pipelines...
            </div>
          )}

          {!analysis && activeTab === "Resilience" ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center bg-white shadow-xs mt-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">
                📊
              </div>
              <h3 className="font-bold text-slate-800 text-base">No Data Context Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Upload your small-to-medium enterprise financial statement spreadsheets in the upper control panel to generate interactive analytical visualizations.
              </p>
            </div>
          ) : (
            renderTabContent()
          )}
        </main>
      </div>
    </div>
  );
}
