import React, { useState } from 'react';
import { 
  Plus, Upload, Trash2, CheckCircle2, AlertTriangle, Download, 
  RefreshCw, FileSpreadsheet, Sparkles, Filter, Check 
} from 'lucide-react';
import { INDIA_GHG_FACTORS } from '../data/indiaGhgFactors.js';

export default function WorkbenchView({ 
  currentBOM, 
  setCurrentBOM, 
  onOpenImportModal, 
  onOpenGoogleSheetsModal, 
  onOpenBig4Modal,
  showToast 
}) {
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [quickPreset, setQuickPreset] = useState('');
  const [quickQty, setQuickQty] = useState(100);

  // Calculations
  const scope1Total = currentBOM.filter(i => i.scope === 'Scope 1').reduce((acc, i) => acc + (i.qty * i.ef / 1000), 0);
  const scope2Total = currentBOM.filter(i => i.scope === 'Scope 2').reduce((acc, i) => acc + (i.qty * i.ef / 1000), 0);
  const scope3Total = currentBOM.filter(i => (i.scope || 'Scope 3') === 'Scope 3').reduce((acc, i) => acc + (i.qty * i.ef / 1000), 0);
  const grandTotal = scope1Total + scope2Total + scope3Total;

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
      { id: Date.now() + 1, name: "Aluminum Sheet, 5052-H32", qty: 1450, unit: "kg", process: "Aluminum Sheet Primary Ingot", ef: 14.2, scope: "Scope 3", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "Auto-Matched", approved: true },
      { id: Date.now() + 2, name: "Custom Polyurethane Foam Insert", qty: 320, unit: "pcs", process: "Polyurethane Flexible Foam Fabrication", ef: 4.8, scope: "Scope 3", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "Auto-Matched", approved: true },
      { id: Date.now() + 3, name: "Copper Wire 12 AWG", qty: 50, unit: "kg", process: "Copper Wire Drawing", ef: 6.5, scope: "Scope 3", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "Auto-Matched", approved: true },
      { id: Date.now() + 4, name: "Grid Electricity (CEA India 2024)", qty: 12000, unit: "kWh", process: "Grid Electricity CEA India Grid Mix", ef: 0.716, scope: "Scope 2", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "CEA Verified", approved: true },
      { id: Date.now() + 5, name: "Diesel Fuel (DG Set Power Generation)", qty: 500, unit: "Liters", process: "Diesel Fuel Thermal Combustion", ef: 2.6558, scope: "Scope 1", ter: 1, ger: 1, tir: 1, risk: "LOW", status: "India GHG Factor", approved: true }
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
    let csv = "Item Description,Quantity,Unit,Matched LCI Process,Emission Factor (kgCO2e/unit),Footprint (tCO2e),Scope Category,Audit Risk,Status\n";
    currentBOM.forEach(item => {
      let tco2e = ((item.qty * item.ef) / 1000).toFixed(4);
      csv += `"${item.name.replace(/"/g, '""')}",${item.qty},"${item.unit}","${item.process.replace(/"/g, '""')}",${item.ef},${tco2e},"${item.scope}","${item.risk}","${item.status}"\n`;
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
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Carbon Footprint</div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {grandTotal.toFixed(3)} <span className="text-sm font-bold text-slate-300">tCO₂e</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-medium flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Items Mapped: <strong className="text-white">{currentBOM.length}</strong></span>
            <span>Approved: <strong className="text-emerald-400">{currentBOM.filter(i => i.approved).length} / {currentBOM.length}</strong></span>
          </div>
        </div>

        {/* Scope 1 Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scope 1: Direct Fuels</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">Scope 1</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {scope1Total.toFixed(3)} <span className="text-xs font-bold text-slate-500">tCO₂e</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            DG Sets, Boilers, Fleet CNG & Petrol
          </div>
        </div>

        {/* Scope 2 Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scope 2: Electricity</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">Scope 2</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {scope2Total.toFixed(3)} <span className="text-xs font-bold text-slate-500">tCO₂e</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            CEA Grid Mix (0.716 kgCO₂e/kWh)
          </div>
        </div>

        {/* Scope 3 Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scope 3: Supply Chain</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">Scope 3</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {scope3Total.toFixed(3)} <span className="text-xs font-bold text-slate-500">tCO₂e</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Raw Materials, Freight, Logistics
          </div>
        </div>

      </div>

      {/* Preset Quick Add Toolbar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Quick Add India GHG Factor (Preset Dropdown):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[300px]">
          <select 
            value={quickPreset} 
            onChange={(e) => setQuickPreset(e.target.value)}
            className="flex-1 text-xs font-semibold p-2 bg-slate-800 text-slate-100 border border-slate-700 rounded-lg outline-none focus:border-emerald-500"
          >
            <option value="">-- Choose from 60 Verified India GHG Factor Presets --</option>
            {INDIA_GHG_FACTORS.map(f => (
              <option key={f.key} value={f.key}>
                {f.name} — {f.ef} kgCO₂e/{f.unit} [{f.scope}]
              </option>
            ))}
          </select>

          <input 
            type="number" 
            value={quickQty} 
            onChange={(e) => setQuickQty(e.target.value)}
            placeholder="Qty" 
            className="w-24 text-xs font-semibold p-2 bg-slate-800 text-slate-100 border border-slate-700 rounded-lg outline-none focus:border-emerald-500"
          />

          <button 
            onClick={handleAddPreset}
            disabled={!quickPreset}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Main Inventory Workbench Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Table Toolbar Header */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 bg-slate-50">
          <div>
            <h2 className="font-extrabold text-sm text-slate-900">BOM & Activity Data Inventory Table</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit quantities, verify factors, and approve rows for ISAE 3410 assurance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Risk Filter Buttons */}
            <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-xs font-bold">
              <button 
                onClick={() => setRiskFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${riskFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All ({currentBOM.length})
              </button>
              <button 
                onClick={() => setRiskFilter('LOW')}
                className={`px-2.5 py-1 rounded-md transition-colors ${riskFilter === 'LOW' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Low Risk
              </button>
              <button 
                onClick={() => setRiskFilter('HIGH')}
                className={`px-2.5 py-1 rounded-md transition-colors ${riskFilter === 'HIGH' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                High Risk
              </button>
            </div>

            <button 
              onClick={handleApproveAllLowRisk}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve All Low Risk
            </button>

            <button 
              onClick={handleClearTable}
              className="border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Table
            </button>

            <button 
              onClick={handleLoadSampleDemo}
              className="border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Sample Demo
            </button>

            <button 
              onClick={onOpenImportModal}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Import BOM / Excel
            </button>

            <button 
              onClick={onOpenGoogleSheetsModal}
              className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Sync Google Sheet
            </button>

            <button 
              onClick={handleExportCSV}
              className="border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Export CBAM CSV
            </button>

          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Approved</th>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3">Unit</th>
                <th className="p-3">LCI Matched Process</th>
                <th className="p-3 text-right">EF (kgCO₂e/unit)</th>
                <th className="p-3 text-right">Footprint (tCO₂e)</th>
                <th className="p-3">Scope</th>
                <th className="p-3">DQR Quality</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
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
                  const tco2e = ((item.qty * item.ef) / 1000).toFixed(3);
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
                      <td className="p-3 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3 text-right">
                        <input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          className="w-24 text-right p-1 font-mono font-bold border border-slate-300 rounded outline-none focus:border-emerald-500 bg-white"
                        />
                      </td>
                      <td className="p-3 font-semibold text-slate-600">{item.unit}</td>
                      <td className="p-3 text-slate-600 max-w-[220px] truncate" title={item.process}>
                        {item.process}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{item.ef}</td>
                      <td className="p-3 text-right font-mono font-black text-emerald-700">{tco2e} t</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${scopeBadge}`}>
                          {item.scope || 'Scope 3'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-[10px] font-mono font-bold text-slate-600">
                          TeR:{item.ter || 1}/5 • GeR:{item.ger || 1}/5
                        </div>
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
