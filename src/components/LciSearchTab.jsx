import React, { useState } from 'react';
import { Search, Globe, Filter, Plus, Database, Sparkles, CheckCircle } from 'lucide-react';
import { GLOBAL_LCI_DATABASE } from '../data/globalLciDatabase.js';

export default function LciSearchTab({ onAddFactorToBOM, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [injectedIds, setInjectedIds] = useState([]);

  const categories = [
    'ALL',
    'Energy & Grids',
    'Fuels & Thermal',
    'Metals & Mining',
    'Chemicals & Synthetics',
    'Transport & Freight',
    'Packaging & Waste'
  ];

  const regions = ['ALL', 'IN', 'US', 'UK / EU', 'GLO'];

  // Filter Factors
  const filteredFactors = GLOBAL_LCI_DATABASE.filter(f => {
    const matchesSearch = searchTerm.trim() === '' || 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      f.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesRegion = selectedRegion === 'ALL' || f.region === selectedRegion;

    return matchesSearch && matchesCategory && matchesRegion;
  });

  const handleInject = (factor) => {
    const newItem = {
      id: Date.now(),
      name: factor.name,
      qty: 100,
      unit: factor.unit,
      process: `${factor.source}: ${factor.name}`,
      ef: factor.ef,
      sim: 1.0,
      ter: 1, ger: 1, tir: 1,
      risk: 'LOW',
      scope: factor.scope,
      status: 'LCI Search Verified',
      approved: true,
      notes: factor.notes
    };

    onAddFactorToBOM(newItem);
    setInjectedIds([...injectedIds, factor.id]);
    showToast(`Injected ${factor.name} into active inventory!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>LCI Factor Search Engine</span>
          </div>
          <h2 className="text-xl font-black text-white">Search Emission Factors & LCI Databases</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Live factor lookup across DEFRA 2024, India CEA v19, US EPA eGRID 2024, Ecoinvent 3.9, IPCC Tier 1, and World Aluminium datasets.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search material, fuel, grid, transport (e.g., 'Aluminum', 'Diesel', 'CEA Grid', 'HGV Freight')..."
            className="w-full pl-11 pr-4 py-3 bg-slate-800 text-white font-semibold text-xs border border-slate-700 rounded-xl outline-none focus:border-emerald-500 shadow-inner"
          />
        </div>

        {/* Filters Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 font-bold">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Region Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Region:</span>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-800 text-slate-200 font-bold border border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500"
            >
              {regions.map(r => (
                <option key={r} value={r}>{r === 'ALL' ? 'All Regions' : r}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Results Count Banner */}
      <div className="flex justify-between items-center text-xs font-bold text-slate-600 px-1">
        <span>Found {filteredFactors.length} matching emission factors</span>
        <span className="text-emerald-700 font-semibold">1-Click "Inject to BOM" updates active inventory instantly</span>
      </div>

      {/* Factors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFactors.map(factor => {
          const isInjected = injectedIds.includes(factor.id);
          const scopeBadge = factor.scope === 'Scope 1' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            factor.scope === 'Scope 2' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            'bg-amber-100 text-amber-800 border-amber-200';

          return (
            <div key={factor.id} className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
              
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${scopeBadge}`}>
                    {factor.scope}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {factor.region}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{factor.name}</h3>
                
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500 font-bold">Emission Factor:</span>
                    <span className="text-base font-black text-emerald-700 font-mono">
                      {factor.ef} <span className="text-xs font-bold text-slate-600">kgCO₂e/{factor.unit}</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Source:</span>
                    <strong className="text-slate-800">{factor.source}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {factor.notes}
                </p>
              </div>

              {/* Inject Button */}
              <button 
                onClick={() => handleInject(factor)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                  isInjected 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isInjected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Injected to Inventory</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Inject into Active BOM Inventory</span>
                  </>
                )}
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
