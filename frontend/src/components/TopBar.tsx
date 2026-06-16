import React from 'react';
import { Upload, Calendar, ChevronDown } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          Welcome back, John <span className="animate-bounce">👋</span>
        </h2>
        <p className="text-xs text-slate-500">Here's how your business looks under current conditions.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 transition">
          <Upload className="w-4 h-4" />
          Upload Financials
        </button>
        
        <div className="flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-600 bg-slate-50">
          <Calendar className="w-4 h-4" />
          <span>May 12, 2025</span>
        </div>

        <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
            J
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-bold text-slate-800 leading-none">John Doe</p>
            <span className="text-xs text-slate-500 font-medium">Admin</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
