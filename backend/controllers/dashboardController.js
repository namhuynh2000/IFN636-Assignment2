const Task = require('../models/Task');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [todo, inProgress, done] = await Promise.all([
      Task.countDocuments({ user: userId, status: 'To Do' }),
      Task.countDocuments({ user: userId, status: 'In Progress' }),
      Task.countDocuments({ user: userId, status: 'Done' }),
    ]);

    const total = todo + inProgress + done;

    res.json({
      stats: {
        total,
        todo,
        inProgress,
        done,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};

module.exports = { getDashboard };

