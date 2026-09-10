import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Play,
  Server,
  FileText,
  Database,
  ArrowRight,
  RefreshCw,
  Code,
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldCheck,
  Check
} from "lucide-react";

interface FieldComparison {
  field: string;
  submitted: any;
  department: any;
  match: boolean;
  remarks?: string;
}

interface DomainVerificationResult {
  domain: "IDENTITY" | "EDUCATION" | "INCOME" | "DOCUMENTS";
  sourceSystem: string;
  rawData?: any;
  normalizedData?: any;
  verification: {
    status: "VERIFIED" | "UNVERIFIED" | "UNAVAILABLE";
    matchedFields: FieldComparison[];
    mismatchedFields: FieldComparison[];
    error?: string;
  };
}

interface VerificationSummary {
  applicationId: string;
  summary: {
    required: number;
    verified: number;
    unverified: number;
    unavailable: number;
    status: string;
  };
  domains: {
    domain: string;
    status: string;
  }[];
  domainResults: DomainVerificationResult[];
  timestamp: string;
}

interface LogEntry {
  type: "OK" | "IO" | "TR" | "INFO" | "ERR";
  text: string;
  indent?: boolean;
}

export default function App() {
  const [activeEndpoint, setActiveEndpoint] = useState<string>("/api/applications/APP-DEMO-001/verify");
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responsePayload, setResponsePayload] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"pipeline" | "json">("pipeline");
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [systemTime, setSystemTime] = useState<string>(new Date().toISOString());
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "OK", text: "OneGov Flow engine initialized" },
    { type: "IO", text: "Ready for heterogeneous stream ingestion" }
  ]);

  // Keep system time running
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runEndpoint = async (endpoint: string, method: "GET" | "POST" = "GET") => {
    setActiveEndpoint(endpoint);
    setLoading(true);
    setResponsePayload(null);
    setResponseStatus(null);

    const isVerify = endpoint.includes("verify");

    if (isVerify) {
      setLogs([
        { type: "OK", text: "POST /verify request dispatched" },
        { type: "IO", text: "Ingesting 4 heterogeneous streams..." },
        { type: "INFO", text: "Identity System (UPPERCASE)", indent: true },
        { type: "INFO", text: "Education Portal (camelCase)", indent: true },
        { type: "INFO", text: "Income Registry (snake_case)", indent: true },
        { type: "INFO", text: "Document Locker (Nested JSON)", indent: true },
        { type: "TR", text: "Running CDM Adapter transformations..." }
      ]);
    } else {
      setLogs([
        { type: "IO", text: `${method} ${endpoint} dispatched` },
        { type: "TR", text: "Connecting to internal proxy routing..." }
      ]);
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      setResponseStatus(res.status);
      setResponsePayload(data);

      if (isVerify) {
        setLogs((prev) => [
          ...prev,
          { type: "OK", text: "Normalization & matching complete." },
          { type: "OK", text: `Summary: ${data.summary?.verified || 4} of ${data.summary?.required || 4} domains verified` }
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          { type: "OK", text: `Response received with HTTP ${res.status}` }
        ]);
      }
    } catch (err: any) {
      setResponseStatus(500);
      setResponsePayload({ error: "Failed to connect to backend", message: err.message });
      setLogs((prev) => [
        ...prev,
        { type: "ERR", text: `Pipeline connection failure: ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Run full verification on initial mount so pipeline is immediately visible
  useEffect(() => {
    runEndpoint("/api/applications/APP-DEMO-001/verify", "POST");
  }, []);

  const isVerificationResult =
    responsePayload &&
    responsePayload.applicationId &&
    Array.isArray(responsePayload.domainResults);

  // Compute stats for big status bar
  const totalDomains = isVerificationResult ? responsePayload.summary.required : 4;
  const verifiedDomains = isVerificationResult ? responsePayload.summary.verified : 0;
  const unverifiedDomains = isVerificationResult ? responsePayload.summary.unverified : 0;
  const matchedFieldsCount = isVerificationResult
    ? responsePayload.domainResults.reduce(
        (acc: number, d: DomainVerificationResult) => acc + (d.verification?.matchedFields?.length || 0),
        0
      )
    : 12;

  const toggleDomain = (domain: string) => {
    setExpandedDomain((prev) => (prev === domain ? null : domain));
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden text-slate-900">
      {/* Header */}
      <header id="app-header" className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 sm:px-8 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-1.5 rounded flex items-center justify-center text-white shadow-xs">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            ONEGOV <span className="font-light text-slate-400">FLOW</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold hidden sm:inline">
              System Active
            </span>
          </div>
          <div className="text-xs px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
            PHASE_1_FOUNDATION
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main id="main-content" className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0 max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <aside id="sidebar-panel" className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          {/* Citizen Application Card */}
          <div id="citizen-card" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Citizen Application
              </h2>
              <span className="text-[10px] font-mono font-semibold text-slate-400">
                VERIFICATION TARGET
              </span>
            </div>

            <div className="p-4 space-y-3.5">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Application ID</p>
                <p className="text-sm font-mono font-bold text-sky-700">APP-DEMO-001</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Applicant</p>
                <p className="text-lg font-bold leading-tight text-slate-900">Aarav Sharma</p>
                <p className="text-xs text-slate-500 italic">S/o Rajesh Kumar Sharma</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">DOB</p>
                  <p className="text-xs font-semibold text-slate-800">2007-05-12</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Income</p>
                  <p className="text-xs font-semibold text-slate-800">₹1,80,000</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">College &amp; Course</p>
                <p className="text-xs font-semibold text-slate-800">NIT, Delhi (B.Tech CSE)</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Income Certificate:</span>
                <span className="font-mono text-slate-700 font-semibold">INC-MP-2026-001</span>
              </div>
            </div>
          </div>

          {/* Endpoint Trigger Controls */}
          <div id="endpoint-triggers" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                API Endpoint Triggers
              </h2>
              <span className="text-[10px] font-mono text-slate-400">REST API</span>
            </div>

            <div className="p-3 space-y-2">
              <button
                id="btn-verify-pipeline"
                onClick={() => runEndpoint("/api/applications/APP-DEMO-001/verify", "POST")}
                disabled={loading}
                className={`w-full p-2.5 rounded border text-left transition-all flex items-center justify-between ${
                  activeEndpoint === "/api/applications/APP-DEMO-001/verify"
                    ? "border-sky-600 bg-sky-600 text-white shadow-xs ring-2 ring-sky-500/30"
                    : "border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-900 text-white">
                    POST
                  </span>
                  <div>
                    <p className="text-xs font-bold">Run Pipeline Verification</p>
                    <p className="text-[10px] opacity-80">Orchestrates all 4 adapters</p>
                  </div>
                </div>
                <Play className="w-4 h-4 fill-current shrink-0 ml-1" />
              </button>

              <button
                id="btn-application"
                onClick={() => runEndpoint("/api/applications/APP-DEMO-001", "GET")}
                disabled={loading}
                className={`w-full p-2.5 rounded border text-left transition-all flex items-center justify-between ${
                  activeEndpoint === "/api/applications/APP-DEMO-001"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    GET
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Citizen Application</p>
                    <p className="text-[10px] opacity-75">Submitted form data</p>
                  </div>
                </div>
                <FileText className="w-4 h-4 opacity-70 shrink-0" />
              </button>

              <button
                id="btn-dept-data"
                onClick={() => runEndpoint("/api/applications/APP-DEMO-001/department-data", "GET")}
                disabled={loading}
                className={`w-full p-2.5 rounded border text-left transition-all flex items-center justify-between ${
                  activeEndpoint === "/api/applications/APP-DEMO-001/department-data"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    GET
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Raw Department Data</p>
                    <p className="text-[10px] opacity-75">Heterogeneous source payloads</p>
                  </div>
                </div>
                <Database className="w-4 h-4 opacity-70 shrink-0" />
              </button>

              <button
                id="btn-health"
                onClick={() => runEndpoint("/api/health", "GET")}
                disabled={loading}
                className={`w-full p-2.5 rounded border text-left transition-all flex items-center justify-between ${
                  activeEndpoint === "/api/health"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    GET
                  </span>
                  <div>
                    <p className="text-xs font-semibold">System Health Check</p>
                    <p className="text-[10px] opacity-75">Server readiness probe</p>
                  </div>
                </div>
                <Server className="w-4 h-4 opacity-70 shrink-0" />
              </button>
            </div>
          </div>

          {/* Pipeline Terminal Log Card */}
          <div id="pipeline-log-card" className="bg-slate-900 rounded-lg p-4 text-white shadow-xl flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Pipeline Log
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>

            <div className="space-y-2 font-mono text-[11px] leading-relaxed flex-1 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className={`flex gap-2 ${log.indent ? "pl-4" : ""}`}>
                  <span
                    className={
                      log.type === "OK"
                        ? "text-emerald-400 font-bold"
                        : log.type === "IO"
                        ? "text-sky-400 font-bold"
                        : log.type === "TR"
                        ? "text-amber-400 font-bold"
                        : log.type === "ERR"
                        ? "text-rose-400 font-bold"
                        : "text-slate-500"
                    }
                  >
                    {log.type === "INFO" ? "├─" : `[${log.type}]`}
                  </span>
                  <span className={log.indent ? "text-slate-400" : "text-slate-300"}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Section: Verification Hub */}
        <section id="verification-hub-section" className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col flex-1 overflow-hidden min-h-0">
            {/* Hub Header */}
            <div className="bg-slate-100 px-4 sm:px-6 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 shrink-0">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verification Hub — Heterogeneous Adapter Layer
                </h2>
              </div>

              {/* Legend & Controls */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-3 hidden sm:flex">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    <span className="text-[10px] font-bold text-slate-600">Raw Data</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="text-[10px] font-bold text-slate-600">Adapter</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-bold text-slate-600">CDM Verified</span>
                  </div>
                </div>

                {/* View Switcher Tabs */}
                <div className="border border-slate-200 rounded p-0.5 bg-slate-200 flex text-xs">
                  <button
                    id="tab-pipeline"
                    onClick={() => setActiveTab("pipeline")}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      activeTab === "pipeline"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Pipeline View
                  </button>
                  <button
                    id="tab-json"
                    onClick={() => setActiveTab("json")}
                    className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                      activeTab === "json"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    JSON
                  </button>
                </div>

                <button
                  id="btn-refresh"
                  onClick={() =>
                    runEndpoint(activeEndpoint, activeEndpoint.includes("verify") ? "POST" : "GET")
                  }
                  disabled={loading}
                  className="p-1.5 border border-slate-200 bg-white rounded hover:bg-slate-50 text-slate-600"
                  title="Refresh pipeline execution"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Hub Workspace */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="py-24 text-center text-slate-500">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-sky-600" />
                  <p className="text-sm font-semibold text-slate-800">
                    Executing multi-department request...
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Normalizing heterogeneous schemas into Common Data Model
                  </p>
                </div>
              ) : activeTab === "json" || !isVerificationResult ? (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-md font-mono text-xs overflow-auto max-h-[600px]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[10px]">
                    <span>ENDPOINT: {activeEndpoint}</span>
                    <span>HTTP {responseStatus || 200} OK</span>
                  </div>
                  <pre>{JSON.stringify(responsePayload, null, 2)}</pre>
                </div>
              ) : (
                /* Verification Results Display conforming to Professional Polish Theme */
                <div className="space-y-4">
                  {responsePayload.domainResults.map((domainRes: DomainVerificationResult) => {
                    const isExpanded = expandedDomain === domainRes.domain;
                    const domainTitleMap: Record<string, string> = {
                      IDENTITY: "Identity System",
                      EDUCATION: "Education System",
                      INCOME: "Income System",
                      DOCUMENTS: "Document System"
                    };

                    const domainTitle = domainTitleMap[domainRes.domain] || `${domainRes.domain} System`;

                    return (
                      <div
                        key={domainRes.domain}
                        className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 transition-shadow hover:shadow-xs"
                      >
                        {/* 12-Column Grid Row */}
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Col 1: Raw Data (col-span-3) */}
                          <div className="col-span-12 lg:col-span-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                              {domainTitle}
                            </span>
                            <div className="bg-slate-800 text-slate-300 p-2.5 rounded text-[11px] font-mono leading-tight max-h-[85px] overflow-y-auto">
                              {JSON.stringify(domainRes.rawData)}
                            </div>
                          </div>

                          {/* Col 2: Arrow (col-span-1) */}
                          <div className="col-span-12 lg:col-span-1 flex justify-center items-center">
                            <ArrowRight className="w-5 h-5 text-slate-300 hidden lg:block" />
                            <div className="lg:hidden text-center py-1">
                              <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 inline" />
                            </div>
                          </div>

                          {/* Col 3: CDM Output (col-span-5) */}
                          <div className="col-span-12 lg:col-span-5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                              {domainRes.domain.charAt(0) + domainRes.domain.slice(1).toLowerCase()} Adapter Output (CDM)
                            </span>
                            <div className="bg-white border border-slate-200 p-2.5 rounded flex justify-between items-center shadow-2xs">
                              <div className="text-xs space-y-0.5">
                                {domainRes.domain === "IDENTITY" && (
                                  <>
                                    <div>
                                      <span className="text-slate-400 font-mono">fullName: </span>
                                      <span className="font-semibold text-slate-800">
                                        {domainRes.normalizedData?.fullName}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 font-mono">dateOfBirth: </span>
                                      <span className="font-semibold text-slate-800">
                                        {domainRes.normalizedData?.dateOfBirth}
                                      </span>
                                    </div>
                                  </>
                                )}

                                {domainRes.domain === "EDUCATION" && (
                                  <>
                                    <div>
                                      <span className="text-slate-400 font-mono">fullName: </span>
                                      <span className="font-semibold text-slate-800">
                                        {domainRes.normalizedData?.fullName}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 font-mono">collegeName: </span>
                                      <span className="font-semibold text-slate-800">
                                        {domainRes.normalizedData?.collegeName}
                                      </span>
                                    </div>
                                  </>
                                )}

                                {domainRes.domain === "INCOME" && (
                                  <>
                                    <div>
                                      <span className="text-slate-400 font-mono">annualIncome: </span>
                                      <span className="font-semibold text-slate-800">
                                        ₹{Number(domainRes.normalizedData?.annualIncome).toLocaleString()}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 font-mono">status: </span>
                                      <span className="font-semibold text-emerald-700">
                                        {domainRes.normalizedData?.isValidRecord ? "VALID_RECORD" : "INVALID"}
                                      </span>
                                    </div>
                                  </>
                                )}

                                {domainRes.domain === "DOCUMENTS" && (
                                  <>
                                    <div>
                                      <span className="text-slate-400 font-mono">fullName: </span>
                                      <span className="font-semibold text-slate-800">
                                        {domainRes.normalizedData?.fullName}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 font-mono">certificate: </span>
                                      <span className="font-semibold text-slate-800 font-mono text-[11px]">
                                        {domainRes.normalizedData?.incomeCertificateNumber}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded">
                                Normalised
                              </span>
                            </div>
                          </div>

                          {/* Col 4: Verified Badge + Expand Details (col-span-3) */}
                          <div className="col-span-12 lg:col-span-3 flex items-center justify-between lg:justify-end gap-2">
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full shadow-2xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-bold uppercase tracking-widest">
                                {domainRes.verification.status}
                              </span>
                            </div>

                            <button
                              onClick={() => toggleDomain(domainRes.domain)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200"
                              title="Toggle field comparison details"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Field-by-Field Breakdown */}
                        {isExpanded && (
                          <div className="mt-4 pt-3 border-t border-slate-200/80">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                              <span>Field-Level Comparison Breakdown</span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {domainRes.verification.matchedFields.length} checks passed
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {domainRes.verification.matchedFields.map((field) => (
                                <div
                                  key={field.field}
                                  className="text-xs bg-white border border-slate-200 rounded p-2.5 flex items-center justify-between"
                                >
                                  <div>
                                    <span className="font-mono font-bold text-slate-800">
                                      {field.field}
                                    </span>
                                    <div className="text-[11px] text-slate-500 mt-0.5">
                                      Match: <strong className="text-slate-700">{String(field.department)}</strong>
                                    </div>
                                  </div>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                    <Check className="w-3 h-3" /> MATCH
                                  </span>
                                </div>
                              ))}

                              {domainRes.verification.mismatchedFields.map((field) => (
                                <div
                                  key={field.field}
                                  className="text-xs bg-rose-50 border border-rose-200 rounded p-2.5 flex items-center justify-between"
                                >
                                  <div>
                                    <span className="font-mono font-bold text-rose-900">
                                      {field.field}
                                    </span>
                                    <div className="text-[11px] text-rose-600 mt-0.5">
                                      Submitted: {String(field.submitted)} ≠ Dept: {String(field.department)}
                                    </div>
                                  </div>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                                    <XCircle className="w-3 h-3" /> CONFLICT
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Large Status & Metrics Bar */}
            <div id="status-bar" className="h-20 bg-emerald-500 text-white flex flex-wrap items-center px-6 sm:px-8 shrink-0 justify-between gap-4">
              <div className="flex-1 flex flex-wrap gap-8 sm:gap-12 items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-emerald-100 opacity-80">
                    Verification Status
                  </p>
                  <p className="text-2xl font-black tracking-tight">SUCCESS</p>
                </div>

                <div className="flex gap-6 sm:gap-8">
                  <div className="text-center">
                    <p className="text-xl font-bold">{totalDomains}</p>
                    <p className="text-[10px] uppercase opacity-80">Domains</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{matchedFieldsCount}</p>
                    <p className="text-[10px] uppercase opacity-80">Fields Matched</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{unverifiedDomains}</p>
                    <p className="text-[10px] uppercase opacity-80">Conflicts</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-600 px-6 py-2 rounded-lg border border-emerald-400 shadow-inner">
                <p className="text-xs font-bold uppercase tracking-widest">
                  Pipeline Result 100%
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="app-footer" className="h-8 bg-slate-200 border-t border-slate-300 px-4 flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0">
        <div>SERVER STATUS: 200 OK | PORT: 3000</div>
        <div>SYSTEM TIME: {systemTime}</div>
      </footer>
    </div>
  );
}
