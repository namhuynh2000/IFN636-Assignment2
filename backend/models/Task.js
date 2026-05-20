const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: { 
        type: String, 
        required: true,
        trim: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: ['Work', 'Personal', 'Study', 'Urgent'], 
        default: 'Personal'
    },
    status: {
        type: String,
        required: true,
        // These are your radio choices
        enum: ['To Do', 'In Progress', 'Done'],
        // This ensures every new task starts as 'To Do' automatically
        default: 'To Do'
    },
    startDate: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    dueDate: { 
        type: Date, 
        required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Force collection name to be exactly `task` (per assignment requirement).
module.exports = mongoose.model('Task', taskSchema, 'task');