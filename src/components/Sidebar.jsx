import React from 'react';
import { LayoutDashboard, Upload, FileSpreadsheet, History, Shield, LogOut, Globe } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "analyst", "viewer"] },
    { id: "upload", label: "Upload & Map", icon: Upload, roles: ["admin", "analyst"] },
    { id: "reconciliation", label: "Reconciliation", icon: FileSpreadsheet, roles: ["admin", "analyst", "viewer"] },
    { id: "history", label: "Global History", icon: Globe, roles: ["admin"] }, 
    { id: "audit", label: "Audit Trail", icon: History, roles: ["admin"] },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 shadow-xl z-10">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          SmartRec
        </h1>
        <p className="text-xs text-slate-500 mt-1">Reconciliation System</p>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          if (!item.roles.includes(user.role)) return null;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;