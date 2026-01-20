import Photographer from '../models/Photographer.js';

export const getPhotographers = async (req, res) => {
    try {
        const photographers = await Photographer.find().sort({ createdAt: -1 });
        res.status(200).json(photographers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPhotographer = async (req, res) => {
    const photographer = req.body;
    const newPhotographer = new Photographer(photographer);
    try {
        await newPhotographer.save();
        res.status(201).json(newPhotographer);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deletePhotographer = async (req, res) => {
    const { id } = req.params;
    try {
        await Photographer.findByIdAndDelete(id);
        res.status(200).json({ message: "Photographer deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePhotographer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, specialty, status } = req.body;
    try {
        const updatedPhotographer = await Photographer.findByIdAndUpdate(id, { name, email, phone, specialty, status, _id: id }, { new: true });
        res.status(200).json(updatedPhotographer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
