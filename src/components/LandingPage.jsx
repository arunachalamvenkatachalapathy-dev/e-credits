import React from 'react';
import { ArrowRight, ShieldCheck, Database, CheckCircle, Activity, Server, FileText } from 'lucide-react';

export default function LandingPage({ onLaunchDemo }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="absolute top-0 w-full px-6 py-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Activity className="text-slate-950 w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">ScopeMetric</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#methodology" className="hover:text-white transition-colors">Methodology</a>
          <a href="#audit" className="hover:text-white transition-colors">Audit & Verification</a>
        </div>
        <button 
          onClick={onLaunchDemo}
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center min-h-[90vh] overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur border border-slate-800 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-4 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ISO 14064-1 Certified Engine
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 leading-tight drop-shadow-2xl">
            The Audit-Ready <br/> GHG Inventory Platform.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ScopeMetric provides enterprise-grade carbon accounting. Bypass generic ERP modules with a purpose-built engine compliant with the GHG Protocol Corporate Standard.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={onLaunchDemo}
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg transition-all hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)] hover:-translate-y-1"
            >
              Enter Demo Workspace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#methodology" className="px-8 py-4 text-slate-300 hover:text-white font-semibold transition-colors">
              Review Methodology
            </a>
          </div>
        </div>
      </section>

      {/* Trust Markers / Auditability */}
      <section id="audit" className="py-24 px-6 bg-slate-900/50 border-y border-slate-800/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Engineered for Verification</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Built from the ground up to satisfy third-party auditors and regulatory scrutiny. Every calculation is traceable, immutable, and backed by verifiable data sources.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors group shadow-lg">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <h3 className="text-xl font-bold mb-3">Immutable Audit Trail</h3>
              <p className="text-slate-400 leading-relaxed">Cryptographically secure logs for every data entry, modification, and emission factor change. Ensure 100% data integrity for external verifiers.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors group shadow-lg">
              <Database className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <h3 className="text-xl font-bold mb-3">Transparent Factors</h3>
              <p className="text-slate-400 leading-relaxed">Direct integration with DEFRA, EPA, and CEA databases. We never obfuscate the math; every GWP value and factor is exposed.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors group shadow-lg">
              <FileText className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <h3 className="text-xl font-bold mb-3">ISO 14064 Reporting</h3>
              <p className="text-slate-400 leading-relaxed">Automatically generate compliance-ready reports structured exactly how Lead Assessors expect to see them, reducing audit time by 40%.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Rigorous Methodology</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              We align strictly with the globally recognized standards. Our computation engine processes Scope 1, 2, and 3 emissions through location-based and market-based accounting mechanisms.
            </p>
            
            <ul className="space-y-4">
              {[
                "GHG Protocol Corporate Accounting and Reporting Standard",
                "ISO 14064-1:2018 (Organization level)",
                "ISO 14064-2:2019 (Project level / Decarbonization)",
                "IPCC AR4 / AR5 / AR6 Global Warming Potentials"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4 mt-2">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-300">Engine Status</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded">v2.0.4-stable</span>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Methodology</span>
                  <span className="text-emerald-300 bg-emerald-400/10 px-2 py-1 rounded">GHG Protocol</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Scope 2 Calc</span>
                  <span className="text-slate-300">Dual-Reporting Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Factor DB</span>
                  <span className="text-slate-300">DEFRA 2024 / CEA v19</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Data Quality</span>
                  <span className="text-slate-300">Tier 1 & Tier 2 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} ScopeMetric. A technical prototype demonstration.</p>
      </footer>
    </div>
  );
}
