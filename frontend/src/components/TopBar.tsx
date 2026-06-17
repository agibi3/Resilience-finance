import React, { useRef, useState } from "react";
import { Upload, Calendar, ChevronDown, Menu, Loader2, FileSpreadsheet } from "lucide-react";

interface TopBarProps {
  onMenuToggle: () => void;
  onAnalyze: (file: File, period: string) => Promise<void>;
}

export default function TopBar({ onMenuToggle, onAnalyze }: TopBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [period, setPeriod] = useState<string>("monthly");
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  }

  async function handleAnalyze() {
    if (!selectedFile) return;
    try {
      setAnalyzing(true);
      await onAnalyze(selectedFile, period);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b bg-white p-4 shadow-sm">
      {/* Left Section: Branding & Toggle */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-2 lg:hidden" aria-label="Toggle menu">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold">Welcome Back AGIBI 👋</h2>
          <p className="text-xs text-slate-500">SME Financial Dashboard</p>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* File Select Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          <span className="max-w-[150px] truncate">
            {selectedFile ? selectedFile.name : "Select Dataset"}
          </span>
        </button>

        {/* Period Dropdown */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>

        {/* Action Button */}
        <button
          disabled={!selectedFile || analyzing}
          onClick={handleAnalyze}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              Analyze Data
            </>
          )}
        </button>

        {/* Static Date Display */}
        <div className="hidden md:flex items-center gap-2 border px-3 py-2 rounded-lg text-sm text-slate-600 bg-slate-50">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString()}
        </div>

        {/* User Profile Dropdown Placeholder */}
        <div className="flex items-center gap-2 cursor-pointer border-l pl-3 ml-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}
