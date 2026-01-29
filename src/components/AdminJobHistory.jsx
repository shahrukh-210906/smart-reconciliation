import React, { useEffect, useState } from 'react';
import API from '../api';
import { Eye, FileText, CheckCircle, XCircle } from 'lucide-react';

const AdminJobHistory = ({ onLoadJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get('/admin/jobs');
        setJobs(data);
      } catch (err) {
        console.error("Failed to load admin history");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading history...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Global Upload History</h2>
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {jobs.length} Total Uploads
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Uploaded Date</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">File Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Records</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-600">
                  {new Date(job.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {job.uploadedBy?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{job.uploadedBy?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{job.uploadedBy?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-600 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  {job.fileName}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                    job.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {job.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                    {job.status === 'Failed' && <XCircle className="w-3 h-3" />}
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900 font-medium">{job.totalRecords}</div>
                  <div className="text-xs text-slate-500">{job.matchedCount} matches</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onLoadJob(job._id)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Eye className="w-3 h-3" /> View Data
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                  No uploads found. (If you just reset the database, this is normal!)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobHistory;