const Task = require('../models/Task');

const getHome = async (req, res) => {
  try {
    const userId = req.user._id;

    const [todoCount, inProgressCount, doneCount, upcomingTasks] = await Promise.all([
      Task.countDocuments({ user: userId, status: 'To Do' }),
      Task.countDocuments({ user: userId, status: 'In Progress' }),
      Task.countDocuments({ user: userId, status: 'Done' }),
      Task.find({ user: userId, status: 'To Do' })
        .sort({ dueDate: 1, createdAt: -1 })
        .limit(6)
        .select('_id taskName category status dueDate startDate'),
    ]);

    res.json({
      stats: {
        todo: todoCount,
        inProgress: inProgressCount,
        done: doneCount,
      },
      upcomingTasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load home data' });
  }
};

module.exports = { getHome };

