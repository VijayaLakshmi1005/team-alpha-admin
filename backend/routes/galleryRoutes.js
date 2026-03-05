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
        resource_type: 'auto'
    },
});

const upload = multer({ storage });

router.post('/upload', (req, res, next) => {
    upload.single('file')(req, res, function (err) {
        if (err) {
            console.error("Multer upload error full details:", JSON.stringify(err, null, 2));
            return res.status(500).json({ error: err.message || JSON.stringify(err) || 'Upload failed' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // multer-storage-cloudinary attaches 'path' as the Cloudinary URL
        res.json({ url: req.file.path });
    });
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

router.patch('/:id/cover', async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        await Gallery.updateMany(
            { clientFolder: item.clientFolder, category: item.category },
            { $set: { isCover: false } }
        );

        item.isCover = true;
        await item.save();
        res.json({ message: 'Cover updated', item });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update cover' });
    }
});

router.patch('/rename-folder', async (req, res) => {
    const { oldName, newName } = req.body;
    try {
        const query = oldName === 'Default Client'
            ? { $or: [{ clientFolder: oldName }, { clientFolder: { $exists: false } }, { clientFolder: null }] }
            : { clientFolder: oldName };
        await Gallery.updateMany(query, { clientFolder: newName });
        res.json({ message: 'Folder renamed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to rename folder' });
    }
});

router.patch('/rename-category', async (req, res) => {
    const { clientFolder, oldCategory, newCategory } = req.body;
    try {
        const folderQuery = clientFolder === 'Default Client'
            ? { $in: ['Default Client', null] }
            : clientFolder;

        await Gallery.updateMany(
            { clientFolder: folderQuery, category: oldCategory },
            { category: newCategory }
        );
        res.json({ message: 'Category renamed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to rename category' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

router.delete('/folder/:folderName', async (req, res) => {
    try {
        const folderName = req.params.folderName;
        const query = folderName === 'Default Client'
            ? { $or: [{ clientFolder: folderName }, { clientFolder: { $exists: false } }, { clientFolder: null }] }
            : { clientFolder: folderName };
        await Gallery.deleteMany(query);
        res.json({ message: 'Folder deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete folder' });
    }
});

router.delete('/folder/:folderName/category/:categoryName', async (req, res) => {
    try {
        const { folderName, categoryName } = req.params;
        const folderQuery = folderName === 'Default Client'
            ? { $in: ['Default Client', null] }
            : folderName;

        await Gallery.deleteMany({ clientFolder: folderQuery, category: categoryName });
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
