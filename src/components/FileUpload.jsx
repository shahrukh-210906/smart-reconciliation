import React, { useState } from 'react';
import { Upload, Filter } from "lucide-react";

const FileUpload = ({ onUpload, mapping, setMapping, previewData, setPreviewData }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        
        // Simple CSV Parser
        const lines = text.split("\n").map((line) => line.trim()).filter((line) => line);
        if (lines.length > 0) {
          const headers = lines[0].split(",").map((h) => h.trim());
          const rows = lines.slice(1, 21).map((line) => {
            const values = line.split(",").map((v) => v.trim());
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {});
          });
          setPreviewData({ headers, rows });

          // Auto-guess mapping
          const newMapping = { ...mapping };
          headers.forEach((h) => {
            const lower = h.toLowerCase();
            if (lower.includes("id") || lower.includes("txn")) newMapping.transactionId = h;
            if (lower.includes("amt") || lower.includes("amount")) newMapping.amount = h;
            if (lower.includes("date") || lower.includes("time")) newMapping.date = h;
            if (lower.includes("ref")) newMapping.referenceNumber = h;
          });
          setMapping(newMapping);
        }
      };
      reader.readAsText(file);
    }
  };

  const processFile = () => {
    if (!selectedFile) return;
    onUpload(selectedFile, mapping);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Upload & Map Data</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors bg-white">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-slate-700 font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400 mb-4">CSV or Excel (Max 50k rows)</p>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
            />
          </div>

          {previewData && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Column Mapping
              </h3>
              <div className="space-y-3">
                {["Transaction ID", "Amount", "Date", "Reference Number"].map((field) => {
                  const key = field.toLowerCase().replace(" ", "") === "transactionid" ? "transactionId"
                    : field.toLowerCase() === "amount" ? "amount"
                    : field.toLowerCase() === "date" ? "date"
                    : "referenceNumber";
                  return (
                    <div key={key}>
                      <label className="block text-xs font-medium text-slate-500 mb-1">System Field: {field}</label>
                      <select
                        value={mapping[key] || ""}
                        onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })}
                        className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Select Column...</option>
                        {previewData.headers.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={processFile}
                disabled={!selectedFile || !mapping.transactionId || !mapping.amount}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
              >
                Start Reconciliation
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {previewData ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-700">File Preview</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>{previewData.headers.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewData.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        {previewData.headers.map((h) => (
                          <td key={`${idx}-${h}`} className="px-4 py-2 text-slate-600">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[300px]">
              <p>Upload a file to see preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;