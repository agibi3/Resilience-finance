import React, {
useState,
useEffect
} from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import MetricCards from "./components/MetricCards";
import ScenarioControls from "./components/ScenarioControls";
import RunwayChart from "./components/RunwayChart";
import AdvisorPanel from "./components/AdvisorPanel";
import ScenariosTable from "./components/ScenariosTable";

import Trends from "./pages/Trends";
import CashSummary from "./pages/CashSummary";
import CapDays from "./pages/CapDays";

import {
uploadFinancialFile,
runSimulation,
getScenarios,
getTrends,
getCashSummary
} from "./services/api";

export default function App() {

const [controls, setControls] =
useState({
inflation_rate: 8,
inventory_increase: 15,
wage_increase: 6,
payment_terms: 60,
sales_growth: 0
});

const [metrics, setMetrics] =
useState(null);

const [history, setHistory] =
useState([]);

const [trendData, setTrendData] =
useState([]);

const [cashSummary, setCashSummary] =
useState(null);

const [isSyncing, setIsSyncing] =
useState(false);

const [activeTab, setActiveTab] =
useState("Resilience");

const [
isSidebarOpen,
setIsSidebarOpen
] = useState(false);

async function loadDashboard() {

try {

  const scenarios =
    await getScenarios();

  setHistory(
    scenarios || []
  );

  const trends =
    await getTrends();

  setTrendData(
    trends || []
  );

  const summary =
    await getCashSummary();

  setCashSummary(
    summary
  );

} catch (error) {

  console.error(
    "Dashboard load failed",
    error
  );

}

}

async function handleFileUpload(
file
) {

try {

  setIsSyncing(true);

  await uploadFinancialFile(
    file
  );

  await loadDashboard();

  alert(
    "Financial file uploaded successfully."
  );

} catch (error) {

  console.error(error);

  alert(
    "Upload failed."
  );

} finally {

  setIsSyncing(false);

}

}

async function fetchSimulation() {

try {

  setIsSyncing(true);

  const result =
    await runSimulation({
      scenario_name:
        "Custom Scenario",

      inflation_rate:
        controls.inflation_rate,

      inventory_increase:
        controls.inventory_increase,

      wage_increase:
        controls.wage_increase,

      payment_terms:
        controls.payment_terms,

      sales_growth:
        controls.sales_growth
    });

  setMetrics(
    result
  );

  await loadDashboard();

} catch (error) {

  console.error(
    error
  );

  alert(
    "Simulation failed."
  );

} finally {

  setIsSyncing(false);

}

}

useEffect(() => {

loadDashboard();

}, []);

function renderTabContent() {

switch (
  activeTab
) {

  case "Resilience":

    return (
      <>
        <MetricCards
          data={metrics}
        />

        <div
          className="
          flex
          flex-col
          lg:flex-row
          gap-5
          mt-5
        "
        >

          <ScenarioControls
            controls={
              controls
            }
            setControls={
              setControls
            }
            onRun={
              fetchSimulation
            }
          />

          <RunwayChart
            chartData={
              metrics?.chart_data ||
              []
            }
            baseDays={
              metrics?.cash_runway_base ||
              0
            }
            stressDays={
              metrics?.cash_runway_stress ||
              0
            }
          />

          <AdvisorPanel
            warnings={
              metrics?.warnings ||
              []
            }
            recommendations={
              metrics?.recommendations ||
              []
            }
          />

        </div>

        <ScenariosTable
          history={
            history
          }
        />

      </>
    );

  case "Trends":

    return (
      <Trends
        data={
          trendData
        }
      />
    );

  case "Cash Summary":

    return (
      <CashSummary
        summary={
          cashSummary
        }
      />
    );

  case "Cap Days":

    return (
      <CapDays
        metrics={
          metrics
        }
      />
    );

  default:

    return null;

}

}

return (

<div
  className="
  flex
  min-h-screen
  bg-slate-50
"
>

  {isSidebarOpen && (

    <div
      className="
      fixed
      inset-0
      bg-black/30
      z-40
      lg:hidden
    "
      onClick={() =>
        setIsSidebarOpen(
          false
        )
      }
    />

  )}

  <Sidebar
    activeTab={
      activeTab
    }
    setActiveTab={
      setActiveTab
    }
    isOpen={
      isSidebarOpen
    }
    onClose={() =>
      setIsSidebarOpen(
        false
      )
    }
  />

  <div
    className="
    flex-1
    flex
    flex-col
    min-w-0
  "
  >

    <TopBar
      onMenuToggle={() =>
        setIsSidebarOpen(
          !isSidebarOpen
        )
      }
      onFileUpload={
        handleFileUpload
      }
    />

    <main
      className="
      flex-1
      p-4
      md:p-6
      overflow-y-auto
      relative
    "
    >

      {isSyncing && (

        <div
          className="
          absolute
          top-4
          right-4
          px-3
          py-1
          rounded
          bg-blue-100
          text-blue-700
          text-xs
          font-bold
          animate-pulse
        "
        >
          Syncing...
        </div>

      )}

      {renderTabContent()}

    </main>

  </div>

</div>

);

}