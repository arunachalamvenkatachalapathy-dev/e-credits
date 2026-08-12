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
    <div className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
