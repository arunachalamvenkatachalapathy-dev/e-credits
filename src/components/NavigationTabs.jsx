import React from 'react';
import { Table, Sliders, FolderKanban, FileCheck, Search } from 'lucide-react';

export default function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'workbench', label: 'Inventory Workbench', icon: Table },
    { id: 'lci-search', label: 'LCI Factor Search', icon: Search },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'projects', label: 'Workspaces', icon: FolderKanban },
    { id: 'compliance', label: 'Assurance Report', icon: FileCheck },
    { id: 'ghg-calculator', label: 'Open GHG Calculator', icon: Table },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mt-4 relative z-10">
      <div className="p-1.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-950/5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all duration-300 rounded-xl whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 scale-[1.02] font-black'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
