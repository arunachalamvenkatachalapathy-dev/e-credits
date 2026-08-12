import React, { useState } from 'react';
import { FolderPlus, CheckCircle, Trash2, Layers, Building, Calendar } from 'lucide-react';

export default function ProjectsView({ 
  projects, 
  activeProjectId, 
  onSwitchProject, 
  onCreateProject, 
  onDeleteProject,
  showToast 
}) {
  const [newProjectName, setNewProjectName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newStandard, setNewStandard] = useState('ISO 14064-1 & Scope 1-3');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateProject({
      projectName: newProjectName.trim(),
      companyName: newCompany.trim() || 'Corporate Entity',
      standard: newStandard
    });
    setNewProjectName('');
    setNewCompany('');
    setShowCreateModal(false);
    showToast("Created new audit project workspace.");
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Project Workspaces & Audit Registry</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage multi-entity corporate carbon audit projects, Scope 1-3 accounting boundaries, and ISO standards.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <FolderPlus className="w-4 h-4" />
          <span>+ Create New Audit Project</span>
        </button>
      </div>

      {/* Projects Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const isActive = proj.id === activeProjectId;
          const bomCount = proj.bom ? proj.bom.length : 0;
          const totalFt = proj.bom ? proj.bom.reduce((acc, i) => acc + (i.qty * i.ef / 1000), 0) : 0;

          return (
            <div 
              key={proj.id} 
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all flex flex-col justify-between ${
                isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <Layers className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{proj.projectName}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{proj.companyName}</span>
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Accounting Standard:</span>
                    <span className="font-bold text-slate-900">{proj.standard || 'ISO 14064-1'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mapped Items:</span>
                    <span className="font-bold text-slate-900">{bomCount} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Footprint:</span>
                    <span className="font-extrabold text-emerald-700 font-mono">{totalFt.toFixed(3)} tCO₂e</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button 
                  onClick={() => onSwitchProject(proj.id)}
                  disabled={isActive}
                  className={`flex-1 text-xs font-bold py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isActive ? 'Current Workspace' : 'Switch Workspace'}
                </button>

                {projects.length > 1 && (
                  <button 
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-2 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Create New Audit Project</h3>
            
            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. FY2024-25 Corporate ESG Audit" 
                  value={newProjectName} 
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Entity Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Acme Manufacturing Ltd." 
                  value={newCompany} 
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Accounting Standard</label>
                <select 
                  value={newStandard} 
                  onChange={(e) => setNewStandard(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-emerald-500 font-semibold bg-white"
                >
                  <option value="ISO 14064-1 & Scope 1-3">ISO 14064-1 & Scope 1-3</option>
                  <option value="ISO 14064-2 Decarbonization">ISO 14064-2 Decarbonization</option>
                  <option value="EU CBAM & DPP Disclosure">EU CBAM & DPP Disclosure</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-sm"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
