import express from 'express';
import { getPhotographers, createPhotographer, deletePhotographer, updatePhotographer } from '../controllers/photographerController.js';

const router = express.Router();

router.get('/', getPhotographers);
router.post('/', createPhotographer);
router.delete('/:id', deletePhotographer);
router.patch('/:id', updatePhotographer);

export default router;
