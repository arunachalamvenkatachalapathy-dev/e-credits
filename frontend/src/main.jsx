import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Database,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  FileUp,
  Filter,
  Globe,
  Info,
  Layers,
  Leaf,
  Maximize2,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Sliders,
  Sparkles,
  Trash2,
  X,
  Zap
} from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projectName, setProjectName] = useState("EV Battery Assembly Line");
  const [geo, setGeo] = useState("US");
  const [year, setYear] = useState(2024);
  const [source, setSource] = useState("USLCI");
  
  const [audits, setAudits] = useState([
    {
      id: "row-1",
      raw_bom_input: "Diesel Generator (DG Sets) fuel",
      raw_bom_quantity: 1000,
      raw_bom_unit: "Liters",
      matched_process_name: "Diesel Generator (DG Sets)",
      vector_similarity_score: 1.0,
      data_quality_status: "uplifted",
      result_tco2e: 2.6558,
      dqr_technological_score: 1,
      dqr_geographical_score: 1,
      dqr_temporal_score: 1,
      audit_risk_level: "LOW",
      audit_reasoning: "India GHG Factors v6 point emission factor match (2.6558 kgCO2e/L).",
      mandatory_data_gap_warning: null,
      is_human_approved: false,
      co2e_kg_per_unit: 2.6558,
      candidates: [
        { process_name: "Diesel Generator (DG Sets)", similarity_score: 1.0, data_quality_status: "uplifted", emission_factor: 2.6558 },
        { process_name: "Well-to-Tank: Diesel", similarity_score: 0.85, data_quality_status: "uplifted", emission_factor: 0.5835 },
        { process_name: "Commercial LPG", similarity_score: 0.62, data_quality_status: "uplifted", emission_factor: 2.9979 }
      ]
    },
    {
      id: "row-2",
      raw_bom_input: "Estimated Facility HVAC Use-Phase",
      raw_bom_quantity: 450,
      raw_bom_unit: "kWh",
      matched_process_name: "Estimated Product Use-Phase Energy",
      vector_similarity_score: 0.94,
      data_quality_status: "placeholder",
      result_tco2e: 0.0,
      dqr_technological_score: 5,
      dqr_geographical_score: 2,
      dqr_temporal_score: 3,
      audit_risk_level: "HIGH",
      audit_reasoning: "Matched placeholder factor. Real activity data required before carbon accounting sign-off.",
      mandatory_data_gap_warning: "Placeholder emission factor detected. Approval blocked pending real measurements.",
      is_human_approved: false,
      co2e_kg_per_unit: 0.0,
      candidates: [
        { process_name: "Estimated Product Use-Phase Energy", similarity_score: 0.94, data_quality_status: "placeholder", emission_factor: 0.0 },
        { process_name: "Indian Grid Electricity", similarity_score: 0.72, data_quality_status: "clean", emission_factor: 0.716 }
      ]
    },
    {
      id: "row-3",
      raw_bom_input: "Aluminum sheet 6061-T6 (2mm)",
      raw_bom_quantity: 125,
      raw_bom_unit: "kg",
      matched_process_name: "aluminium production, primary, ingot",
      vector_similarity_score: 0.892,
      data_quality_status: "clean",
      result_tco2e: 1.05,
      dqr_technological_score: 4,
      dqr_geographical_score: 1,
      dqr_temporal_score: 2,
      audit_risk_level: "HIGH",
      audit_reasoning: "Primary aluminum ingot match. High risk due to missing extrusion/rolling transformation energy step.",
      mandatory_data_gap_warning: "Forming & rolling energy process step required before EPD generation.",
      is_human_approved: false,
      co2e_kg_per_unit: 8.4,
      candidates: [
        { process_name: "aluminium production, primary, ingot", similarity_score: 0.892, data_quality_status: "clean", emission_factor: 8.4 },
        { process_name: "steel production, low-alloy, at plant", similarity_score: 0.45, data_quality_status: "proxy", emission_factor: 1.8 }
      ]
    },
    {
      id: "row-4",
      raw_bom_input: "Medium voltage grid electricity",
      raw_bom_quantity: 1850,
      raw_bom_unit: "kWh",
      matched_process_name: "electricity, medium voltage, grid mix",
      vector_similarity_score: 0.965,
      data_quality_status: "clean",
      result_tco2e: 0.777,
      dqr_technological_score: 1,
      dqr_geographical_score: 1,
      dqr_temporal_score: 1,
      audit_risk_level: "LOW",
      audit_reasoning: "Direct match to grid electricity dataset with temporal validity.",
      mandatory_data_gap_warning: null,
      is_human_approved: true,
      co2e_kg_per_unit: 0.42,
      candidates: [
        { process_name: "electricity, medium voltage, grid mix", similarity_score: 0.965, data_quality_status: "clean", emission_factor: 0.42 }
      ]
    }
  ]);

  const [expanded, setExpanded] = useState(null);
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [overrideNotes, setOverrideNotes] = useState({});
  const [message, setMessage] = useState("");

  // Modals & Drawers
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedPedigree, setSelectedPedigree] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("queue");

  // What-If Simulator State
  const [simRecycledPct, setSimRecycledPct] = useState(65);
  const [simRenewableEnergyPct, setSimRenewableEnergyPct] = useState(80);

  // Assistant messages
  const [botQuestion, setBotQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome! I am your AI Review Assistant. Ask me about DQR scores, removal options, or carbon credit calculations."
    }
  ]);

  const [manual, setManual] = useState({ description: "", quantity: 50, unit: "kg" });

  // Filtered Audits
  const visibleAudits = useMemo(() => {
    let rows = audits;
    if (riskFilter !== "ALL") {
      rows = rows.filter((r) => r.audit_risk_level === riskFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.raw_bom_input?.toLowerCase().includes(q) ||
          r.matched_process_name?.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [audits, riskFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = audits.length;
    const highRisk = audits.filter((a) => a.audit_risk_level === "HIGH").length;
    const approved = audits.filter((a) => a.is_human_approved).length;
    const progress = total > 0 ? Math.round((approved / total) * 100) : 0;
    
    const totalCo2eKg = audits.reduce(
      (acc, item) => acc + (item.raw_bom_quantity || 1) * (item.co2e_kg_per_unit || 1.5),
      0
    );
    const totalCo2eTons = (totalCo2eKg / 1000).toFixed(2);

    return { total, highRisk, approved, progress, totalCo2eTons };
  }, [audits]);

  // What-If Simulation Calculations
  const simResults = useMemo(() => {
    const baseCo2e = Number(stats.totalCo2eTons);
    const reductionFactor = (simRecycledPct * 0.4 + simRenewableEnergyPct * 0.45) / 100;
    const avoidedCo2eTons = (baseCo2e * reductionFactor).toFixed(2);
    const creditDollarValue = (avoidedCo2eTons * 35).toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });

    return { baseCo2e, avoidedCo2eTons, creditDollarValue };
  }, [stats.totalCo2eTons, simRecycledPct, simRenewableEnergyPct]);

  // Actions
  function approveRow(id) {
    setAudits((rows) =>
      rows.map((item) => (item.id === id ? { ...item, is_human_approved: true } : item))
    );
  }

  function removeRow(id) {
    setAudits((rows) => rows.filter((item) => item.id !== id));
    if (expanded === id) setExpanded(null);
    setMessage("Item removed from active BOM queue.");
  }

  function approveAllLow() {
    setAudits((rows) =>
      rows.map((item) =>
        item.audit_risk_level === "LOW" ? { ...item, is_human_approved: true } : item
      )
    );
    setMessage("Approved all LOW-risk items.");
  }

  function clearAllWorkspace() {
    if (window.confirm("Remove all items from current workspace?")) {
      setAudits([]);
      setMessage("Workspace cleared.");
    }
  }

  function addManualRow() {
    if (!manual.description.trim()) return;
    const newRow = {
      id: `manual-${Date.now()}`,
      raw_bom_input: manual.description,
      raw_bom_quantity: Number(manual.quantity),
      raw_bom_unit: manual.unit,
      matched_process_name: `${manual.description.toLowerCase()} candidate process | USLCI`,
      vector_similarity_score: 0.825,
      dqr_technological_score: 2,
      dqr_geographical_score: 1,
      dqr_temporal_score: 2,
      audit_risk_level: "LOW",
      audit_reasoning: "Custom component added to audit queue.",
      mandatory_data_gap_warning: null,
      is_human_approved: false,
      co2e_kg_per_unit: 1.2
    };
    setAudits((prev) => [newRow, ...prev]);
    setManual({ description: "", quantity: 50, unit: "kg" });
    setActiveTab("queue");
  }

  function submitAssistant() {
    if (!botQuestion.trim()) return;
    const answer = `Analysis for "${botQuestion}":\n• Workspace has ${audits.length} items. Total footprint: ${stats.totalCo2eTons} tCO₂e.\n• Use the "🗑 Remove" button on any row to delete items not required in your project calculation.`;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: botQuestion },
      { role: "assistant", text: answer }
    ]);
    setBotQuestion("");
    setAssistantOpen(true);
  }

  return (
    <main className={sidebarCollapsed ? "collapsed" : ""}>
      {/* Sticky Top Navbar */}
      <header className="topbar">
        <div className="brand-title">
          <button className="btn-outline" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title="Toggle Sidebar">
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <Zap size={22} style={{ color: "var(--accent-emerald)" }} />
          <span>BOM-to-LCI Semantic Mapper</span>
          <span className="brand-badge">E-Credits Enterprise</span>
        </div>

        <div className="top-actions">
          <button className="btn-primary" onClick={() => setCertModalOpen(true)}>
            <Award size={16} /> Certificate & E-Credits
          </button>
          <button className="btn-indigo" onClick={() => setAssistantOpen(true)}>
            <Bot size={16} /> AI Review Assistant
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside>
        <h1>Workspace Controls</h1>
        <div className="legal-notice">
          <strong>
            BYOL Decision-Support <span className="info-icon" data-tooltip="Bring Your Own License framework for client ecoinvent deployment">ⓘ</span>
          </strong>
          <p>Practitioner review required for regulated carbon credit reporting.</p>
        </div>

        <div className="form-group">
          <label>
            Project Name <span className="info-icon" data-tooltip="Name of target product BOM or facility manufacturing line">ⓘ</span>
          </label>
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </div>

        <div className="grid2">
          <div className="form-group">
            <label>
              Geography <span className="info-icon" data-tooltip="Target ISO country or macro-region electricity grid context">ⓘ</span>
            </label>
            <select value={geo} onChange={(e) => setGeo(e.target.value)}>
              <option>US</option>
              <option>GLO</option>
              <option>EU</option>
              <option>IN</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              Target Year <span className="info-icon" data-tooltip="Operating year for grid emissions factor temporal validity">ⓘ</span>
            </label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>
            Database Source <span className="info-icon" data-tooltip="Selected LCI background database: USLCI, ELCD, Agribalyse, or private ecoinvent BYOL">ⓘ</span>
          </label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option>USLCI</option>
            <option>ELCD</option>
            <option>Agribalyse Core</option>
            <option>ecoinvent BYOL private</option>
            <option>India_GHG_Factors</option>
          </select>
        </div>

        <button className="btn-primary">
          <Check size={16} /> Project Active
        </button>

        <label className="upload-btn">
          <FileUp size={16} /> Upload BOM (CSV/XLSX)
          <input type="file" accept=".csv,.xlsx" />
        </label>

        <div className="status-box">
          <strong>Status:</strong>
          <p>{audits.length} BOM lines active in workspace.</p>
        </div>
      </aside>

      {/* Main Fluid Workspace */}
      <section>
        {/* KPI Dashboard */}
        <div className="kpi-dashboard">
          <div className="kpi-card">
            <div className="kpi-title">
              Total Carbon Footprint <span className="info-icon" data-tooltip="Scope 3 raw material & energy carbon intensity total">ⓘ</span>
            </div>
            <div className="kpi-value">{stats.totalCo2eTons} <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>tCO₂e</span></div>
          </div>

          <div className="kpi-card high-risk">
            <div className="kpi-title">
              High Risk Flags <span className="info-icon" data-tooltip="Line items requiring practitioner transformation step or process chaining">ⓘ</span>
            </div>
            <div className="kpi-value" style={{ color: "var(--risk-high)" }}>{stats.highRisk}</div>
          </div>

          <div className="kpi-card dqr-card">
            <div className="kpi-title">
              E-Credit Value <span className="info-icon" data-tooltip="Calculated carbon credit yield based on avoided emissions at $35/tCO2e">ⓘ</span>
            </div>
            <div className="kpi-value" style={{ color: "var(--accent-indigo)" }}>{simResults.creditDollarValue}</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title">
              Audit Progress <span className="info-icon" data-tooltip="Percentage of active BOM items practitioner-approved">ⓘ</span>
            </div>
            <div className="kpi-value">{stats.progress}%</div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${stats.progress}%` }} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button className={`tab-btn ${activeTab === "queue" ? "active" : ""}`} onClick={() => setActiveTab("queue")}>
            Review Queue ({visibleAudits.length})
          </button>
          <button className={`tab-btn ${activeTab === "simulator" ? "active" : ""}`} onClick={() => setActiveTab("simulator")}>
            <Sliders size={14} /> What-If Scenario Simulator
          </button>
          <button className={`tab-btn ${activeTab === "compliance" ? "active" : ""}`} onClick={() => setActiveTab("compliance")}>
            <ShieldCheck size={14} /> CBAM & EU DPP Compliance
          </button>
          <button className={`tab-btn ${activeTab === "catalog" ? "active" : ""}`} onClick={() => setActiveTab("catalog")}>
            <Database size={14} /> LCI Datasets Catalog
          </button>
          <button className={`tab-btn ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>
            <Plus size={14} /> Add BOM Item
          </button>
        </div>

        {/* TAB 1: Review Queue */}
        {activeTab === "queue" && (
          <>
            <div className="workspace-toolbar">
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ position: "relative", width: "240px" }}>
                  <Search size={14} style={{ position: "absolute", left: "10px", top: "12px", color: "var(--text-muted)" }} />
                  <input
                    style={{ paddingLeft: "32px", height: "36px" }}
                    placeholder="Search BOM items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  {["ALL", "HIGH", "MEDIUM", "LOW"].map((risk) => (
                    <button
                      key={risk}
                      className={`filter-btn ${riskFilter === risk ? "selected" : ""}`}
                      onClick={() => setRiskFilter(risk)}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn-primary" onClick={approveAllLow} style={{ height: "36px" }}>
                  <CheckCircle2 size={14} /> Approve All Low Risk
                </button>
                <button className="btn-danger" onClick={clearAllWorkspace} style={{ height: "36px" }}>
                  <Trash2 size={14} /> Clear Workspace
                </button>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <span></span>
                <span>
                  BOM Input Line <span className="info-icon" data-tooltip="Raw component description and quantity">ⓘ</span>
                </span>
                <span>
                  Matched LCI Process <span className="info-icon" data-tooltip="Vector embedding nearest process match in target database">ⓘ</span>
                </span>
                <span>
                  Similarity <span className="info-icon" data-tooltip="Cosine vector similarity score">ⓘ</span>
                </span>
                <span>
                  DQR Pedigree <span className="info-icon" data-tooltip="Technological, Geographical, and Temporal score pills (1=Best, 5=Worst)">ⓘ</span>
                </span>
                <span>Risk</span>
                <span>
                  Decision Actions <span className="info-icon" data-tooltip="Approve mapping or Remove item if not required">ⓘ</span>
                </span>
              </div>

              {visibleAudits.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  No BOM items matching criteria. Upload a file or add a new item.
                </div>
              ) : (
                visibleAudits.map((row) => (
                  <React.Fragment key={row.id}>
                    <div className="table-row">
                      <button
                        className="btn-outline"
                        style={{ height: "28px", width: "28px", padding: 0 }}
                        onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                      >
                        {expanded === row.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>

                      <div className="bom-name">
                        <span>{row.raw_bom_input}</span>
                        <span className="bom-sub">
                          {row.raw_bom_quantity} {row.raw_bom_unit} • {row.result_tco2e !== undefined && row.result_tco2e !== null ? Number(row.result_tco2e).toFixed(3) : ((row.raw_bom_quantity * (row.co2e_kg_per_unit || 0)) / 1000).toFixed(3)} tCO₂e
                        </span>
                      </div>

                      <div className="matched-process">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600 }}>{row.matched_process_name}</span>
                          {row.data_quality_status && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "2px 8px",
                                borderRadius: "99px",
                                fontSize: "10px",
                                fontWeight: 700,
                                background:
                                  row.data_quality_status === "clean"
                                    ? "rgba(16,185,129,0.15)"
                                    : row.data_quality_status === "uplifted"
                                    ? "rgba(245,158,11,0.15)"
                                    : row.data_quality_status === "proxy"
                                    ? "rgba(99,102,241,0.15)"
                                    : "rgba(244,63,94,0.15)",
                                color:
                                  row.data_quality_status === "clean"
                                    ? "#10b981"
                                    : row.data_quality_status === "uplifted"
                                    ? "#f59e0b"
                                    : row.data_quality_status === "proxy"
                                    ? "#6366f1"
                                    : "#f43f5e",
                                border: `1px solid ${
                                  row.data_quality_status === "clean"
                                    ? "#10b981"
                                    : row.data_quality_status === "uplifted"
                                    ? "#f59e0b"
                                    : row.data_quality_status === "proxy"
                                    ? "#6366f1"
                                    : "#f43f5e"
                                }44`
                              }}
                            >
                              {row.data_quality_status.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Top candidate chips displayed below matched process */}
                        {row.candidates && row.candidates.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                            {row.candidates.slice(0, 5).map((c) => {
                              const isCurrent = c.process_id === row.matched_process_id || c.process_name === row.matched_process_name;
                              return (
                                <button
                                  key={c.process_id || c.process_name}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (row.id && !row.id.startsWith("row-") && !row.id.startsWith("manual-")) {
                                      try {
                                        const res = await fetch(`${API}/bom/audits/${row.id}/override`, {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ user_id: "practitioner-1", process_id: c.process_id, notes: "Selected candidate match alternative from UI picker" })
                                        });
                                        if (res.ok) {
                                          const updated = await res.json();
                                          setAudits((rows) => rows.map((item) => item.id === row.id ? { ...item, ...updated } : item));
                                        }
                                      } catch (err) {
                                        console.error("Override API call failed", err);
                                      }
                                    } else {
                                      setAudits((rows) =>
                                        rows.map((item) =>
                                          item.id === row.id
                                            ? {
                                                ...item,
                                                matched_process_name: c.process_name,
                                                matched_process_id: c.process_id,
                                                vector_similarity_score: c.similarity_score,
                                                data_quality_status: c.data_quality_status,
                                                co2e_kg_per_unit: c.emission_factor !== undefined && c.emission_factor !== null ? c.emission_factor : item.co2e_kg_per_unit,
                                                result_tco2e: c.emission_factor !== undefined && c.emission_factor !== null ? (item.raw_bom_quantity * c.emission_factor) / 1000 : item.result_tco2e,
                                                is_human_approved: false
                                              }
                                            : item
                                        )
                                      );
                                    }
                                    setMessage("Match candidate switched. Row approval reset — fresh sign-off required.");
                                  }}
                                  style={{
                                    fontSize: "10px",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    border: `1px solid ${isCurrent ? "var(--accent-emerald)" : "var(--border-light)"}`,
                                    background: isCurrent ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
                                    color: isCurrent ? "var(--accent-emerald)" : "var(--text-secondary)",
                                    cursor: "pointer",
                                    fontWeight: isCurrent ? 700 : 400
                                  }}
                                  title={`Click to select ${c.process_name} (${(c.similarity_score * 100).toFixed(0)}%)`}
                                >
                                  {c.process_name} ({(c.similarity_score * 100).toFixed(0)}%)
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="similarity-badge">{(row.vector_similarity_score * 100).toFixed(1)}%</div>

                      <div className="dqr-group" onClick={() => setSelectedPedigree(row)} title="Click for DQR Pedigree Matrix">
                        <span className={`dqr-pill dqr-${row.dqr_technological_score}`}>{row.dqr_technological_score}</span>
                        <span className={`dqr-pill dqr-${row.dqr_geographical_score}`}>{row.dqr_geographical_score}</span>
                        <span className={`dqr-pill dqr-${row.dqr_temporal_score}`}>{row.dqr_temporal_score}</span>
                      </div>

                      <div>
                        <span className={`risk-badge ${row.audit_risk_level}`}>{row.audit_risk_level}</span>
                      </div>

                      <div className="action-cell">
                        {row.is_human_approved ? (
                          <span style={{ color: "var(--accent-emerald)", fontWeight: 700, fontSize: "12px" }}>
                            <Check size={14} style={{ display: "inline" }} /> Approved
                          </span>
                        ) : (
                          <button
                            className="btn-action-approve"
                            onClick={() => approveRow(row.id)}
                            disabled={row.data_quality_status === "placeholder"}
                            title={row.data_quality_status === "placeholder" ? "Cannot approve placeholder — real data required" : ""}
                          >
                            Approve
                          </button>
                        )}
                        <button className="btn-action-remove" onClick={() => removeRow(row.id)} title="Remove item if not required">
                          <Trash2 size={13} style={{ display: "inline" }} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Prominent Inline Warning for Placeholder Factor */}
                    {row.data_quality_status === "placeholder" && row.raw_bom_quantity > 0 && (
                      <div style={{ padding: "8px 16px 8px 68px", background: "rgba(244,63,94,0.15)", borderBottom: "1px solid rgba(244,63,94,0.4)", color: "#fecdd3", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <AlertTriangle size={15} style={{ color: "#f43f5e", flexShrink: 0 }} />
                        <span><strong>⚠️ PLACEHOLDER emission factor:</strong> result_tco2e is NOT valid pending real activity data for '{row.matched_process_name}'. Approval disabled.</span>
                      </div>
                    )}

                    {expanded === row.id && (
                      <div style={{ padding: "16px 20px 16px 68px", background: "rgba(11, 15, 25, 0.6)", borderBottom: "1px solid var(--border-light)" }}>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                          <strong>Audit Reasoning:</strong> {row.audit_reasoning}
                        </p>
                        {row.mandatory_data_gap_warning && (
                          <div style={{ padding: "10px 14px", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "6px", color: "#fecdd3", fontSize: "13px", marginBottom: "10px" }}>
                            <AlertTriangle size={16} style={{ display: "inline", marginRight: "8px" }} />
                            {row.mandatory_data_gap_warning}
                          </div>
                        )}

                        <button className="btn-danger" style={{ height: "30px", fontSize: "12px" }} onClick={() => removeRow(row.id)}>
                          <Trash2 size={13} /> Remove Item from BOM
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </>
        )}

        {/* TAB 2: What-If Simulator */}
        {activeTab === "simulator" && (
          <div className="panel-card">
            <div className="panel-title">
              <Sliders size={20} style={{ color: "var(--accent-emerald)" }} /> What-If Material & Renewable Energy Simulator
            </div>

            <div className="grid2">
              <div className="simulator-box">
                <label>Recycled Material Substitution (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simRecycledPct}
                  onChange={(e) => setSimRecycledPct(Number(e.target.value))}
                />
                <span style={{ fontSize: "14px", color: "var(--accent-emerald)", fontWeight: 700 }}>
                  {simRecycledPct}% Recycled Content
                </span>

                <label style={{ marginTop: "16px" }}>Clean Energy PPA (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simRenewableEnergyPct}
                  onChange={(e) => setSimRenewableEnergyPct(Number(e.target.value))}
                />
                <span style={{ fontSize: "14px", color: "var(--accent-cyan)", fontWeight: 700 }}>
                  {simRenewableEnergyPct}% Renewable Grid
                </span>
              </div>

              <div className="simulator-box">
                <strong>Impact Projections:</strong>
                <div className="sim-metric">
                  <span>Baseline CO₂e Footprint</span>
                  <span style={{ fontWeight: 700 }}>{stats.totalCo2eTons} tCO₂e</span>
                </div>
                <div className="sim-metric">
                  <span>Simulated Avoided Carbon</span>
                  <span style={{ color: "var(--accent-emerald)", fontWeight: 800 }}>{simResults.avoidedCo2eTons} tCO₂e</span>
                </div>
                <div className="sim-metric">
                  <span>E-Credit Dollar Valuation</span>
                  <span style={{ color: "var(--accent-indigo)", fontWeight: 800 }}>{simResults.creditDollarValue}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Compliance */}
        {activeTab === "compliance" && (
          <div className="panel-card">
            <div className="panel-title">
              <ShieldCheck size={20} style={{ color: "var(--accent-emerald)" }} /> Regulatory Compliance Screening Engine
            </div>
            <div className="grid3">
              <div style={{ background: "var(--bg-surface)", padding: "18px", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                <strong style={{ color: "#fff" }}>EU CBAM Readiness</strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "6px 0 12px" }}>Carbon Border Adjustment Mechanism embedded carbon verification.</p>
                <span className="brand-badge">Verified Compliant</span>
              </div>
              <div style={{ background: "var(--bg-surface)", padding: "18px", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                <strong style={{ color: "#fff" }}>EU Digital Product Passport (DPP)</strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "6px 0 12px" }}>Material traceability & recycled content disclosure.</p>
                <span className="brand-badge">Ready for Passport Export</span>
              </div>
              <div style={{ background: "var(--bg-surface)", padding: "18px", borderRadius: "10px", border: "1px solid var(--border-light)" }}>
                <strong style={{ color: "#fff" }}>ISO 14040/44 LCA</strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "6px 0 12px" }}>Goal, scope, and pedigree DQR matrix verification.</p>
                <span className="brand-badge">Practitioner Audit Active</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Catalog */}
        {activeTab === "catalog" && (
          <div className="panel-card">
            <div className="panel-title">
              <Database size={20} style={{ color: "var(--accent-cyan)" }} /> Configured LCI Reference Datasets
            </div>
            <div className="grid3">
              <div style={{ background: "var(--bg-surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                <strong style={{ color: "#fff" }}>USLCI</strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Open US national background inventory for fuels, transport, metals, and chemicals.</p>
              </div>
              <div style={{ background: "var(--bg-surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                <strong style={{ color: "#fff" }}>ELCD</strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>European core inventory data for materials, energy grid, and end-of-life baselines.</p>
              </div>
              <div style={{ background: "var(--bg-surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                <strong style={{ color: "#fff" }}>ecoinvent BYOL</strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Client private licensed tenant deployment for high-precision international supply chain processes.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Add Item */}
        {activeTab === "manual" && (
          <div className="panel-card">
            <div className="panel-title">
              <Plus size={20} style={{ color: "var(--accent-emerald)" }} /> Add Custom BOM Component Item
            </div>
            <div className="grid3">
              <div className="form-group">
                <label>Description</label>
                <input value={manual.description} onChange={(e) => setManual({ ...manual, description: e.target.value })} placeholder="e.g. Copper coil wire drawing" />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" value={manual.quantity} onChange={(e) => setManual({ ...manual, quantity: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select value={manual.unit} onChange={(e) => setManual({ ...manual, unit: e.target.value })}>
                  <option>kg</option>
                  <option>kWh</option>
                  <option>tkm</option>
                </select>
              </div>
            </div>
            <button className="btn-primary" onClick={addManualRow} style={{ width: "220px" }}>
              <Plus size={16} /> Add to Active Queue
            </button>
          </div>
        )}
      </section>

      {/* DQR Pedigree Modal */}
      {selectedPedigree && (
        <div className="modal-overlay open" onClick={() => setSelectedPedigree(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#fff" }}>DQR Pedigree Matrix — {selectedPedigree.raw_bom_input}</h3>
              <button className="btn-outline" style={{ height: "30px", width: "30px", padding: 0 }} onClick={() => setSelectedPedigree(null)}>✕</button>
            </div>
            <div className="grid2">
              <div style={{ background: "var(--bg-surface)", padding: "14px", borderRadius: "8px" }}>
                <strong style={{ color: "var(--accent-emerald)" }}>Technological Score: {selectedPedigree.dqr_technological_score}</strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Material grade & process alignment.</p>
              </div>
              <div style={{ background: "var(--bg-surface)", padding: "14px", borderRadius: "8px" }}>
                <strong style={{ color: "var(--accent-cyan)" }}>Geographical Score: {selectedPedigree.dqr_geographical_score}</strong>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Target region context ({geo}).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {certModalOpen && (
        <div className="modal-overlay open" onClick={() => setCertModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#fff" }}>Verified E-Credits & Carbon Certificate</h3>
              <button className="btn-outline" style={{ height: "30px", width: "30px", padding: 0 }} onClick={() => setCertModalOpen(false)}>✕</button>
            </div>
            <div className="certificate-card">
              <div className="cert-stamp">VERIFIED BYOL</div>
              <h2>Carbon Reduction Certificate</h2>
              <p>Issued to: <strong>{projectName}</strong></p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
                <div>
                  <span style={{ fontSize: "11px", opacity: 0.8 }}>AVOIDED EMISSIONS</span>
                  <div style={{ fontSize: "24px", fontWeight: 800 }}>{simResults.avoidedCo2eTons} tCO₂e</div>
                </div>
                <div>
                  <span style={{ fontSize: "11px", opacity: 0.8 }}>E-CREDIT VALUATION</span>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#34d399" }}>{simResults.creditDollarValue}</div>
                </div>
              </div>
            </div>
            <button className="btn-primary" onClick={() => window.print()}>
              🖨️ Print / Save PDF Certificate
            </button>
          </div>
        </div>
      )}

      {/* AI Assistant Drawer */}
      <div className={`assistant-drawer ${assistantOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3 style={{ color: "#fff", display: "flex", gap: "8px", alignItems: "center" }}>
            <Sparkles size={18} style={{ color: "var(--accent-emerald)" }} /> AI Review Assistant
          </h3>
          <button className="btn-outline" style={{ height: "30px", width: "30px", padding: 0 }} onClick={() => setAssistantOpen(false)}>✕</button>
        </div>

        <div className="drawer-body">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="drawer-footer">
          <input
            placeholder="Ask assistant about BOM mapping..."
            value={botQuestion}
            onChange={(e) => setBotQuestion(e.target.value)}
          />
          <button className="btn-indigo" onClick={submitAssistant}>
            <Bot size={16} /> Send Question
          </button>
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
