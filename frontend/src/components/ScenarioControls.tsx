import React from 'react';

export default function ScenarioControls({ controls, setControls, onRun }) {
  const handleChange = (field, val) => {
    setControls(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm w-max lg:w-80 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-1.5 mb-4">
          <h3 className="font-bold text-slate-800 text-sm">Scenario Controls</h3>
          <span className="text-slate-400 text-xs cursor-pointer">ⓘ</span>
        </div>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">Adjust variables to see how economic changes impact your business.</p>
        
        <div className="space-y-4">
          {/* Inflation Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <label>Inflation Rate</label>
              <span>{controls.inflation_rate}%</span>
            </div>
            <input 
              type="range" min="0" max="20" value={controls.inflation_rate}
              onChange={(e) => handleChange('inflation_rate', parseInt(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Inventory Cost Increase */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <label>Inventory Cost Increase</label>
              <span>{controls.inventory_increase}%</span>
            </div>
            <input 
              type="range" min="0" max="50" value={controls.inventory_increase}
              onChange={(e) => handleChange('inventory_increase', parseInt(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Wage Increase */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <label>Wage Increase</label>
              <span>{controls.wage_increase}%</span>
            </div>
            <input 
              type="range" min="0" max="30" value={controls.wage_increase}
              onChange={(e) => handleChange('wage_increase', parseInt(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Customer Payment Terms */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <label>Customer Payment Terms</label>
            </div>
            <select
              value={controls.payment_terms}
              onChange={(e) => handleChange('payment_terms', parseInt(e.target.value))}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={30}>30 Days (Net 30)</option>
              <option value={60}>60 Days (Net 60)</option>
              <option value={90}>90 Days (Net 90)</option>
            </select>
          </div>

          {/* Sales Growth Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <label>Sales Growth Rate</label>
              <span>{controls.sales_growth}%</span>
            </div>
            <input 
              type="range" min="-20" max="50" value={controls.sales_growth}
              onChange={(e) => handleChange('sales_growth', parseInt(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button 
          onClick={() => setControls({ inflation_rate: 0, inventory_increase: 0, wage_increase: 0, payment_terms: 30, sales_growth: 0 })}
          className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-lg transition"
        >
          Reset
        </button>
        <button 
          onClick={onRun}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition"
        >
          Run Scenario
        </button>
      </div>
    </div>
  );
}
