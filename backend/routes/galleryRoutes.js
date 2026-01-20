import express from 'express';
import Gallery from '../models/Gallery.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const items = await Gallery.find().sort({ uploadedAt: -1 });
    res.json(items);
});

router.post('/', async (req, res) => {
    const item = new Gallery(req.body);
    await item.save();
    res.json(item);
});

router.patch('/:id/favorite', async (req, res) => {
    const item = await Gallery.findById(req.params.id);
    item.isFavorite = !item.isFavorite;
    await item.save();
    res.json(item);
});

router.patch('/:id/select', async (req, res) => {
    const item = await Gallery.findById(req.params.id);
    item.isSelected = !item.isSelected;
    await item.save();
    res.json(item);
});

export default router;
