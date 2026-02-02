import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    albumName: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    category: { type: String, enum: ['Engagement', 'Wedding', 'Pre-wedding', 'Haldi', 'Reception', 'Other'], default: 'Wedding' },
    subCategory: { type: String }, // e.g., 'Candid', 'Traditional', 'Drone'
    tags: [{ type: String }],
    width: { type: Number },
    height: { type: Number },
    isFavorite: { type: Boolean, default: false },
    isSelected: { type: Boolean, default: false },
    watermarkText: { type: String, default: 'Team Alpha Photography' },
    uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

