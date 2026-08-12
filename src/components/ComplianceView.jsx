import React from 'react';
import { ShieldCheck, Printer, CheckCircle2, AlertTriangle, FileText, Lock, Check } from 'lucide-react';

export default function ComplianceView({ 
  currentBOM, 
  currentAuditor, 
  activeProject, 
  accountingStandard, 
  appliedScenario,
  showToast 
}) {
  const isReady = currentBOM.length > 0 && currentBOM.every(i => i.approved);
  const totalFootprint = currentBOM.reduce((acc, i) => acc + (i.result_tco2e !== undefined && i.result_tco2e !== null ? i.result_tco2e : (i.qty * i.ef / 1000)), 0);
  const declarationSerial = `DECL-GHG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex justify-between items-center flex-wrap gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Audit Readiness & Inventory Disclosure Structure</span>
          </div>
          <h2 className="text-xl font-black text-white">Pre-Audit Internal GHG Inventory Declaration</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Internal carbon inventory declaration formatted for third-party audit review and BRSR / CBAM disclosure.
          </p>
        </div>

        <button 
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF Declaration</span>
        </button>
      </div>

      {/* Audit Integrity Compliance Banner */}
      <div className="p-4 bg-amber-50 rounded-xl text-amber-900 text-xs flex items-start gap-3 print:hidden">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-extrabold text-slate-900">Audit & Disclosure Integrity Disclosure Notice:</div>
          <p className="text-[11px] leading-relaxed text-amber-900">
            This document is a self-calculated internal inventory disclosure prepared for pre-audit review. It <strong>does NOT</strong> constitute an official independent third-party ISAE 3410 assurance report or ISO 14064-3 certificate. Third-party assurance requires independent practitioner engagement, verification of primary source evidence, and practitioner sign-off.
          </p>
        </div>
      </div>

      {/* Main Print-Ready Report Document */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 space-y-6 print:border-none print:-none print:p-0">
        
        {/* Document Title Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">SELF-REPORTED GREENHOUSE GAS DISCLOSURE</div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">PRE-AUDIT INTERNAL GHG INVENTORY DECLARATION</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Calculated in accordance with {accountingStandard} & IPCC AR6 GWP Standards</p>
          </div>

          <div className="text-right">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black inline-block mb-1 border ${
              isReady 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              {isReady ? 'INTERNAL DRAFT — REVIEW READY' : 'UNAPPROVED ITEMS PENDING'}
            </span>
            <div className="text-[10px] font-bold text-slate-500">
              {currentAuditor.authenticated 
                ? `Practitioner Review: ${currentAuditor.name}` 
                : 'Self-Reported Unverified Internal Calculation'
              }
            </div>
          </div>
        </div>

        {/* Section 1: Self-Declaration Statement */}
        <div className="text-xs space-y-3 text-slate-600 leading-relaxed">
          <p>
            This internal disclosure statement presents the quantified Greenhouse Gas Inventory for{' '}
            <strong className="text-slate-900 font-bold">{activeProject?.projectName || 'Scope 1-3 Carbon Inventory'}</strong> (
            <strong className="text-slate-900 font-bold">{activeProject?.companyName || 'Corporate Entity'}</strong>) evaluated under{' '}
            <strong className="text-slate-900 font-bold">{accountingStandard}</strong> using <strong className="text-slate-900 font-bold">India GHG Factors v6</strong> database.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium space-y-1 text-slate-800">
            <div>
              <strong>QUANTIFIED INVENTORY BOUNDARY:</strong> Calculated Total Footprint (Location-Based): <strong>{totalFootprint.toFixed(3)} tCO₂e</strong> across Scope 1, Scope 2, and Scope 3.
            </div>
            {activeProject?.coverBoundary && (
              <div className="mt-2 pt-2 border-t border-slate-200 space-y-1">
                <div><strong>Consolidation Approach:</strong> {activeProject.coverBoundary.consolidationApproach || 'Not Specified'}</div>
                <div><strong>Reporting Period:</strong> {activeProject.coverBoundary.reportingPeriod || 'Not Specified'}</div>
                <div><strong>Base Year:</strong> {activeProject.coverBoundary.baseYear || 'Not Specified'}</div>
                <div><strong>Materiality Threshold:</strong> {activeProject.coverBoundary.materialityThreshold || 'Not Specified'}</div>
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-2">
              GWP Basis: {activeProject?.coverBoundary?.gwpVintage || 'IPCC AR6 (100-year GWP horizon)'}. Primary operational boundary defined by reporting entity.
            </div>
          </div>
        </div>

        {/* Section 2: Quantified Inventory Table */}
        <div className="space-y-2">
          <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">Quantified GHG Inventory Scope Breakdown</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Scope</th>
                  <th className="p-2.5">GHG Protocol Category</th>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-right">Activity Data</th>
                  <th className="p-2.5">LCI Factor Source</th>
                  <th className="p-2.5 text-right">EF (kgCO₂e/unit)</th>
                  <th className="p-2.5 text-right">Footprint (tCO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {currentBOM.map(item => {
                  const co2e = (item.result_tco2e !== undefined && item.result_tco2e !== null) ? item.result_tco2e.toFixed(3) : ((item.qty * item.ef) / 1000).toFixed(3);
                  return (
                    <tr key={item.id}>
                      <td className="p-2.5 font-bold"><span className="px-1.5 py-0.5 rounded text-[9px] border bg-slate-100 text-slate-800 border-slate-300">{item.scope || 'Scope 3'}</span></td>
                      <td className="p-2.5 text-slate-700 font-semibold">{item.scope3Category || 'Cat 1: Goods & Services'}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{item.name}</td>
                      <td className="p-2.5 text-right font-mono">{item.qty.toLocaleString()} {item.unit}</td>
                      <td className="p-2.5 text-slate-600 max-w-[180px] truncate">{item.process}</td>
                      <td className="p-2.5 text-right font-mono">{item.ef}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-800">{co2e} t</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Scenario & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[11px]">ISO 14064-2 Decarbonization Scenario</h4>
            {appliedScenario ? (
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div>Baseline Footprint: <strong>{appliedScenario.baselineTotal?.toFixed(3)} tCO₂e</strong></div>
                <div>Avoided Emissions: <strong className="text-emerald-700">+{appliedScenario.avoidedTotal?.toFixed(3)} tCO₂e</strong></div>
                <div>Net Footprint: <strong>{appliedScenario.netFootprint?.toFixed(3)} tCO₂e</strong></div>
              </div>
            ) : (
              <div className="text-slate-500">No scenario applied yet. Use What-If Simulator to apply decarbonization levers.</div>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-right">
            <h4 className="font-bold text-slate-900 uppercase text-[11px]">Declaration Serial & Verification Posture</h4>
            <div className="font-mono font-bold text-slate-800 text-xs">{declarationSerial}</div>
            <div className="text-[10px] text-slate-500">
              {currentAuditor.authenticated ? `Verified: ${currentAuditor.name}` : 'Self-Reported Internal Calculation (Unverified)'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
