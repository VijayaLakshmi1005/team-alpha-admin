import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gallery from './models/Gallery.js';

dotenv.config();

const MOCK_GALLERY = [
    // Wedding (Varied Ratios)
    { type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600', albumName: 'The Vows' },
    { type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=600', albumName: 'Just Married' },
    { type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600', albumName: 'Floral Details' },
    { type: 'video', category: 'Wedding', url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-holding-hands-sunset-1115-large.mp4', albumName: 'Sunset Walk' },
    { type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600', albumName: 'Bridesmaids' },

    // Haldi (Vibrant, Yellows)
    { type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=600', albumName: 'Haldi Splash' },
    { type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1605218457332-9cb1277a6277?q=80&w=600', albumName: 'Yellow Hues' },
    { type: 'video', category: 'Haldi', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-getting-ready-for-her-wedding-4017-large.mp4', albumName: 'Getting Ready' },
    { type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?q=80&w=600', albumName: 'Laughter' },

    // Pre-wedding (Cinematic, Outdoor)
    { type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600', albumName: 'The Ring' },
    { type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1522673607200-1645062cd95c?q=80&w=600', albumName: 'Mountain Love' },
    { type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600', albumName: 'Runaway' },
    { type: 'video', category: 'Pre-wedding', url: 'https://assets.mixkit.co/videos/preview/mixkit-couple-walking-through-a-field-of-wheat-1123-large.mp4', albumName: 'Field Walk' },

    // Engagement (Intimate, Classy)
    { type: 'image', category: 'Engagement', url: 'https://images.unsplash.com/photo-1519225448526-0cb85b511856?q=80&w=600', albumName: 'Engagement Party' },
    { type: 'image', category: 'Engagement', url: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?q=80&w=600', albumName: 'She Said Yes' },
    { type: 'image', category: 'Engagement', url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=600', albumName: 'The Look' },

    // Reception (Evening, Lights)
    { type: 'image', category: 'Reception', url: 'https://images.unsplash.com/photo-1537237236952-bfab563e536d?q=80&w=600', albumName: 'First Dance' },
    { type: 'image', category: 'Reception', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600', albumName: 'Party Vibes' },
    { type: 'video', category: 'Reception', url: 'https://assets.mixkit.co/videos/preview/mixkit-fireworks-illuminating-the-beach-at-night-4155-large.mp4', albumName: 'Celebration' },

    // More Wedding & Traditional (Ceremony, Details)
    { type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1595057039535-c3c139c89417?q=80&w=600', albumName: 'Mandap Rituals' },
    { type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=600', albumName: 'The Gaze' },
    { type: 'video', category: 'Wedding', url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-bride-posing-for-photos-4160-large.mp4', albumName: 'Bridal Portrait' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        await Gallery.deleteMany({});
        console.log('Cleared existing gallery (Ready for Manual Uploads)');

        // await Gallery.insertMany(MOCK_GALLERY);
        // console.log('Seeded gallery with mock data');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
