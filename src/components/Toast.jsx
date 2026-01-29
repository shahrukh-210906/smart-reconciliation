import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-white border-l-4 border-green-500 text-slate-800",
    error: "bg-white border-l-4 border-red-500 text-slate-800",
    info: "bg-white border-l-4 border-blue-500 text-slate-800"
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-r shadow-2xl animate-slide-in ${styles[type] || styles.info} min-w-[300px]`}>
      {icons[type] || icons.info}
      <p className="font-medium text-sm flex-1">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;