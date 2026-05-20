import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaskModal from './TaskModal';

const navLinkBase =
  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all';

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm h-16 flex justify-between items-center px-6 md:px-8 font-headline tracking-tight">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Goal Tracking King
          </span>
          <div className="hidden md:flex gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-700 font-semibold border-b-2 border-blue-600 py-1'
                  : 'text-slate-500 hover:text-blue-500 transition-colors py-1'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-700 font-semibold border-b-2 border-blue-600 py-1'
                  : 'text-slate-500 hover:text-blue-500 transition-colors py-1'
              }
            >
              Tasks
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-700 font-semibold border-b-2 border-blue-600 py-1'
                  : 'text-slate-500 hover:text-blue-500 transition-colors py-1'
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-700 font-semibold border-b-2 border-blue-600 py-1'
                  : 'text-slate-500 hover:text-blue-500 transition-colors py-1'
              }
            >
              Profile
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-on-surface-variant">
          <img
                alt="Profile avatar"
                className="w-8 h-8 rounded-full object-cover border-4 border-white shadow-xl"
                src="/profile.png"
              />
            <span className="font-body">{user?.name || 'Account'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors font-body text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* SideNavBar (Desktop) */}
      <aside className="fixed left-0 top-0 h-full w-64 pt-20 bg-slate-50 flex flex-col gap-2 p-4 border-r border-slate-100 z-40 hidden lg:flex">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="w-full py-3 px-4 mb-4 bg-gradient-to-br from-primary to-secondary text-white rounded-full font-semibold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:translate-x-1 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Task
        </button>

        <nav className="flex-1 flex flex-col gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? `${navLinkBase} bg-white text-blue-600 shadow-sm hover:translate-x-1`
                : `${navLinkBase} text-slate-600 hover:bg-slate-100 hover:translate-x-1`
            }
          >
            <span className="material-symbols-outlined fill-icon">home</span>
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive
                ? `${navLinkBase} bg-white text-blue-600 shadow-sm hover:translate-x-1`
                : `${navLinkBase} text-slate-600 hover:bg-slate-100 hover:translate-x-1`
            }
          >
            <span className="material-symbols-outlined">assignment</span>
            <span>Tasks</span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? `${navLinkBase} bg-white text-blue-600 shadow-sm hover:translate-x-1`
                : `${navLinkBase} text-slate-600 hover:bg-slate-100 hover:translate-x-1`
            }
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? `${navLinkBase} bg-white text-blue-600 shadow-sm hover:translate-x-1`
                : `${navLinkBase} text-slate-600 hover:bg-slate-100 hover:translate-x-1`
            }
          >
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-24 px-6 md:px-8 lg:px-16 pb-16 max-w-7xl mx-auto">
        <Outlet />
      </main>

      <TaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={async () => {
          window.dispatchEvent(new Event('sanctuary:tasks-changed'));
        }}
      />
    </div>
  );
};

export default AppShell;

