import React, { useState } from 'react';
import { Sliders, TrendingDown, DollarSign, Download, CheckCircle, ShieldAlert } from 'lucide-react';

export default function SimulatorView({ currentBOM, showToast, onApplyScenario }) {
  const [recycledPct, setRecycledPct] = useState(25);
  const [renewablePct, setRenewablePct] = useState(50);
  const [efficiencyPct, setEfficiencyPct] = useState(15);
  const [fuelSwitchPct, setFuelSwitchPct] = useState(30);

  // Baseline Calculation
  const baselineTotal = currentBOM.reduce((acc, i) => acc + (i.qty * i.ef / 1000), 0);

  // Sim Matrix Calculation
  const simMatrix = currentBOM.map(item => {
    let factor = item.ef;
    const nameLower = item.name.toLowerCase();

    // 1. Recycled material lever
    if (recycledPct > 0 && (nameLower.includes('aluminum') || nameLower.includes('steel') || nameLower.includes('copper') || nameLower.includes('plastic'))) {
      factor = factor * (1 - (recycledPct / 100) * 0.75);
    }
    // 2. Renewable PPA lever
    if (renewablePct > 0 && item.scope === 'Scope 2') {
      factor = factor * (1 - (renewablePct / 100));
    }
    // 3. Efficiency lever
    if (efficiencyPct > 0 && (item.scope === 'Scope 1' || item.scope === 'Scope 2')) {
      factor = factor * (1 - (efficiencyPct / 100));
    }
    // 4. Fuel switch lever
    if (fuelSwitchPct > 0 && item.scope === 'Scope 1') {
      factor = factor * (1 - (fuelSwitchPct / 100) * 0.60);
    }

    const baselineTco2e = (item.qty * item.ef) / 1000;
    const simTco2e = (item.qty * factor) / 1000;
    const avoidedTco2e = Math.max(0, baselineTco2e - simTco2e);

    return {
      ...item,
      simEf: factor,
      baselineTco2e,
      simTco2e,
      avoidedTco2e
    };
  });

  const netFootprint = simMatrix.reduce((acc, i) => acc + i.simTco2e, 0);
  const avoidedTotal = Math.max(0, baselineTotal - netFootprint);

  // Financial Metrics
  const carbonCreditPriceInr = 1500; // ₹1,500 per tCO2e
  const cbamTariffEur = 85; // €85 per tCO2e
  const inrEurRate = 90;

  const carbonCreditValueInr = avoidedTotal * carbonCreditPriceInr;
  const cbamSavingsEur = avoidedTotal * cbamTariffEur;
  const cbamSavingsInr = cbamSavingsEur * inrEurRate;

  const handleExportRoadmap = () => {
    const roadmap = {
      timestamp: new Date().toISOString(),
      baselineFootprintTco2e: baselineTotal.toFixed(3),
      netFootprintTco2e: netFootprint.toFixed(3),
      avoidedEmissionsTco2e: avoidedTotal.toFixed(3),
      levers: {
        recycledMaterialScrapPct: recycledPct,
        renewableEnergyPpaPct: renewablePct,
        energyEfficiencyPct: efficiencyPct,
        fuelSwitchingPct: fuelSwitchPct
      },
      financialValuation: {
        carbonCreditYieldInr: carbonCreditValueInr.toFixed(2),
        cbamTariffSavingsEur: cbamSavingsEur.toFixed(2),
        cbamTariffSavingsInr: cbamSavingsInr.toFixed(2)
      },
      itemizedMatrix: simMatrix.map(i => ({
        itemName: i.name,
        qty: i.qty,
        unit: i.unit,
        baselineEf: i.ef,
        simulatedEf: i.simEf.toFixed(4),
        avoidedTco2e: i.avoidedTco2e.toFixed(3)
      }))
    };

    const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NetZeroCalc_WhatIf_Decarbonization_Roadmap_${Date.now()}.json`;
    link.click();
    showToast("Downloaded Decarbonization Roadmap JSON.");
  };

  const handleApplyScenario = () => {
    onApplyScenario({
      recycledPct, renewablePct, efficiencyPct, fuelSwitchPct,
      baselineTotal, netFootprint, avoidedTotal
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>ISO 14064-2 Scenario Simulator</span>
          </div>
          <h2 className="text-xl font-black text-white">Interactive Decarbonization What-If Simulator</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulate Scope 1-3 decarbonization levers in real time. Calculate avoided carbon emissions ($tCO_2e$), estimated carbon credit yield ($₹$), and EU CBAM tariff savings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleApplyScenario}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Apply as ISO 14064-2 Project Scenario
          </button>
          <button 
            onClick={handleExportRoadmap}
            className="border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export Roadmap JSON
          </button>
        </div>
      </div>

      {/* 4 Interactive Decarbonization Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Lever 1: Recycled Scrap */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Recycled Material Scrap</span>
            <span className="text-sm font-black text-emerald-600 font-mono">{recycledPct}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={recycledPct} 
            onChange={(e) => setRecycledPct(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">Substitute primary metals/plastics with secondary recycled scrap (Scope 3 reduction).</p>
        </div>

        {/* Lever 2: Renewable Energy PPA */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Renewable Energy PPA</span>
            <span className="text-sm font-black text-emerald-600 font-mono">{renewablePct}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={renewablePct} 
            onChange={(e) => setRenewablePct(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">Procure solar/wind PPA zero-carbon power (Scope 2 reduction).</p>
        </div>

        {/* Lever 3: Energy Efficiency */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Energy Efficiency</span>
            <span className="text-sm font-black text-emerald-600 font-mono">{efficiencyPct}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={efficiencyPct} 
            onChange={(e) => setEfficiencyPct(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">VFDs, heat recovery, and LED retrofits (Scope 1 & 2 reduction).</p>
        </div>

        {/* Lever 4: Fuel Switching */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Fuel Switching</span>
            <span className="text-sm font-black text-emerald-600 font-mono">{fuelSwitchPct}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={fuelSwitchPct} 
            onChange={(e) => setFuelSwitchPct(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">Switch boilers/generators to CNG or biomass pellets (Scope 1 reduction).</p>
        </div>

      </div>

      {/* Real-time Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Baseline Card */}
        <div className="bg-slate-100 rounded-2xl p-5 border border-slate-300">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Baseline Footprint</div>
          <div className="text-2xl font-extrabold text-slate-800 font-mono">{baselineTotal.toFixed(3)} <span className="text-xs font-bold">tCO₂e</span></div>
          <div className="text-[11px] text-slate-500 mt-2">Unmitigated Current State</div>
        </div>

        {/* Avoided Emissions Card */}
        <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-800 shadow-md">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" /> Avoided Emissions
          </div>
          <div className="text-3xl font-black text-emerald-300 font-mono">{avoidedTotal.toFixed(3)} <span className="text-xs font-bold text-white">tCO₂e</span></div>
          <div className="text-[11px] text-emerald-400/80 mt-2">Calculated Carbon Savings</div>
        </div>

        {/* Carbon Credit Value Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Carbon Credit Yield (₹)
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">₹{carbonCreditValueInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="text-[11px] text-slate-500 mt-2">Valued @ ₹1,500 / tCO₂e</div>
        </div>

        {/* CBAM Tariff Savings Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">EU CBAM Tariff Savings</div>
          <div className="text-2xl font-black text-blue-900 font-mono">€{cbamSavingsEur.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div className="text-[11px] text-slate-500 mt-2">≈ ₹{cbamSavingsInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (@ €85/t)</div>
        </div>

      </div>

      {/* Itemized Substitution Matrix Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-extrabold text-sm text-slate-900">Line-Item Specific Substitution & Decarbonization Matrix</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3">Unit</th>
                <th className="p-3 text-right">Baseline EF</th>
                <th className="p-3 text-right">Simulated EF</th>
                <th className="p-3 text-right">Baseline (tCO₂e)</th>
                <th className="p-3 text-right">Simulated (tCO₂e)</th>
                <th className="p-3 text-right">Avoided (tCO₂e)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {simMatrix.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold">{item.name}</td>
                  <td className="p-3 text-right font-mono font-semibold">{item.qty}</td>
                  <td className="p-3 text-slate-600">{item.unit}</td>
                  <td className="p-3 text-right font-mono">{item.ef}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">{item.simEf.toFixed(4)}</td>
                  <td className="p-3 text-right font-mono">{item.baselineTco2e.toFixed(3)}</td>
                  <td className="p-3 text-right font-mono font-bold">{item.simTco2e.toFixed(3)}</td>
                  <td className="p-3 text-right font-mono font-black text-emerald-600">
                    +{item.avoidedTco2e.toFixed(3)} t
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
