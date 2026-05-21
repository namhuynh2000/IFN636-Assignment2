import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext.jsx';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (taskId) => {
    setConfirmDeleteId(taskId);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);

    try {
      await axiosInstance.delete(`/api/tasks/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task._id !== confirmDeleteId));
      showToast('Task deleted successfully.', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete task.', 'error');
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{task.title}</h2>
          <p>{task.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingTask(task)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:items-center sm:pb-0">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmDeleteId(null)} />
          <div className="relative w-full max-w-md rounded-[2rem] border border-outline-variant/60 bg-surface p-6 shadow-2xl">
            <p className="font-semibold text-on-surface">Confirm delete task</p>
            <p className="mt-3 text-sm text-on-surface-variant">
              Are you sure you want to delete this task? This cannot be undone.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="w-full sm:w-auto px-4 py-3 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors font-body font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="w-full sm:w-auto px-4 py-3 rounded-full bg-error text-white hover:bg-error/90 transition-colors font-body font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
