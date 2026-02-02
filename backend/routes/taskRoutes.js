import express from 'express';
import Task from '../models/Task.js';
import Lead from '../models/Lead.js';

const router = express.Router();

// GET all tasks (global)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('lead').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a global task (no lead)
router.post('/', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH update task (status or title)
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (req.body.title !== undefined) {
            task.title = req.body.title;
        } else {
            // Default behavior if no title provided: toggle status
            task.status = task.status === 'completed' ? 'pending' : 'completed';
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (task && task.lead) {
            await Lead.findByIdAndUpdate(task.lead, { $pull: { tasks: req.params.id } });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
