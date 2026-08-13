import React, { useState } from 'react';
import { 
  Plus, Upload, Trash2, CheckCircle2, AlertTriangle, Download, 
  RefreshCw, FileSpreadsheet, Sparkles, Filter, Check, Info, ExternalLink 
} from 'lucide-react';
import { INDIA_GHG_FACTORS } from '../data/indiaGhgFactors.js';

export default function WorkbenchView({ 
  currentBOM, 
  setCurrentBOM, 
  onOpenImportModal, 
  onOpenGoogleSheetsModal, 
  showToast 
}) {
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [quickPreset, setQuickPreset] = useState('');
  const [quickQty, setQuickQty] = useState(100);

  const calcTCO2e = (item) => (item.result_tco2e !== undefined && item.result_tco2e !== null) ? item.result_tco2e : (item.qty * item.ef / 1000);

  // Scope 1, 2 Location-Based, Scope 2 Market-Based, and Scope 3 Totals
  const scope1Total = currentBOM.filter(i => i.scope === 'Scope 1').reduce((acc, i) => acc + calcTCO2e(i), 0);
  
  // Scope 2 Dual Reporting (Location-Based vs Market-Based per GHG Protocol Guidance)
  const scope2LocationTotal = currentBOM.filter(i => 
    i.scope === 'Scope 2' && (i.scope2Method ? i.scope2Method === 'location' : !i.name.toLowerCase().includes('ppa'))
  ).reduce((acc, i) => acc + calcTCO2e(i), 0);
  
  const scope2MarketTotal = currentBOM.filter(i => 
    i.scope === 'Scope 2' && (i.scope2Method ? i.scope2Method === 'market' : i.name.toLowerCase().includes('ppa'))
  ).reduce((acc, i) => acc + calcTCO2e(i), 0);

  const scope3Total = currentBOM.filter(i => (i.scope || 'Scope 3') === 'Scope 3').reduce((acc, i) => acc + calcTCO2e(i), 0);
  
  // Location-Based Grand Total (Default GHG Protocol Boundary)
  const grandTotal = scope1Total + scope2LocationTotal + scope3Total;

  // Filtered Items
  const filteredItems = currentBOM.filter(i => {
    if (riskFilter === 'ALL') return true;
    return (i.risk || 'LOW') === riskFilter;
  });

  // Add Item from Preset Dropdown
  const handleAddPreset = () => {
    if (!quickPreset) return;
    const factorObj = INDIA_GHG_FACTORS.find(f => f.key === quickPreset);
    if (!factorObj) return;

    const newItem = {
      id: Date.now(),
      name: factorObj.name,
      qty: parseFloat(quickQty) || 100,
      unit: factorObj.unit,
      process: `India GHG Factor: ${factorObj.name}`,
      ef: factorObj.ef,
      sim: 1.0,
      ter: 1, ger: 1, tir: 1,
      risk: 'LOW',
      scope: factorObj.scope,
      scope3Category: factorObj.scope3Category || 'Cat 1: Purchased Goods & Services',
      gwpBasis: factorObj.gwpBasis || 'IPCC AR6',
      sourceUrl: factorObj.sourceUrl,
      status: 'Preset Verified',
      approved: true,
      notes: factorObj.notes
    };

    setCurrentBOM([newItem, ...currentBOM]);
    setQuickPreset('');
    showToast(`Added ${factorObj.name} (${quickQty} ${factorObj.unit})`);
  };

  // Inline Qty Edit
  const handleQtyChange = (id, newQty) => {
    const val = parseFloat(newQty);
    if (isNaN(val) || val < 0) return;
    setCurrentBOM(currentBOM.map(item => item.id === id ? { ...item, qty: val } : item));
  };

  // Toggle Approved Status
  const toggleApprove = (id) => {
    setCurrentBOM(currentBOM.map(item => item.id === id ? { ...item, approved: !item.approved } : item));
  };

  // Delete Row
  const handleDeleteRow = (id) => {
    setCurrentBOM(currentBOM.filter(item => item.id !== id));
    showToast("Line item deleted.");
  };

  // Approve All Low Risk
  const handleApproveAllLowRisk = () => {
    setCurrentBOM(currentBOM.map(item => item.risk === 'LOW' ? { ...item, approved: true } : item));
    showToast("Approved all low-risk line items.");
  };

  // Clear Table
  const handleClearTable = () => {
    if (window.confirm("Clear all items from inventory?")) {
      setCurrentBOM([]);
      showToast("Inventory table cleared.");
    }
  };

  // Load Sample Demo Data
  const handleLoadSampleDemo = () => {
    const demoItems = [
      { id: Date.now() + 1, name: "Aluminum Sheet, Primary Ingot 5052-H32", qty: 1450, unit: "kg", process: "Aluminum Sheet Primary Ingot", ef: 14.2, scope: "Scope 3", scope3Category: "Cat 1: Purchased Goods & Services", gwpBasis: "IPCC AR6", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "Auto-Matched", approved: true },
      { id: Date.now() + 2, name: "Custom Polyurethane Foam Insert", qty: 320, unit: "pcs", process: "Polyurethane Flexible Foam Fabrication", ef: 4.8, scope: "Scope 3", scope3Category: "Cat 1: Purchased Goods & Services", gwpBasis: "IPCC AR6", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "Auto-Matched", approved: true },
      { id: Date.now() + 3, name: "Copper Wire Drawing 12 AWG", qty: 50, unit: "kg", process: "Copper Wire Drawing 12 AWG", ef: 6.5, scope: "Scope 3", scope3Category: "Cat 1: Purchased Goods & Services", gwpBasis: "IPCC AR6", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "Auto-Matched", approved: true },
      { id: Date.now() + 4, name: "Grid Electricity (CEA India Grid Mix 2024)", qty: 12000, unit: "kWh", process: "Grid Electricity (CEA India Grid Mix 2024)", ef: 0.716, scope: "Scope 2", scope3Category: "N/A (Scope 2 Location-Based)", gwpBasis: "IPCC AR6", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "CEA Verified", approved: true },
      { id: Date.now() + 5, name: "Diesel Fuel (DG Sets & Power Generators)", qty: 500, unit: "Liters", process: "Diesel Fuel Thermal Combustion", ef: 2.6558, scope: "Scope 1", scope3Category: "N/A (Scope 1 Direct)", gwpBasis: "IPCC AR6", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "India GHG Factor", approved: true }
    ];
    setCurrentBOM(demoItems);
    showToast("Loaded sample demo inventory data.");
  };

  // Export CBAM CSV
  const handleExportCSV = () => {
    if (currentBOM.length === 0) {
      showToast("No data to export.");
      return;
    }
    let csv = "Item Description,Quantity,Unit,Matched LCI Process,Emission Factor (kgCO2e/unit),Footprint (tCO2e),Scope Category,GHG Protocol Scope 3 Category,GWP Basis,Audit Risk,Status\n";
    currentBOM.forEach(item => {
      let tco2e = (item.result_tco2e !== undefined && item.result_tco2e !== null) ? item.result_tco2e.toFixed(4) : ((item.qty * item.ef) / 1000).toFixed(4);
      csv += `"${item.name.replace(/"/g, '""')}",${item.qty},"${item.unit}","${item.process.replace(/"/g, '""')}",${item.ef},${tco2e},"${item.scope}","${item.scope3Category || 'Cat 1: Purchased Goods'}","${item.gwpBasis || 'IPCC AR6'}","${item.risk}","${item.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NetZeroCalc_CBAM_Inventory_${Date.now()}.csv`;
    link.click();
    showToast("Exported CBAM Inventory CSV.");
  };

  return (
    <div className="space-y-6">
      
      {/* Scope KPI Cards Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Carbon Footprint Card */}
        <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-5 border border-emerald-500/30 shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Total Footprint (Location-Based)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-4xl font-black text-white font-mono my-2 tracking-tight">
            {grandTotal.toFixed(3)} <span className="text-sm font-bold text-emerald-400">tCO₂e</span>
          </div>
          <div className="text-[10px] text-emerald-200/80 font-mono">
            GWP Standard: <strong className="text-white">IPCC AR6 (100-yr Horizon)</strong>
          </div>
          <div className="mt-4 text-[11px] text-emerald-100/70 font-medium flex items-center justify-between pt-3 border-t border-emerald-800/60">
            <span>Items Mapped: <strong className="text-white font-bold">{currentBOM.length}</strong></span>
            <span>Approved: <strong className="text-emerald-400 font-bold">{currentBOM.filter(i => i.approved).length} / {currentBOM.length}</strong></span>
          </div>
        </div>

        {/* Scope 1 Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scope 1: Direct Fuels</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">Scope 1</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-3">
            {scope1Total.toFixed(3)} <span className="text-xs font-bold text-slate-500">tCO₂e</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Stationary & Mobile Direct Fuel Combustion
          </div>
        </div>

        {/* Scope 2 Dual Reporting Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scope 2 Dual Reporting</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">Scope 2</span>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono mt-2">
            {scope2LocationTotal.toFixed(3)} <span className="text-xs font-bold text-slate-500">tCO₂e (Location)</span>
          </div>
          <div className="text-xs font-bold text-emerald-700 font-mono mt-2 pt-2 border-t border-slate-100">
            {scope2MarketTotal.toFixed(3)} tCO₂e (Market-Based PPA)
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            GHG Protocol Scope 2 Dual-Reporting Compliant
          </div>
        </div>

        {/* Scope 3 Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scope 3: Value Chain</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">Scope 3</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-3">
            {scope3Total.toFixed(3)} <span className="text-xs font-bold text-slate-500">tCO₂e</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Categorized across GHG Protocol Scope 3 (Cats 1-15)
          </div>
        </div>

      </div>

      {/* Preset Quick Add Toolbar */}
      <div className="bg-white text-slate-900 rounded-2xl p-4 border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">Quick Add India GHG Factor (Preset Dropdown):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">
          <select 
            value={quickPreset} 
            onChange={(e) => setQuickPreset(e.target.value)}
            className="flex-1 text-xs font-semibold p-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
          >
            <option value="">-- Choose from 60 Verified India GHG Factor Presets --</option>
            {INDIA_GHG_FACTORS.map(f => (
              <option key={f.key} value={f.key}>
                {f.name} ({f.ef} kgCO₂e/{f.unit}) — [{f.scope}]
              </option>
            ))}
          </select>

          <input 
            type="number"
            value={quickQty}
            onChange={(e) => setQuickQty(e.target.value)}
            placeholder="Qty"
            className="w-24 text-xs font-semibold p-2.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-mono"
          />

          <button 
            onClick={handleAddPreset}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Main Inventory Workbench Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xl">
        
        {/* Table Toolbar Header */}
        <div className="p-4 border-b border-slate-200/80 flex flex-wrap justify-between items-center gap-3 bg-slate-50/80">
          <div>
            <h2 className="font-black text-sm text-slate-900">BOM & Activity Data Inventory Table</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit quantities, verify factor categories, and approve rows for internal audit preparation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Risk Filter Buttons */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold border border-slate-300/60">
              <button 
                onClick={() => setRiskFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${riskFilter === 'ALL' ? 'bg-emerald-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All ({currentBOM.length})
              </button>
              <button 
                onClick={() => setRiskFilter('LOW')}
                className={`px-3 py-1 rounded-lg transition-all ${riskFilter === 'LOW' ? 'bg-emerald-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Low Risk
              </button>
              <button 
                onClick={() => setRiskFilter('HIGH')}
                className={`px-3 py-1 rounded-lg transition-all ${riskFilter === 'HIGH' ? 'bg-rose-600 text-white font-black shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                High Risk
              </button>
            </div>

            <button 
              onClick={handleApproveAllLowRisk}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              Approve All Low Risk
            </button>

            <button 
              onClick={handleClearTable}
              className="border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Table
            </button>

            <button 
              onClick={handleLoadSampleDemo}
              className="border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Sample Demo
            </button>

            <button 
              onClick={onOpenImportModal}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              Import BOM / Excel
            </button>

            <button 
              onClick={onOpenGoogleSheetsModal}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Sync Google Sheet
            </button>

            <button 
              onClick={handleExportCSV}
              className="border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CBAM CSV
            </button>

          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Approved</th>
                <th className="p-3.5">Item Description</th>
                <th className="p-3.5 text-right">Quantity</th>
                <th className="p-3.5">Unit</th>
                <th className="p-3.5">LCI Matched Process</th>
                <th className="p-3.5 text-right">EF (kgCO₂e/unit)</th>
                <th className="p-3.5 text-right">Footprint (tCO₂e)</th>
                <th className="p-3.5">Scope Boundary</th>
                <th className="p-3.5">GHG Protocol Scope 3 Category</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="font-bold text-sm text-slate-700">No inventory items in table</div>
                      <p className="text-xs">Click <strong>"Import BOM / Excel"</strong> or choose a factor from the <strong>Quick Add Dropdown</strong> above to get started.</p>
                      <button 
                        onClick={handleLoadSampleDemo}
                        className="mt-2 text-xs font-bold text-emerald-600 underline hover:text-emerald-700"
                      >
                        Load Sample Demo Inventory
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const tco2e = (item.result_tco2e !== undefined && item.result_tco2e !== null) ? item.result_tco2e.toFixed(3) : ((item.qty * item.ef) / 1000).toFixed(3);
                  const isApproved = item.approved;
                  const scopeBadge = item.scope === 'Scope 1' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                    item.scope === 'Scope 2' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                    'bg-amber-100 text-amber-800 border-amber-200';

                  return (
                    <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${isApproved ? 'bg-emerald-50/20' : ''}`}>
                      <td className="p-3">
                        <button 
                          onClick={() => toggleApprove(item.id)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                            isApproved 
                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                              : 'border-slate-300 text-transparent hover:border-emerald-500'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        <div>{item.name}</div>
                        {item.sourceUrl && (
                          <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 underline font-normal flex items-center gap-0.5 mt-0.5">
                            <span>Source citation</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          className="w-24 text-right p-1 font-mono font-bold border border-slate-300 rounded outline-none focus:border-emerald-500 bg-white"
                        />
                      </td>
                      <td className="p-3 font-semibold text-slate-600">{item.unit}</td>
                      <td className="p-3 text-slate-600 max-w-[200px] truncate" title={item.process}>
                        {item.process}
                        {item.dataQuality && <div className="text-[10px] text-indigo-600 mt-1">DQR: {item.dataQuality}</div>}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{item.ef}</td>
                      <td className="p-3 text-right font-mono font-black text-emerald-700">{tco2e} t</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${scopeBadge}`}>
                          {item.scope || 'Scope 3'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                          {item.scope3Category || (item.scope === 'Scope 3' ? 'Cat 1: Purchased Goods' : 'N/A')}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleDeleteRow(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
