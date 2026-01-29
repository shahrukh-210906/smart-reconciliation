import React from 'react';

const AuditTrail = ({ logs }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">System Audit Log</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
          {logs.length === 0 && (
            <p className="pl-6 text-slate-500">No activity recorded yet.</p>
          )}

          {logs.map((log) => (
            <div key={log.id} className="relative pl-8">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                <span className="font-semibold text-slate-800">{log.action}</span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block">
                <span className="font-medium text-blue-600">{log.user}</span>{" "}
                {log.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;