import { useMemo, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/api/tasks');
      setTasks(response.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const handler = () => fetchTasks();
    window.addEventListener('sanctuary:tasks-changed', handler);
    return () => window.removeEventListener('sanctuary:tasks-changed', handler);
  }, []);

  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'Done').length;
    const remaining = tasks.length - completed;
    return { completed, remaining };
  }, [tasks]);

  const categories = useMemo(() => {
    const base = ['Work', 'Personal', 'Study', 'Urgent'];
    return ['All', ...base];
  }, []);

  const filteredTasks = useMemo(() => {
    if (activeCategory === 'All') return tasks;
    return tasks.filter((t) => t.category === activeCategory);
  }, [tasks, activeCategory]);


  const statusPill = (status) => {
    if (status === 'Done') return { wrap: 'bg-surface-container', dot: 'bg-tertiary', text: 'text-on-surface-variant' };
    if (status === 'In Progress') return { wrap: 'bg-secondary-container', dot: 'bg-secondary', text: 'text-on-secondary-container' };
    return { wrap: 'bg-surface-container', dot: 'bg-outline-variant', text: 'text-on-surface-variant' };
  };

  const categoryTag = (category) => {
    if (category === 'Work') return 'bg-primary-container text-on-primary-container';
    if (category === 'Study') return 'bg-secondary-container text-on-secondary-container';
    if (category === 'Urgent') return 'bg-error/10 text-error';
    return 'bg-surface-variant text-on-surface-variant';
  };

  return (
    <div>
      {/* Editorial Header */}
      <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">Tasks</h1>
          <p className="text-on-surface-variant font-body">Manage your tasks and archive yourgoals.</p>
        </div>

        <div className="flex gap-4">
          <div className="p-4 bg-surface-container-low rounded-xl text-center min-w-[120px]">
            <span className="block text-2xl font-bold text-primary">{counts.remaining}</span>
            <span className="text-xs font-medium text-on-surface-variant uppercase">Remaining</span>
          </div>
          <div className="p-4 bg-tertiary-container rounded-xl text-center min-w-[120px]">
            <span className="block text-2xl font-bold text-tertiary">{counts.completed}</span>
            <span className="text-xs font-medium text-on-tertiary-fixed uppercase">Completed</span>
          </div>
        </div>
      </header>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCategory(c)}
            className={
              c === activeCategory
                ? 'px-6 py-2.5 bg-on-surface text-surface rounded-full text-sm font-semibold transition-all'
                : 'px-6 py-2.5 bg-surface-container-highest text-on-surface-variant rounded-full text-sm font-semibold hover:bg-surface-container-high transition-all'
            }
          >
            {c}
          </button>
        ))}

      </div>

      {/* Errors */}
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl">
          <p className="font-body text-sm text-error">{error}</p>
        </div>
      )}


      {/* Task List */}
      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="p-6 rounded-2xl bg-surface-container-low text-on-surface-variant font-body">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-6 rounded-2xl bg-surface-container-low text-on-surface-variant font-body">
            No tasks in this category yet.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const pill = statusPill(t.status);
            return (
              <div
                key={t._id}
                className={`group bg-surface-container-low hover:bg-surface-container-lowest transition-all p-5 rounded-2xl flex items-center gap-6 ${
                  t.status === 'In Progress' ? 'border-l-4 border-secondary' : ''
                }`}
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
                <div className="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-transparent">check</span>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-on-surface">{t.taskName}</h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${categoryTag(t.category)}`}>{t.category}</span>
                    <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${pill.wrap}`}>
                    <div className={`w-2 h-2 rounded-full ${pill.dot}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${pill.text}`}>{t.status}</span>
                  </div>
                  <button type="button" className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <TaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={async () => {
          await fetchTasks();
        }}
      />

      <TaskModal
        open={editOpen}
        mode="update"
        task={editTask}
        onClose={() => setEditOpen(false)}
        onUpdated={async () => {
          await fetchTasks();
          window.dispatchEvent(new Event('sanctuary:tasks-changed'));
        }}
      />
    </div>
  );
};

export default Tasks;
