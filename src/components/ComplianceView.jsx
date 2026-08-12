import React from 'react';
import { ShieldCheck, Printer, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function ComplianceView({ 
  currentBOM, 
  currentAuditor, 
  activeProject, 
  accountingStandard, 
  appliedScenario,
  showToast 
}) {
  const isReady = currentAuditor.authenticated && currentBOM.length > 0 && currentBOM.every(i => i.approved);
  const totalFootprint = currentBOM.reduce((acc, i) => acc + (i.qty * i.ef / 1000), 0);
  const certSerial = `CERT-ISO14064-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex justify-between items-center flex-wrap gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Assurance-Ready Structure (ISAE 3410 & ISO 14064-3)</span>
          </div>
          <h2 className="text-xl font-black text-white">Independent Practitioner's GHG Assurance Report</h2>
          <p className="text-xs text-slate-400 mt-1">
            Verifiable greenhouse gas inventory declaration formatted for third-party carbon audit and ESG assurance.
          </p>
        </div>

        <button 
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Official PDF Certificate</span>
        </button>
      </div>

      {/* Main Print-Ready Report Document */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Document Title Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">GLOBAL SUSTAINABILITY ASSURANCE PRACTICE</div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">INDEPENDENT PRACTITIONER'S ASSURANCE REPORT</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Assurance Structure Supports ISAE 3410 & ISO 14064-3 Standard Guidelines</p>
          </div>

          <div className="text-right">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black inline-block mb-1 border ${
              isReady 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              {isReady ? 'AUDIT READY / ASSURED' : 'PENDING AUDITOR SIGN-OFF'}
            </span>
            <div className="text-[10px] font-bold text-slate-500">
              {currentAuditor.authenticated 
                ? `Verified by: ${currentAuditor.name} (${currentAuditor.cert})` 
                : 'Verified by: Unauthenticated (Auditor Login Required)'
              }
            </div>
          </div>
        </div>

        {/* Section 1: Conclusion Statement */}
        <div className="text-xs space-y-3 text-slate-600 leading-relaxed">
          <p>
            We have performed an independent practitioner limited assurance engagement on the Carbon Footprint & GHG Inventory calculations for{' '}
            <strong className="text-slate-900 font-bold">{activeProject?.projectName || 'Scope 1-3 Carbon Inventory'}</strong> (
            <strong className="text-slate-900 font-bold">{activeProject?.companyName || 'Corporate Entity'}</strong>) under{' '}
            <strong className="text-slate-900 font-bold">{accountingStandard}</strong> using <strong className="text-slate-900 font-bold">India GHG Factors v6</strong> database.
          </p>

          <div className={`p-4 rounded-xl border text-xs font-medium ${
            isReady ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isReady ? (
              <div>
                <strong>LIMITED ASSURANCE CONCLUSION:</strong> Based on the procedures performed and evidence obtained, nothing has come to our attention that causes us to believe that the GHG inventory quantification of <strong>{totalFootprint.toFixed(3)} tCO₂e</strong> is not prepared, in all material respects, in accordance with ISO 14064-1 standard guidelines.
              </div>
            ) : (
              <div>
                <strong>PENDING SIGN-OFF:</strong> Complete auditor login and approve all inventory line items to issue official ISO 14064 assurance statement.
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Quantified Inventory Table */}
        <div className="space-y-2">
          <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">Quantified GHG Inventory Scope Breakdown</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-700 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Scope Category</th>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-right">Activity Data</th>
                  <th className="p-2.5">LCI Factor Source</th>
                  <th className="p-2.5 text-right">EF (kgCO₂e/unit)</th>
                  <th className="p-2.5 text-right">Footprint (tCO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {currentBOM.map(item => {
                  const co2e = ((item.qty * item.ef) / 1000).toFixed(3);
                  return (
                    <tr key={item.id}>
                      <td className="p-2.5 font-bold"><span className="px-1.5 py-0.5 rounded text-[9px] border bg-slate-100 text-slate-800 border-slate-300">{item.scope || 'Scope 3'}</span></td>
                      <td className="p-2.5 font-semibold text-slate-900">{item.name}</td>
                      <td className="p-2.5 text-right font-mono">{item.qty.toLocaleString()} {item.unit}</td>
                      <td className="p-2.5 text-slate-600 max-w-[200px] truncate">{item.process}</td>
                      <td className="p-2.5 text-right font-mono">{item.ef}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-800">{co2e} t</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Scenario & Certificate Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[11px]">ISO 14064-2 Decarbonization Scenario</h4>
            {appliedScenario ? (
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div>Baseline Footprint: <strong>{appliedScenario.baselineFootprint}</strong></div>
                <div>Avoided Emissions: <strong className="text-emerald-700">+{appliedScenario.avoidedTotal?.toFixed(3)} tCO₂e</strong></div>
                <div>Net Footprint: <strong>{appliedScenario.netFootprint?.toFixed(3)} tCO₂e</strong></div>
              </div>
            ) : (
              <div className="text-slate-500">No scenario applied yet. Use What-If Simulator to apply decarbonization levers.</div>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-right">
            <h4 className="font-bold text-slate-900 uppercase text-[11px]">Verifier Serial & Digital Stamp</h4>
            <div className="font-mono font-bold text-emerald-800 text-sm">{isReady ? certSerial : '— PENDING —'}</div>
            <div className="text-[11px] text-slate-500">
              {currentAuditor.authenticated ? currentAuditor.name : 'Unauthenticated Auditor Profile'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
