import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../axiosConfig';

const CATEGORIES = ['Work', 'Personal', 'Study', 'Urgent'];
const STATUSES = ['To Do', 'In Progress', 'Done'];

const toDateInputValue = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const TaskModal = ({
  open,
  mode = 'create', // 'create' | 'update'
  task,
  onClose,
  onCreated,
  onUpdated,
}) => {
  const [form, setForm] = useState({
    taskName: '',
    category: 'Personal',
    startDate: '',
    dueDate: '',
    status: 'To Do',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    setError('');
    setSubmitting(false);

    if (mode === 'update' && task) {
      setForm({
        taskName: task.taskName || '',
        category: task.category || 'Personal',
        startDate: toDateInputValue(task.startDate),
        dueDate: toDateInputValue(task.dueDate),
        status: task.status || 'To Do',
      });
    } else {
      setForm({
        taskName: '',
        category: 'Personal',
        startDate: '',
        dueDate: '',
        status: 'To Do',
      });
    }
  }, [open, mode, task]);

  const canSubmit = useMemo(() => {
    const baseOk =
      form.taskName.trim().length > 0 &&
      !!form.category &&
      !!form.startDate &&
      !!form.dueDate;

    if (mode === 'update') {
      return baseOk && !!form.status;
    }

    return baseOk;
  }, [form, mode]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      if (mode === 'create') {
        const res = await axiosInstance.post('/api/tasks', {
          taskName: form.taskName.trim(),
          category: form.category,
          startDate: form.startDate,
          dueDate: form.dueDate,
        });
        await onCreated?.(res.data);
      } else {
        const taskId = task?._id;
        if (!taskId) throw new Error('Missing task id');
        const res = await axiosInstance.put(`/api/tasks/${taskId}`, {
          taskName: form.taskName.trim(),
          category: form.category,
          startDate: form.startDate,
          dueDate: form.dueDate,
          status: form.status,
        });
        await onUpdated?.(res.data);
      }
      onClose?.();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (mode === 'update' ? 'Failed to update task.' : 'Failed to create task.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Panel */}

      <div className="relative w-full max-w-xl rounded-[2rem] bg-white shadow-2xl border border-outline-variant/20 overflow-hidden">
        <div className="px-8 pt-7 pb-5 border-b border-surface-container-highest">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-headline text-2xl font-extrabold tracking-tight">
                {mode === 'update' ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                Add one item to your list. Required fields are marked.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-slate-600">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="px-8 py-6 space-y-5">
          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl">
              <p className="font-body text-sm text-error">{error}</p>
            </div>
          )}

          <div>
            <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
              Task Name <span className="text-error">*</span>
            </label>
            <input
              value={form.taskName}
              onChange={(e) => setForm((p) => ({ ...p, taskName: e.target.value }))}
              placeholder="e.g. Review design system documentation"
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl font-body text-on-surface placeholder-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                Category <span className="text-error">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                Start Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                Due Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {mode === 'update' && (
              <div>
                <label className="font-body text-xs font-semibold text-on-surface uppercase tracking-wider mb-2 block">
                  Status <span className="text-error">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
          {mode === 'update' && (
            <button
              type="button"
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete this task?")) {
                  setSubmitting(true);
                  try {
                    await axiosInstance.delete(`/api/tasks/${task._id}`);
                    await onUpdated?.(); // Refresh the list
                    onClose?.(); // Close the modal
                  } catch (err) {
                    setError("Failed to delete task.");
                  } finally {
                    setSubmitting(false);
                  }
                }
              }}
              className="px-5 py-3 rounded-full text-error hover:bg-error/10 transition-colors font-body font-semibold flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              Delete Task
            </button>
          )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors font-body font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="px-6 py-3 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-headline font-bold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (mode === 'update' ? 'Saving...' : 'Creating...') : mode === 'update' ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

