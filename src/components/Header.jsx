import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, LogIn, ChevronDown, Database, Award, Activity, Edit3, Check, X } from 'lucide-react';

export default function Header({ 
  currentAuditor, 
  onSignIn, 
  onSignOut, 
  activeProject, 
  projects, 
  onSwitchProject, 
  accountingStandard, 
  setAccountingStandard,
  geography,
  setGeography,
  onGoHome,
  onUpdateProject
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState(activeProject?.companyName || 'ACME Corp');
  const [projectName, setProjectName] = useState(activeProject?.projectName || 'Scope 1-3 Carbon Inventory');

  useEffect(() => {
    if (activeProject) {
      setCompanyName(activeProject.companyName || 'ACME Corp');
      setProjectName(activeProject.projectName || 'Scope 1-3 Carbon Inventory');
    }
  }, [activeProject]);

  const handleSaveEdit = () => {
    if (onUpdateProject) {
      onUpdateProject({
        companyName: companyName.trim() || 'ACME Corp',
        projectName: projectName.trim() || 'Scope 1-3 Carbon Inventory'
      });
    }
    setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 pb-1">
      <div className="max-w-7xl mx-auto rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-3 flex flex-wrap justify-between items-center gap-4 relative">
        
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2.5 hover:opacity-90 transition-all cursor-pointer group"
            title="Return to Landing Page"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">
              <Activity className="text-slate-950 w-5 h-5 stroke-[2.5]" />
            </div>
            <h1 className="font-black text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">NetZeroCalc</h1>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-inner">
                v2.0 Enterprise
              </span>
            </div>
            
            {isEditing ? (
              <div className="flex items-center gap-1.5 mt-1 bg-slate-900/90 p-1 rounded-xl border border-emerald-500/60 shadow-lg">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="bg-slate-950 text-xs font-bold text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-800 outline-none w-44 focus:border-emerald-400"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-colors"
                  title="Save Company Name"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 cursor-pointer hover:text-slate-200 transition-colors group/edit"
                title="Click to edit Company Name"
              >
                <span className="text-slate-400 font-medium">{activeProject?.projectName || "Scope 1-3 Carbon Inventory"}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-300 font-bold bg-slate-900/90 px-2.5 py-0.5 rounded-lg border border-slate-800 group-hover/edit:border-emerald-500/50 flex items-center gap-1.5 shadow-sm">
                  {activeProject?.companyName || "ACME Corp"}
                  <Edit3 className="w-3 h-3 text-emerald-400 opacity-60 group-hover/edit:opacity-100" />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls & Standards Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* LCI Database Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 shadow-inner">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>India GHG Factors v6</span>
          </div>

          {/* Standard Select */}
          <select 
            value={accountingStandard} 
            onChange={(e) => setAccountingStandard(e.target.value)}
            className="bg-slate-900/90 text-xs font-semibold text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 cursor-pointer"
          >
            <option value="ISO 14064-1 & Scope 1-3">ISO 14064-1 & GHG Protocol</option>
            <option value="ISO 14064-2 Project Scenario">ISO 14064-2 Decarbonization</option>
            <option value="EU CBAM & DPP Disclosure">EU CBAM & DPP Disclosure</option>
          </select>

          {/* Geography Select */}
          <select 
            value={geography} 
            onChange={(e) => setGeography(e.target.value)}
            className="bg-slate-900/90 text-xs font-semibold text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 cursor-pointer"
          >
            <option value="IN">IN — India (CEA Grid)</option>
            <option value="GLO">GLO — Average</option>
            <option value="EU">EU — European Union</option>
            <option value="US">US — United States</option>
          </select>

          {/* Auditor Profile Button */}
          {currentAuditor.authenticated ? (
            <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-1.5 shadow-sm">
              {currentAuditor.picture ? (
                <img src={currentAuditor.picture} alt="Auditor" className="w-5 h-5 rounded-full ring-1 ring-emerald-400" />
              ) : (
                <UserCheck className="w-4 h-4 text-emerald-400" />
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-emerald-200 leading-none">{currentAuditor.name}</div>
                <div className="text-[10px] text-emerald-400/80 font-mono leading-none mt-0.5">{currentAuditor.cert}</div>
              </div>
              <button 
                onClick={onSignOut}
                className="ml-2 text-[10px] font-bold text-slate-400 hover:text-white underline cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignIn}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Auditor Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
