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
      <div className="p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl flex gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all duration-300 rounded-xl whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02] font-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
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
