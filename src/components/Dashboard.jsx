import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Database } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from './Modal'; 
import API from '../api';

const Dashboard = ({ stats, triggerToast }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [uploading, setUploading] = useState(false);
  
  // NEW: Modal State
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 1. User picks file -> Trigger Modal
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setShowConfirm(true);
    e.target.value = null; // Reset input
  };

  // 2. User confirms Modal -> Do Upload
  const confirmSystemUpload = async () => {
    setShowConfirm(false); // Close modal
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const { data } = await API.post('/admin/system-upload', formData);
      triggerToast(data.msg, 'success'); // REPLACED ALERT
    } catch (err) {
      console.error(err);
      triggerToast("Failed to update: " + (err.response?.data?.msg || "Error"), 'error'); // REPLACED ALERT
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  // Graph Data
  const pieData = [
    { name: 'Matched', value: stats.matched, color: '#22c55e' },
    { name: 'Unmatched', value: stats.unmatched, color: '#ef4444' },
    { name: 'Partial/Review', value: stats.partial + stats.duplicate, color: '#eab308' },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Matched', count: stats.matched },
    { name: 'Unmatched', count: stats.unmatched },
    { name: 'Partial', count: stats.partial },
    { name: 'Duplicate', count: stats.duplicate },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* NEW: Custom Confirmation Modal */}
      <Modal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmSystemUpload}
        title="Update System Records?"
        message="This action will replace ALL existing system records with the data from your new file. This cannot be undone."
        confirmText="Yes, Replace All"
        isDangerous={true}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Reconciliation Overview</h2>
        <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
           Last Updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {user.role === 'admin' && (
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform hover:scale-[1.01]">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400"/> Update System Records
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Upload a new "Master File" (CSV) to serve as the truth.
            </p>
          </div>
          <div className="relative">
             <input 
               type="file" 
               accept=".csv"
               onChange={handleFileSelect} // UPDATED HANDLER
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               disabled={uploading}
             />
             <button className={`bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${uploading ? 'opacity-50' : ''}`}>
               {uploading ? 'Importing...' : 'Upload Master CSV'}
               <UploadCloud className="w-4 h-4"/>
             </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Records" value={stats.total} icon={UploadCloud} color="bg-slate-100 text-slate-600" />
        <StatCard title="Matched" value={stats.matched} icon={CheckCircle} color="bg-green-100 text-green-600" />
        <StatCard title="Unmatched" value={stats.unmatched} icon={AlertCircle} color="bg-red-100 text-red-600" />
        <StatCard title="Review Needed" value={stats.partial + stats.duplicate} icon={AlertCircle} color="bg-yellow-100 text-yellow-600" />
      </div>

      {/* Graphs Section */}
      {stats.total > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-slate-700 mb-4 w-full text-left">Status Distribution</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Detailed Breakdown</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-400">Upload a file to generate analytics graphs.</p>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export default Dashboard;