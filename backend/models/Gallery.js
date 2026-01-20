import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    albumName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
    isSelected: { type: Boolean, default: false },
    watermarkText: { type: String, default: 'Team Alpha Photography' },
    uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
