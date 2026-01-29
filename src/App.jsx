import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";
import FileUpload from "./components/FileUpload";
import ReconciliationTable from "./components/ReconciliationTable";
import AuditTrail from "./components/AuditTrail";
import AdminJobHistory from "./components/AdminJobHistory";
import Toast from "./components/Toast"; // NEW IMPORT
import API from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mapping, setMapping] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [reconciliationResults, setReconciliationResults] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, matched: 0, partial: 0, unmatched: 0, duplicate: 0 });
  
  // NEW: Toast State
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      syncLatestData();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'audit' && user?.role === 'admin') {
      fetchAuditLogs();
    }
  }, [activeTab, user]);

  // NEW: Global Toast Helper
  const triggerToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const syncLatestData = async () => {
    try {
      const { data } = await API.get('/latest-job');
      if (data && data.jobId) {
        fetchJobData(data.jobId);
        localStorage.setItem("lastJobId", data.jobId);
      }
    } catch (err) {
      console.log("No recent data found to sync.");
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data } = await API.get('/admin/audit-logs');
      setAuditLogs(data.map(log => ({
        id: log._id,
        timestamp: log.timestamp,
        user: log.user ? log.user.name : 'System',
        action: log.action,
        details: log.details || `Modified ${log.entity}`
      })));
    } catch (err) {
      console.error("Failed to load audit logs");
    }
  };

  const fetchJobData = useCallback(async (jobId) => {
    try {
      const resultsRes = await API.get(`/results/${jobId}`);
      const results = resultsRes.data;
      setReconciliationResults(results);

      const newStats = results.reduce((acc, curr) => {
        const status = curr.status?.toLowerCase() || "";
        if (status === "matched") acc.matched++;
        else if (status === "partial match") acc.partial++;
        else if (status === "unmatched") acc.unmatched++;
        else if (status === "duplicate") acc.duplicate++;
        acc.total++;
        return acc;
      }, { total: 0, matched: 0, partial: 0, unmatched: 0, duplicate: 0 });
      setStats(newStats);
    } catch (err) {
      if(err.response && err.response.status === 404) localStorage.removeItem("lastJobId");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setReconciliationResults([]);
    setStats({ total: 0, matched: 0, partial: 0, unmatched: 0, duplicate: 0 });
  };

  const handleUploadAndReconcile = async (fileObj, mappingConfig) => {
    const formData = new FormData();
    formData.append("file", fileObj);
    formData.append("mapping", JSON.stringify(mappingConfig));

    try {
      const uploadRes = await API.post("/upload", formData);
      const { jobId, isCached, msg } = uploadRes.data;
      
      localStorage.setItem("lastJobId", jobId); 

      if (isCached) {
        triggerToast(msg, 'info'); // REPLACED ALERT
      } else {
        triggerToast("File uploaded successfully. Processing...", 'success');
      }

      setTimeout(() => {
        fetchJobData(jobId); 
        setActiveTab("dashboard");
      }, 2000);
      
    } catch (err) {
      triggerToast(err.response?.data?.msg || "Upload failed", 'error'); // REPLACED ALERT
    }
  };

  const handleResolve = async (id) => {
    try {
      setReconciliationResults((prev) => prev.map((r) => r._id === id ? { ...r, status: "Matched", variance: 0 } : r));
      await API.put(`/resolve/${id}`, { newStatus: "Matched" });
      setStats((prev) => ({ ...prev, matched: prev.matched + 1, unmatched: prev.unmatched > 0 ? prev.unmatched - 1 : prev.unmatched }));
      triggerToast("Record resolved manually", 'success');
    } catch (err) {
      triggerToast("Failed to resolve record", 'error');
    }
  };

  const handleClearProject = () => {
    localStorage.removeItem("lastJobId");
    setReconciliationResults([]);
    setStats({ total: 0, matched: 0, partial: 0, unmatched: 0, duplicate: 0 });
    setPreviewData(null);
    setActiveTab("upload");
  };

  if (!user) {
    return <LoginScreen onLogin={(userData) => { setUser(userData); localStorage.setItem("user", JSON.stringify(userData)); }} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* GLOBAL TOAST CONTAINER */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 p-8 transition-all">
        <div className="flex justify-end mb-4 gap-4">
           {stats.total > 0 && (
             <button onClick={handleClearProject} className="text-xs text-red-500 hover:text-red-700 underline">
               Clear Current Project
             </button>
           )}
        </div>

        {activeTab === "dashboard" && <Dashboard stats={stats} triggerToast={triggerToast} />}

        {activeTab === "upload" && (
          <FileUpload
            onUpload={handleUploadAndReconcile}
            mapping={mapping}
            setMapping={setMapping}
            previewData={previewData}
            setPreviewData={setPreviewData}
          />
        )}

        {activeTab === "reconciliation" && (
          <ReconciliationTable results={reconciliationResults} onResolve={handleResolve} />
        )}

        {activeTab === "audit" && <AuditTrail logs={auditLogs} />}
        
        {activeTab === "history" && user.role === 'admin' && (
          <AdminJobHistory 
            onLoadJob={(jobId) => {
              fetchJobData(jobId);
              localStorage.setItem("lastJobId", jobId);
              setActiveTab('dashboard');
              triggerToast("Loaded historical data", 'success'); // REPLACED ALERT
            }} 
          />
        )}
      </main>
    </div>
  );
}