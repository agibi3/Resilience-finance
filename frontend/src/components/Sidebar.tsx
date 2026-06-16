import React from 'react';
import { Shield, LayoutDashboard, TrendingUp, Calendar, FileText } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Resilience', icon: Shield, active: true },
    { name: 'Trends', icon: TrendingUp },
    { name: 'Cap Days', icon: Calendar },
    { name: 'Cash Summary', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-brand-dark text-white min-h-screen flex flex-col p-4 border-r border-slate-800">
      <div className="flex items-center gap-3 mb-8 px-2 py-3">
        <Shield className="w-8 h-8 text-blue-400" />
        <div>
          <h1 className="font-bold text-lg leading-tight">ResilienceFinance</h1>
          <span className="text-xs text-slate-400 font-medium tracking-wide">SME Stress-Tester</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                item.active 
                  ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
