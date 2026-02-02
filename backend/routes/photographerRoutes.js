import express from 'express';
import { getPhotographers, createPhotographer, deletePhotographer, updatePhotographer, getPhotographerWorks } from '../controllers/photographerController.js';

const router = express.Router();

router.get('/', getPhotographers);
router.post('/', createPhotographer);
router.delete('/:id', deletePhotographer);
router.patch('/:id', updatePhotographer);
router.get('/:name/works', getPhotographerWorks);

export default router;
