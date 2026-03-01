import express from 'express';
import Event from '../models/Event.js';
import { sendEventNotification } from '../services/ReminderService.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ start: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new event
router.post('/', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();

        // Trigger real time email notification to assigned photographers
        if (event.teamMembers && event.teamMembers.length > 0) {
            sendEventNotification(event, event.teamMembers);
        }

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update event
router.patch('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Trigger real time email notification to newly assigned photographers
        if (event && req.body.teamMembers) {
            sendEventNotification(event, req.body.teamMembers);
        }

        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete event
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
