import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Star, ChevronDown, Image as ImageIcon, Plus, CheckCircle2, SlidersHorizontal, Grid3X3, Maximize2, Download, X, Share2, Heart } from "lucide-react";

// Extended Mock Data for Rich Visuals
const MOCK_GALLERY = [
  // Wedding (Varied Ratios)
  { _id: 'w1', type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600', title: 'The Vows', aspect: 'tall' },
  { _id: 'w2', type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=600', title: 'Just Married', aspect: 'portrait' },
  { _id: 'w3', type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600', title: 'Floral Details', aspect: 'square' },
  { _id: 'w4', type: 'video', category: 'Wedding', url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-holding-hands-sunset-1115-large.mp4', title: 'Sunset Walk', aspect: 'video' },
  { _id: 'w5', type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600', title: 'Bridesmaids', aspect: 'landscape' },

  // Haldi (Vibrant, Yellows)
  { _id: 'h1', type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=600', title: 'Haldi Splash', aspect: 'portrait' },
  { _id: 'h2', type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1605218457332-9cb1277a6277?q=80&w=600', title: 'Yellow Hues', aspect: 'square' },
  { _id: 'h3', type: 'video', category: 'Haldi', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-getting-ready-for-her-wedding-4017-large.mp4', title: 'Getting Ready', aspect: 'vertical' },
  { _id: 'h4', type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?q=80&w=600', title: 'Laughter', aspect: 'tall' },

  // Pre-wedding (Cinematic, Outdoor)
  { _id: 'p1', type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600', title: 'The Ring', aspect: 'square' },
  { _id: 'p2', type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1522673607200-1645062cd95c?q=80&w=600', title: 'Mountain Love', aspect: 'landscape' },
  { _id: 'p3', type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600', title: 'Runaway', aspect: 'portrait' },
  { _id: 'p4', type: 'video', category: 'Pre-wedding', url: 'https://assets.mixkit.co/videos/preview/mixkit-couple-walking-through-a-field-of-wheat-1123-large.mp4', title: 'Field Walk', aspect: 'video' },

  // Engagement (Intimate, Classy)
  { _id: 'e1', type: 'image', category: 'Engagement', url: 'https://images.unsplash.com/photo-1519225448526-0cb85b511856?q=80&w=600', title: 'Engagement Party', aspect: 'landscape' },
  { _id: 'e2', type: 'image', category: 'Engagement', url: 'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?q=80&w=600', title: 'She Said Yes', aspect: 'portrait' },
  { _id: 'e3', type: 'image', category: 'Engagement', url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=600', title: 'The Look', aspect: 'square' },

  // Reception (Evening, Lights)
  { _id: 'r1', type: 'image', category: 'Reception', url: 'https://images.unsplash.com/photo-1537237236952-bfab563e536d?q=80&w=600', title: 'First Dance', aspect: 'portrait' },
  { _id: 'r2', type: 'image', category: 'Reception', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600', title: 'Party Vibes', aspect: 'landscape' },
  { _id: 'r3', type: 'video', category: 'Reception', url: 'https://assets.mixkit.co/videos/preview/mixkit-fireworks-illuminating-the-beach-at-night-4155-large.mp4', title: 'Celebration', aspect: 'video' },

  // More Wedding & Traditional (Ceremony, Details)
  { _id: 'w6', type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1595057039535-c3c139c89417?q=80&w=600', title: 'Mandap Rituals', aspect: 'landscape' },
  { _id: 'w7', type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=600', title: 'The Gaze', aspect: 'portrait' },
  { _id: 'w8', type: 'video', category: 'Wedding', url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-bride-posing-for-photos-4160-large.mp4', title: 'Bridal Portrait', aspect: 'vertical' },

  // More Haldi & Fun
  { _id: 'h5', type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1627916124707-8e624c489728?q=80&w=600', title: 'Flower Shower', aspect: 'square' },
  { _id: 'h6', type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1631165147575-dcd7b6d19472?q=80&w=600', title: 'Joyful Moments', aspect: 'portrait' },

  // More Engagement
  { _id: 'e4', type: 'image', category: 'Engagement', url: 'https://images.unsplash.com/photo-1605218764020-dca7a421dcb6?q=80&w=600', title: 'Hand in Hand', aspect: 'landscape' },
  { _id: 'e5', type: 'video', category: 'Engagement', url: 'https://assets.mixkit.co/videos/preview/mixkit-man-proposing-to-woman-on-a-bridge-4165-large.mp4', title: 'The Proposal', aspect: 'video' },

  // More Pre-Wedding
  { _id: 'p5', type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=600', title: 'Urban Love', aspect: 'tall' },
  { _id: 'p6', type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1542038784456-1ea0e93ca370?q=80&w=600', title: 'Golden Hour', aspect: 'square' },
];

const CATEGORIES = ["All", "Wedding", "Engagement", "Pre-wedding", "Haldi", "Reception"];

export default function SmartGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [galleryItems, setGalleryItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('masonry'); // 'grid' | 'masonry'
  const [lightboxItem, setLightboxItem] = useState(null);

  const [showWatermark, setShowWatermark] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/gallery");
      if (response.data && response.data.length > 0) {
        setGalleryItems(response.data);
        const favs = new Set(response.data.filter(item => item.isFavorite).map(item => item._id));
        setFavorites(favs);
      } else {
        setGalleryItems(MOCK_GALLERY); // Fallback to mock for demo
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch gallery, utilizing local mock", err);
      setGalleryItems(MOCK_GALLERY);
      setLoading(false);
    }
  };

  const toggleFavorite = async (id, e) => {
    e?.stopPropagation();
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);

    // Optimistic UI, silent API call
    try {
      await axios.patch(`http://localhost:5000/api/gallery/${id}/favorite`);
    } catch (err) { /* ignore */ }
  };

  const downloadItem = (url, e) => {
    e?.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Alpha_Gallery_Asset';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = galleryItems.filter(item => {
    if (activeCategory === "All") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-8 md:space-y-12 text-charcoal px-4 md:px-0 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl">Smart Gallery</h1>
          <p className="text-[10px] md:text-xs text-warmgray mt-3 font-bold uppercase tracking-[0.4em]">Curating high-resolution legacies.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-3 border border-[#e6e3df] bg-white px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-ivory transition-all shadow-sm active:scale-95">
            <Plus size={18} />
            New Album
          </button>
          <button onClick={() => setShowUploadForm(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-charcoal text-white px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-mutedbrown transition-all shadow-xl active:scale-95">
            <Upload size={18} />
            Upload Media
          </button>
        </div>
      </div>

      {showUploadForm && (
        <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-ivory pb-4">
              <h3 className="font-serif text-2xl text-charcoal">Add New Media</h3>
              <button onClick={() => setShowUploadForm(false)} className="p-2 hover:bg-ivory rounded-full text-warmgray hover:text-charcoal"><X size={20} /></button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              let rawUrl = formData.get('url');

              // Auto-convert Google Drive links to direct view URLs
              const driveRegex = /file\/d\/([a-zA-Z0-9_-]+)/;
              const match = rawUrl.match(driveRegex);
              if (match && match[1]) {
                rawUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
              }

              const selectedCategory = formData.get('category') || 'Gallery';
              const generatedTitle = `${selectedCategory} Moment`;

              const payload = {
                title: generatedTitle,
                albumName: generatedTitle,
                url: rawUrl,
                category: selectedCategory,
                type: formData.get('type')
              };

              try {
                const res = await axios.post("http://localhost:5000/api/gallery", payload);
                setGalleryItems([res.data, ...galleryItems]);
                setShowUploadForm(false);
              } catch (err) {
                console.error(err);
              }
            }} className="space-y-6">



              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Direct Asset URL</label>
                <input name="url" required placeholder="https://..." className="w-full bg-ivory/40 border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-mutedbrown" />
                <p className="text-[9px] text-warmgray italic">Paste a direct link to the image or video file.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Category</label>
                  <select name="category" className="w-full bg-ivory/40 border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-mutedbrown appearance-none">
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Type</label>
                  <select name="type" className="w-full bg-ivory/40 border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-mutedbrown appearance-none">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <button className="w-full bg-charcoal text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-mutedbrown transition-all shadow-xl">
                Add to Gallery
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="sticky top-20 z-30 bg-ivory/80 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 border-b border-[#e6e3df]/50 flex flex-col lg:flex-row items-center justify-between gap-6 transition-all">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat
                ? 'bg-charcoal text-white border-charcoal shadow-lg shadow-charcoal/20'
                : 'bg-white text-warmgray border-ivory hover:border-[#e6e3df] hover:text-charcoal'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
          <div className="flex bg-white border border-ivory p-1 rounded-xl">
            <button
              onClick={() => setShowWatermark(!showWatermark)}
              className={`p-2 rounded-lg transition-all ${showWatermark ? 'bg-charcoal text-white shadow-md' : 'text-warmgray hover:bg-ivory'}`}
              title="Toggle Watermark"
            >
              <span className="font-serif font-bold text-xs px-1">W</span>
            </button>
            <div className="w-px bg-ivory/80 h-6 mx-1"></div>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-charcoal text-white shadow-md' : 'text-warmgray hover:bg-ivory'}`}
              title="Grid View"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'masonry' ? 'bg-charcoal text-white shadow-md' : 'text-warmgray hover:bg-ivory'}`}
              title="Masonry View (Original Aspect Ratios)"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-warmgray bg-white border border-ivory px-5 py-2.5 rounded-full shadow-sm">
            {filteredItems.length} Moments
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className={`min-h-[50vh] ${viewMode === 'masonry' ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
        {filteredItems.map((item, idx) => {
          const id = item._id || idx;
          const isFav = favorites.has(id);
          const isVideo = item.type === 'video';

          return (
            <div
              key={id}
              className={`group relative bg-white rounded-3xl overflow-hidden border border-ivory/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer break-inside-avoid ${viewMode === 'grid' ? 'aspect-4/5' : 'mb-6'}`}
              onClick={() => setLightboxItem(item)}
            >
              {/* Media */}
              <div className="w-full h-full relative">
                {isVideo ? (
                  <video
                    src={item.url}
                    className="w-full h-auto object-cover block"
                    muted
                    loop
                    onMouseOver={e => e.target.play()}
                    onMouseOut={e => e.target.pause()}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.albumName || "Gallery Image"}
                    className="w-full h-auto object-cover block query-target"
                    loading="lazy"
                  />
                )}

                {/* Watermark Overlay */}
                {showWatermark && !isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <div className="font-serif text-white text-2xl md:text-3xl font-bold tracking-widest rotate-[-15deg] drop-shadow-lg border-4 border-white px-8 py-2">
                      STUDIO ALPHA
                    </div>
                  </div>
                )}

                {/* Video Indicator */}
                {isVideo && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-0.5"></div>
                  </div>
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-serif text-lg">{item.title || "Wedding Moment"}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => toggleFavorite(id, e)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${isFav ? 'bg-white/20 border-gold/50 text-gold' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                      >
                        <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={(e) => downloadItem(item.url, e)}
                        className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-white hover:text-charcoal transition-all"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                      {item.category || "General"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center opacity-50">
          <ImageIcon size={48} className="text-warmgray mb-4" strokeWidth={1} />
          <p className="font-serif text-xl text-warmgray">No moments found in {activeCategory}.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-100 bg-charcoal/95 backdrop-blur-xl animate-in fade-in duration-200 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
          >
            <X size={32} strokeWidth={1} />
          </button>

          <div className="w-full max-w-6xl max-h-[90vh] flex flex-col items-center">
            {lightboxItem.type === 'video' ? (
              <video
                src={lightboxItem.url}
                controls
                autoPlay
                className="max-h-[80vh] w-auto rounded-lg shadow-2xl"
              />
            ) : (
              <img
                src={lightboxItem.url}
                className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
                alt="Full view"
              />
            )}

            <div className="mt-8 flex items-center gap-6">
              <button
                onClick={() => toggleFavorite(lightboxItem._id)}
                className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors"
              >
                <Heart size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Favorite</span>
              </button>
              <div className="h-4 w-px bg-white/20"></div>
              <button
                onClick={() => downloadItem(lightboxItem.url)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Download size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Download Original</span>
              </button>
              <div className="h-4 w-px bg-white/20"></div>
              <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Share2 size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
