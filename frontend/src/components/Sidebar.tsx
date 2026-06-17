import { Shield, TrendingUp, Calendar, FileText, X } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }:any) {
  const menuItems = [
    { name: 'Resilience', icon: Shield },
    { name: 'Trends', icon: TrendingUp },
    { name: 'Cap Days', icon: Calendar },
    { name: 'Cash Summary', icon: FileText },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-[#0B132B] text-white flex flex-col p-4 border-r border-slate-800
      transform transition-transform duration-300 ease-in-out
      lg:static lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Header section with mobile close action */}
      <div className="flex items-center justify-between mb-8 px-2 py-3">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="font-bold text-lg leading-tight">ResilienceFinance</h1>
            <span className="text-xs text-slate-400 font-medium tracking-wide">SME Stress-Tester</span>
          </div>
        </div>
        
        {/* Close Button on Mobile viewports */}
        <button 
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation item mappings */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          
          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                onClose(); // Auto-closes sliding drawer on mobile once selection fires
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 rounded-l-none font-bold' 
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
