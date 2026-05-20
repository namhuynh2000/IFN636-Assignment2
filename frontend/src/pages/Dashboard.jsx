import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Link } from 'react-router-dom';

const DonutChart = ({ todo, inProgress, done }) => {
  const segments = useMemo(() => {
    const total = todo + inProgress + done;
    if (total <= 0) {
      return { total: 0, todoPct: 0, inProgressPct: 0, donePct: 0 };
    }

    return {
      total,
      todoPct: todo / total,
      inProgressPct: inProgress / total,
      donePct: done / total,
    };
  }, [todo, inProgress, done]);

  const total = segments.total;
  const r = 40;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * r;

  const colors = {
    todo: '#7fb6ff', // primary-fixed-dim (approx)
    inProgress: '#6452a5', // secondary
    done: '#a4fd4c', // tertiary-fixed
  };

  let acc = 0;
  const makeSeg = (pct) => {
    const seg = pct * circumference;
    const offset = -acc;
    acc += seg;
    return { seg, offset };
  };

  // Order matters for dashoffset stacking: start at To Do -> In Progress -> Done (clockwise)
  const { seg: todoSeg, offset: todoOff } = makeSeg(segments.todoPct);
  const { seg: inProgSeg, offset: inProgOff } = makeSeg(segments.inProgressPct);
  const { seg: doneSeg, offset: doneOff } = makeSeg(segments.donePct);

  const baseStroke = 'rgba(172, 179, 183, 0.35)'; // outline-variant

  const segCircle = (segLength, dashOffset, stroke) => {
    if (segLength <= 0) return null;
    return (
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="transparent"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${segLength} ${circumference - segLength}`}
        strokeDashoffset={dashOffset}
      />
    );
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100" aria-label="Task status pie chart">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="transparent"
          stroke={baseStroke}
          strokeWidth={strokeWidth}
        />
        {segCircle(todoSeg, todoOff, colors.todo)}
        {segCircle(inProgSeg, inProgOff, colors.inProgress)}
        {segCircle(doneSeg, doneOff, colors.done)}
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-headline font-black text-on-surface">{total}</span>
        <span className="text-xs uppercase tracking-widest font-bold text-on-surface-variant/70">Total Tasks</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/api/dashboard');
      setStats(res.data?.stats || { total: 0, todo: 0, inProgress: 0, done: 0 });
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const handler = () => fetchDashboard();
    window.addEventListener('sanctuary:tasks-changed', handler);
    return () => window.removeEventListener('sanctuary:tasks-changed', handler);
  }, []);

  const completedCardText = useMemo(() => {
    return `${stats.done} Done`;
  }, [stats.done]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-on-surface-variant font-body">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="mb-4">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">
          Dashboard
        </h1>
        <p className="text-on-surface-variant font-body mt-2">Tracking you summary tasks.</p>
      </header>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-2xl">
          <p className="font-body text-sm text-error">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-tertiary-container/30 rounded-xl p-6 flex flex-col gap-2 group hover:bg-tertiary-container/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-tertiary text-3xl">check_circle</span>
            <span className="text-xs font-bold uppercase tracking-widest text-on-tertiary-container/60">Success</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-headline font-black text-on-tertiary-container">{completedCardText}</span>
            <p className="text-sm font-medium text-on-tertiary-container/70">completed tasks</p>
          </div>
        </div>

        <div className="bg-secondary-container/30 rounded-xl p-6 flex flex-col gap-2 group hover:bg-secondary-container/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-secondary text-3xl">pending</span>
            <span className="text-xs font-bold uppercase tracking-widest text-on-secondary-container/60">Active</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-headline font-black text-on-secondary-container">
              {stats.inProgress} In Progress
            </span>
            <p className="text-sm font-medium text-on-secondary-container/70">in progress tasks</p>
          </div>
        </div>

        <div className="bg-primary-container/30 rounded-xl p-6 flex flex-col gap-2 group hover:bg-primary-container/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-primary text-3xl">assignment</span>
            <span className="text-xs font-bold uppercase tracking-widest text-on-primary-container/60">Planned</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-headline font-black text-on-primary-container">
              {stats.todo} To Do
            </span>
            <p className="text-sm font-medium text-on-primary-container/70">planned tasks</p>
          </div>
        </div>
      </section>

      {/* Pie Chart + Legend */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 bg-surface-container-low rounded-xl p-8 relative overflow-hidden min-h-[420px]">
          <h3 className="font-headline text-2xl font-bold mb-8">Status Overview</h3>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <DonutChart todo={stats.todo} inProgress={stats.inProgress} done={stats.done} />

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: '#a4fd4c' }} />
                  <span className="font-medium">Done</span>
                </div>
                <span className="font-bold">{stats.done}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: '#6452a5' }} />
                  <span className="font-medium">In Progress</span>
                </div>
                <span className="font-bold">{stats.inProgress}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: '#7fb6ff' }} />
                  <span className="font-medium">To Do</span>
                </div>
                <span className="font-bold">{stats.todo}</span>
              </div>

              <div className="mt-6">
                <Link to="/tasks" className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold hover:opacity-95 transition-all">
                  View Tasks
                </Link>
              </div>
            </div>
          </div>
        </div>

        
      </section>
    </div>
  );
};

export default Dashboard;

