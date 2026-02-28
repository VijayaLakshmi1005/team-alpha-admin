import express from 'express';
import Gallery from '../models/Gallery.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfbr4ayuf',
    api_key: process.env.CLOUDINARY_API_KEY || '124874674819971',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'nqS2gUSlAOl3hDZy4wjwTqNQpIw'
});

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'team-alpha-gallery',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'mp4'],
    },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // multer-storage-cloudinary attaches 'path' as the Cloudinary URL
    const fileUrl = req.file.path;
    res.json({ url: fileUrl });
});

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

router.delete('/:id', async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

export default router;
