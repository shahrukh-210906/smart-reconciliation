import React, { useState, useMemo } from 'react';

const ReconciliationTable = ({ results, onResolve }) => {
  const [filter, setFilter] = useState("all");

  const filteredResults = useMemo(() => {
    if (filter === "all") return results;
    return results.filter((r) => r.status && r.status.toLowerCase() === filter);
  }, [results, filter]);

  // Helper to safely format numbers (Prevents the crash)
  const safeFormat = (val) => {
    if (val === null || val === undefined || isNaN(Number(val))) {
      return '0.00';
    }
    return Number(val).toFixed(2);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Matched: "bg-green-100 text-green-700 border-green-200",
      "Partial Match": "bg-amber-100 text-amber-700 border-amber-200",
      Unmatched: "bg-red-100 text-red-700 border-red-200",
      Duplicate: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || "bg-slate-100"}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Reconciliation Results</h2>
        <div className="flex gap-2">
          {["all", "matched", "partial match", "unmatched", "duplicate"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Uploaded ID</th>
                <th className="px-6 py-4 font-semibold text-right">Uploaded Amt</th>
                <th className="px-6 py-4 font-semibold">System ID</th>
                <th className="px-6 py-4 font-semibold text-right">System Amt</th>
                <th className="px-6 py-4 font-semibold">Variance</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length > 0 ? (
                filteredResults.map((row) => (
                  <tr key={row._id || row.id || Math.random()} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{row.uploadedId || '-'}</td>
                    
                    {/* Fixed: Safe access using helper */}
                    <td className="px-6 py-4 text-right font-mono text-slate-600">
                      {safeFormat(row.uploadedAmount)}
                    </td>
                    
                    <td className="px-6 py-4 text-slate-500">{row.systemId || "-"}</td>
                    
                    {/* Fixed: Safe access using helper */}
                    <td className="px-6 py-4 text-right font-mono text-slate-500">
                      {row.systemAmount ? safeFormat(row.systemAmount) : "-"}
                    </td>
                    
                    {/* Fixed: Safe access using helper */}
                    <td className={`px-6 py-4 font-mono ${Math.abs(row.variance || 0) > 0 ? "text-red-500" : "text-slate-400"}`}>
                      {row.variance && row.variance !== 0 ? safeFormat(row.variance) : "-"}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      {row.status !== "Matched" && (
                        <button
                          onClick={() => onResolve(row._id || row.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-semibold hover:underline"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">No records found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationTable;