const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  try {
    const { taskName, category, status, startDate, dueDate } = req.body;

    if (!taskName || !startDate || !dueDate) {
      return res.status(400).json({ message: 'taskName, startDate, and dueDate are required' });
    }

    const taskData = {
      taskName,
      category,
      startDate,
      dueDate,
      user: req.user._id,
    };

    // Status is optional during create; schema default will apply.
    if (status) taskData.status = status;

    const task = await Task.create(taskData);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { taskName, category, status, startDate, dueDate } = req.body;

    if (!taskName || !category || !status || !startDate || !dueDate) {
      return res.status(400).json({ message: 'taskName, category, status, startDate, and dueDate are required' });
    }

    if (taskName !== undefined) task.taskName = taskName;
    if (category !== undefined) task.category = category;
    if (status !== undefined) task.status = status;
    if (startDate !== undefined) task.startDate = startDate;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };

