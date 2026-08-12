import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import NavigationTabs from './components/NavigationTabs.jsx';
import WorkbenchView from './components/WorkbenchView.jsx';
import LciSearchTab from './components/LciSearchTab.jsx';
import SimulatorView from './components/SimulatorView.jsx';
import ProjectsView from './components/ProjectsView.jsx';
import ComplianceView from './components/ComplianceView.jsx';
import ImportModal from './components/ImportModal.jsx';
import GoogleSheetsModal from './components/GoogleSheetsModal.jsx';
import { INDIA_GHG_FACTORS } from './data/indiaGhgFactors.js';

// Default Initial Items
const INITIAL_BOM = [
  { id: 1, name: "Aluminum Sheet, Primary Ingot 5052-H32", qty: 1450, unit: "kg", process: "Aluminum Sheet Primary Ingot", ef: 14.2, scope: "Scope 3", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "Auto-Matched", approved: true },
  { id: 2, name: "Custom Polyurethane Foam Insert", qty: 320, unit: "pcs", process: "Polyurethane Flexible Foam Fabrication", ef: 4.8, scope: "Scope 3", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "Auto-Matched", approved: true },
  { id: 3, name: "Copper Wire Drawing 12 AWG", qty: 50, unit: "kg", process: "Copper Wire Drawing 12 AWG", ef: 6.5, scope: "Scope 3", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "Auto-Matched", approved: true },
  { id: 4, name: "Grid Electricity (CEA India Grid Mix 2024)", qty: 12000, unit: "kWh", process: "Grid Electricity (CEA India Grid Mix 2024)", ef: 0.716, scope: "Scope 2", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "CEA Verified", approved: true },
  { id: 5, name: "Diesel Fuel (DG Sets & Power Generators)", qty: 500, unit: "Liters", process: "Diesel Fuel (DG Sets & Power Generators)", ef: 2.6558, scope: "Scope 1", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "India GHG Factor", approved: true }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj_default',
    projectName: 'FY2024-25 Corporate Carbon Audit',
    companyName: 'ACME Manufacturing Ltd.',
    standard: 'ISO 14064-1 & Scope 1-3',
    bom: INITIAL_BOM
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('workbench');
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('netzerocalc_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [activeProjectId, setActiveProjectId] = useState(() => {
    return localStorage.getItem('netzerocalc_active_proj_id') || 'proj_default';
  });

  const [accountingStandard, setAccountingStandard] = useState('ISO 14064-1 & Scope 1-3');
  const [geography, setGeography] = useState('IN');
  const [appliedScenario, setAppliedScenario] = useState(null);

  // Auditor Auth (Default unauthenticated per GHG audit protocol)
  const [currentAuditor, setCurrentAuditor] = useState(() => {
    const saved = localStorage.getItem('netzerocalc_auditor');
    return saved ? JSON.parse(saved) : {
      authenticated: false,
      name: 'Unauthenticated User',
      email: 'internal.draft@netzerocalc.io',
      cert: 'Self-Reported Internal Calculation'
    };
  });

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Active Project Data
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const currentBOM = activeProject ? activeProject.bom : [];

  const setCurrentBOM = (newBOM) => {
    setProjects(prevProjects => prevProjects.map(proj => {
      if (proj.id === activeProjectId) {
        return { ...proj, bom: newBOM };
      }
      return proj;
    }));
  };

  // LocalStorage Persist
  useEffect(() => {
    localStorage.setItem('netzerocalc_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('netzerocalc_active_proj_id', activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem('netzerocalc_auditor', JSON.stringify(currentAuditor));
  }, [currentAuditor]);

  // Handlers
  const handleSignIn = () => {
    setCurrentAuditor({
      authenticated: true,
      name: 'Senior Lead Auditor',
      email: 'lead.auditor@big4esg.com',
      cert: 'ISO 14064 Lead Assessor #84920'
    });
    showToast("Signed in as Lead Auditor.");
  };

  const handleSignOut = () => {
    setCurrentAuditor({ authenticated: false });
    showToast("Signed out.");
  };

  const handleSwitchProject = (projId) => {
    setActiveProjectId(projId);
    showToast("Switched audit workspace.");
  };

  const handleCreateProject = ({ projectName, companyName, standard }) => {
    const newId = `proj_${Date.now()}`;
    const newProj = {
      id: newId,
      projectName,
      companyName,
      standard,
      bom: []
    };
    setProjects([...projects, newProj]);
    setActiveProjectId(newId);
  };

  const handleDeleteProject = (projId) => {
    if (projects.length <= 1) return;
    const filtered = projects.filter(p => p.id !== projId);
    setProjects(filtered);
    if (activeProjectId === projId) {
      setActiveProjectId(filtered[0].id);
    }
    showToast("Deleted project workspace.");
  };

  const handleImportItems = (newItems) => {
    setCurrentBOM([...newItems, ...currentBOM]);
  };

  const handleApplyScenario = (scenarioData) => {
    setAppliedScenario(scenarioData);
    showToast("Scenario applied! Baseline vs Project scenario synchronized for ISO 14064-2 report.");
    setActiveTab('compliance');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased pb-12">
      
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header 
        currentAuditor={currentAuditor}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        activeProject={activeProject}
        projects={projects}
        onSwitchProject={handleSwitchProject}
        accountingStandard={accountingStandard}
        setAccountingStandard={setAccountingStandard}
        geography={geography}
        setGeography={setGeography}
      />

      {/* Navigation Bar */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        {activeTab === 'workbench' && (
          <WorkbenchView 
            currentBOM={currentBOM}
            setCurrentBOM={setCurrentBOM}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
            showToast={showToast}
          />
        )}

        {activeTab === 'lci-search' && (
          <LciSearchTab 
            onAddFactorToBOM={handleImportItems}
            showToast={showToast}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView 
            currentBOM={currentBOM}
            showToast={showToast}
            onApplyScenario={handleApplyScenario}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView 
            projects={projects}
            activeProjectId={activeProjectId}
            onSwitchProject={handleSwitchProject}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            showToast={showToast}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceView 
            currentBOM={currentBOM}
            currentAuditor={currentAuditor}
            activeProject={activeProject}
            accountingStandard={accountingStandard}
            appliedScenario={appliedScenario}
            showToast={showToast}
          />
        )}
      </main>

      {/* Modals */}
      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportItems={handleImportItems}
        showToast={showToast}
      />

      <GoogleSheetsModal 
        isOpen={isGoogleSheetsModalOpen}
        onClose={() => setIsGoogleSheetsModalOpen(false)}
        currentBOM={currentBOM}
        activeProject={activeProject}
        showToast={showToast}
      />

    </div>
  );
}
