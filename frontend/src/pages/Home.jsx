import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import TaskModal from '../components/TaskModal';

const statusDotClass = (status) => {
  if (status === 'Done') return 'bg-tertiary';
  if (status === 'In Progress') return 'bg-secondary';
  return 'bg-slate-300';
};

const categoryPillClass = (category) => {
  if (category === 'Work') return 'bg-primary/10 text-primary';
  if (category === 'Study') return 'bg-secondary/10 text-secondary';
  if (category === 'Urgent') return 'bg-error/10 text-error';
  return 'bg-tertiary/10 text-tertiary';
};

const Home = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ todo: 0, inProgress: 0, done: 0 });
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchHome = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/api/home');
      setStats(res.data?.stats || { todo: 0, inProgress: 0, done: 0 });
      setUpcomingTasks(res.data?.upcomingTasks || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load home data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  useEffect(() => {
    const handler = () => fetchHome();
    window.addEventListener('sanctuary:tasks-changed', handler);
    return () => window.removeEventListener('sanctuary:tasks-changed', handler);
  }, []);

  const todayCount = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return upcomingTasks.filter((t) => {
      if (!t?.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= start && d <= end;
    }).length;
  }, [upcomingTasks]);

  return (
    <div className="space-y-16">
      {/* Hero & CTA */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="font-headline tracking-tight text-4xl md:text-5xl font-extrabold text-on-surface">
            Welcome back, {user?.name || 'Friend'}.
          </h1>
          <p className="text-on-surface-variant font-body text-lg">
            Let's make great things happen. You have {todayCount} tasks for today.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-all hover:shadow-xl"
        >
          <span className="material-symbols-outlined">add</span>
          Create New Task
        </button>
      </header>

      {/* Task Status */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-2xl font-bold">Task Status</h3>
          <div className="hidden md:flex gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
              {/*As prototype want to display carousel layout*/}
              <span className="material-symbols-outlined">chevron_left</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          <div className="min-w-[280px] flex-shrink-0 bg-surface-container-low p-8 rounded-[2rem] relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">pending</span>
              </div>
              <p className="text-on-surface-variant font-medium mb-1">To Do</p>
              <h4 className="text-4xl font-extrabold font-headline">{String(stats.todo).padStart(2, '0')}</h4>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          </div>

          <div className="min-w-[280px] flex-shrink-0 bg-secondary-container p-8 rounded-[2rem] relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined text-3xl">autorenew</span>
              </div>
              <p className="text-on-secondary-container font-medium mb-1">In Progress</p>
              <h4 className="text-4xl font-extrabold font-headline text-on-secondary-container">
                {String(stats.inProgress).padStart(2, '0')}
              </h4>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
          </div>

          <div className="min-w-[280px] flex-shrink-0 bg-tertiary-container p-8 rounded-[2rem] relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-on-tertiary-container mb-6">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <p className="text-on-tertiary-container font-medium mb-1">Done</p>
              <h4 className="text-4xl font-extrabold font-headline text-on-tertiary-container">
                {String(stats.done).padStart(2, '0')}
              </h4>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tertiary/20 rounded-full blur-2xl" />
          </div>

          <div className="min-w-[320px] flex-shrink-0 bg-surface-bright p-8 rounded-[2rem] shadow-sm border border-outline-variant/10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">auto_awesome</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-1">Weekly Goal</p>
              <p className="text-on-surface font-body font-medium">
                Keep momentum: finish 1 task per day for a calmer week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Tasks */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline text-2xl font-bold">Upcoming Tasks</h3>
          <Link to="/tasks" className="text-primary font-semibold text-sm hover:underline">
            View All
          </Link>
        </div>

        <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant/10 overflow-hidden">
          {error && (
            <div className="px-8 py-5 border-b border-surface-container-highest">
              <p className="font-body text-sm text-error">{error}</p>
            </div>
          )}

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-container-highest">
                <th className="px-8 py-5 text-sm font-bold text-on-surface-variant font-headline uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-8 py-5 text-sm font-bold text-on-surface-variant font-headline uppercase tracking-wider">
                  Category
                </th>
                <th className="px-8 py-5 text-sm font-bold text-on-surface-variant font-headline uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-5 text-sm font-bold text-on-surface-variant font-headline uppercase tracking-wider text-right">
                  Due
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {loading ? (
                <tr>
                  <td className="px-8 py-6 text-on-surface-variant font-body" colSpan={4}>
                    Loading tasks...
                  </td>
                </tr>
              ) : upcomingTasks.length === 0 ? (
                <tr>
                  <td className="px-8 py-10 text-on-surface-variant font-body" colSpan={4}>
                    No tasks yet. Create one in <Link to="/tasks" className="text-primary font-semibold hover:underline">Tasks</Link>.
                  </td>
                </tr>
              ) : (
                upcomingTasks.map((t) => (
                  <tr
                    key={t._id}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    onClick={() => {
                      setEditTask(t);
                      setEditOpen(true);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setEditTask(t);
                        setEditOpen(true);
                      }
                    }}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-500">description</span>
                        </div>
                        <span className="font-semibold text-on-surface">{t.taskName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`${categoryPillClass(t.category)} px-3 py-1 rounded-full text-xs font-bold`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusDotClass(t.status)}`} />
                        <span className="text-sm text-on-surface-variant font-medium">{t.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right text-on-surface-variant font-body text-sm">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Insight Banner */}
      <div className="relative bg-gradient-to-br from-primary to-secondary rounded-[3rem] p-10 md:p-12 text-white overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="font-headline text-3xl font-bold mb-4">Focus on what matters.</h2>
          <p className="text-white/80 text-lg mb-8">
            Clear small tasks early to reduce cognitive load and protect your deep-work hours.
          </p>
          <Link
            to="/tasks"
            className="inline-flex bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all"
          >
            Try Smart Focus
          </Link>
        </div>

        <div className="absolute -right-24 -top-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute right-10 bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
      </div>

      <TaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={async () => {
          await fetchHome();
        }}
      />

      <TaskModal
        open={editOpen}
        mode="update"
        task={editTask}
        onClose={() => setEditOpen(false)}
        onUpdated={async () => {
          await fetchHome();
        }}
      />
    </div>
  );
};

export default Home;
