import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex w-full max-w-xs flex-col gap-3">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={`rounded-2xl border p-4 shadow-xl ${
              type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : type === 'error'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-slate-900 border-slate-700 text-white'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm leading-6">{message}</span>
              <button
                type="button"
                onClick={() => removeToast(id)}
                className="text-xs font-semibold opacity-70 hover:opacity-100"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
