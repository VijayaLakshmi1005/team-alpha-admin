import express from 'express';
import Lead from '../models/Lead.js';
import Task from '../models/Task.js';
import Photographer from '../models/Photographer.js';
// import { sendAssignmentEmail, sendReminderEmail } from '../utils/emailService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const leads = await Lead.find().populate('tasks');
    res.json(leads);
});

router.post('/', async (req, res) => {
    const lead = new Lead(req.body);
    await lead.save();
    res.json(lead);
});

// Task specific management
router.post('/:id/tasks', async (req, res) => {
    const task = new Task({ ...req.body, lead: req.params.id });
    await task.save();
    await Lead.findByIdAndUpdate(req.params.id, { $push: { tasks: task._id } });
    res.json(task);
});

// PATCH Lead
router.patch('/:id', async (req, res) => {
    try {
        const oldLead = await Lead.findById(req.params.id);
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // If people were updated, find new additions
        if (req.body.people && oldLead) {
            // Logic for checking changes in people assignment can stay if needed for logging, 
            // but we removed email sending as requested.
        }

        res.json(updatedLead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Remind Photographer
router.post('/:id/remind/:photographerName', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        const photographer = await Photographer.findOne({ name: req.params.photographerName });

        if (!lead || !photographer) {
            return res.status(404).json({ message: "Lead or Photographer not found" });
        }

        // Email service disabled by user request
        res.json({ message: "Reminder mocked (Email service invalid)" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Lead
router.delete('/:id', async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: "Lead deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
