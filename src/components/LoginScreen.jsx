import React, { useState } from 'react';
import { Shield, ArrowRight, Loader, User, Eye, BarChart } from "lucide-react";
import API from '../api';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/login', { email, password });
      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role) => {
    setPassword('password123');
    if (role === 'admin') setEmail('admin@test.com');
    if (role === 'analyst') setEmail('analyst@test.com');
    if (role === 'viewer') setEmail('viewer@test.com');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex items-center gap-2 mb-8 text-blue-600">
            <Shield className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">SmartRec</span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 mb-8">Please sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className="animate-spin w-5 h-5"/> : 'Sign In'} 
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Quick Access Section */}
        <div className="w-full md:w-1/2 bg-slate-900 p-8 md:p-12 flex flex-col justify-center text-white">
          <h3 className="text-xl font-semibold mb-6">Demo Access</h3>
          <p className="text-slate-400 mb-6 text-sm">Select a role to auto-fill credentials.</p>
          
          <div className="space-y-3">
            <button onClick={() => fillCredentials('admin')} className="w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-4 transition-colors text-left group">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">System Admin</p>
                <p className="text-xs text-slate-400">Full access + Logs</p>
              </div>
            </button>

            <button onClick={() => fillCredentials('analyst')} className="w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-4 transition-colors text-left group">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <BarChart className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Data Analyst</p>
                <p className="text-xs text-slate-400">Upload & Reconcile</p>
              </div>
            </button>

            <button onClick={() => fillCredentials('viewer')} className="w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-4 transition-colors text-left group">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Viewer</p>
                <p className="text-xs text-slate-400">Read-only access</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;