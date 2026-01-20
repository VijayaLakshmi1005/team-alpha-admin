import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const events = await Event.find().sort({ start: 1 });
    res.json(events);
});

router.post('/', async (req, res) => {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
});

export default router;
