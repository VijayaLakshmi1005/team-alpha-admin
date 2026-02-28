import express from 'express';
import Gallery from '../models/Gallery.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const router = express.Router();

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
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
