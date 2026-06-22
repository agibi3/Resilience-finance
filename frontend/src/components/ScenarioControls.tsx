import React from "react";

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

interface ScenarioControlsProps {
  controls: ScenarioControlsState;
  setControls: React.Dispatch<React.SetStateAction<ScenarioControlsState>>;
  onRun: () => void;
}


export default function ScenarioControls({
  controls,
  setControls,
  onRun,
}: ScenarioControlsProps) {
  const handleChange = (key: keyof ScenarioControlsState, value: number) => {
    setControls((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Resets controls back to baseline financial metrics
  const handleReset = () => {
    setControls({
      inflation_rate: 0,
      inventory_increase: 0,
      wage_increase: 0,
      payment_terms: 30,
      sales_growth: 0,
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full lg:w-80 flex flex-col justify-between">
      <div>
        {/* Header Block */}
        <div className="flex items-center gap-1.5 mb-2">
          <h3 className="font-bold text-slate-800 text-sm">Scenario Controls</h3>
          <span className="text-slate-400 text-xs cursor-help" title="Macroeconomic variables">ⓘ</span>
        </div>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Adjust variables to see how economic changes impact your business liquidity and runway.
        </p>
        
        {/* Input Controls Container */}
        <div className="space-y-5">
          
          {/* Inflation Rate Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <label htmlFor="inflation_rate">Inflation Rate</label>
              <span className="font-mono text-slate-500">{controls.inflation_rate}%</span>
            </div>
            <input 
              id="inflation_rate"
              type="range" 
              min="0" 
              max="20" 
              value={controls.inflation_rate}
              onChange={(e) => handleChange('inflation_rate', parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Inventory Cost Increase Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <label htmlFor="inventory_increase">Inventory Cost Increase</label>
              <span className="font-mono text-slate-500">{controls.inventory_increase}%</span>
            </div>
            <input 
              id="inventory_increase"
              type="range" 
              min="0" 
              max="50" 
              value={controls.inventory_increase}
              onChange={(e) => handleChange('inventory_increase', parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Wage Increase Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <label htmlFor="wage_increase">Wage Increase</label>
              <span className="font-mono text-slate-500">{controls.wage_increase}%</span>
            </div>
            <input 
              id="wage_increase"
              type="range" 
              min="0" 
              max="30" 
              value={controls.wage_increase}
              onChange={(e) => handleChange('wage_increase', parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Customer Payment Terms Selector Dropdown */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <label htmlFor="payment_terms">Customer Payment Terms</label>
            </div>
            <select
              id="payment_terms"
              value={controls.payment_terms}
              onChange={(e) => handleChange('payment_terms', parseInt(e.target.value, 10))}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value={30}>30 Days (Net 30)</option>
              <option value={60}>60 Days (Net 60)</option>
              <option value={90}>90 Days (Net 90)</option>
            </select>
          </div>

          {/* Sales Growth Rate Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <label htmlFor="sales_growth">Sales Growth Rate</label>
              <span className="font-mono text-slate-500">{controls.sales_growth}%</span>
            </div>
            <input 
              id="sales_growth"
              type="range" 
              min="-20" 
              max="50" 
              value={controls.sales_growth}
              onChange={(e) => handleChange('sales_growth', parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>
          
        </div>
      </div>

      {/* Execution Buttons Grid */}
      <div className="grid grid-cols-2 gap-3 mt-8">
        <button 
          type="button"
          onClick={handleReset}
          className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-lg transition"
        >
          Reset Defaults
        </button>
        <button 
          type="button"
          onClick={onRun}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-colors"
        >
          Run Scenario
        </button>
      </div>
    </div>
  );
}
