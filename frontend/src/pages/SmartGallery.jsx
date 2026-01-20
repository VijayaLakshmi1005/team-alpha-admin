import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Star, ChevronDown, Image as ImageIcon, Plus, CheckCircle2, SlidersHorizontal, Grid3X3, Maximize2 } from "lucide-react";

const albums = ["The Grand Wedding 2025", "Pre-Wedding: Anaya & Rahul", "Reception: The Oberoi"];

export default function SmartGallery() {
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or masonry (demo)

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/gallery");
      setGalleryItems(response.data);
      const favs = new Set(response.data.filter(item => item.isFavorite).map(item => item._id));
      setFavorites(favs);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch gallery", err);
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);
  };

  return (
    <div className="space-y-8 md:space-y-12 text-charcoal px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl">Smart Gallery</h1>
          <p className="text-[10px] md:text-xs text-warmgray mt-3 font-bold uppercase tracking-[0.4em]">Curating high-resolution legacies.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-3 border border-[#e6e3df] bg-white px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-ivory transition-all shadow-sm active:scale-95">
            <Plus size={18} />
            Create Album
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-charcoal text-white px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-mutedbrown transition-all shadow-xl active:scale-95">
            <Upload size={18} />
            Upload
          </button>
        </div>
      </div>

      {/* Album Selector & Tools */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-[#e6e3df]">
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="relative group cursor-pointer w-full sm:w-auto">
            <div className="flex items-center gap-3 text-sm font-medium bg-white px-6 py-3 rounded-2xl border border-ivory">
              <span className="text-warmgray font-bold uppercase tracking-widest text-[10px]">Album</span>
              <span className="font-serif text-lg md:text-xl truncate">{selectedAlbum}</span>
              <ChevronDown size={14} className="text-warmgray group-hover:text-charcoal transition-transform group-hover:rotate-180" />
            </div>
          </div>
          <div className="hidden sm:block h-8 w-[1px] bg-[#e6e3df]"></div>
          <div className="flex gap-8 md:gap-10 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
            {['All Photos', 'Favorites', 'Selected'].map((tab) => (
              <button key={tab} className={`text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all relative ${tab === 'All Photos' ? 'text-charcoal' : 'text-warmgray hover:text-charcoal'
                }`}>
                {tab}
                {tab === 'All Photos' && <div className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-[2px] bg-charcoal"></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex bg-white border border-ivory p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-charcoal text-white shadow-md' : 'text-warmgray'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'masonry' ? 'bg-charcoal text-white shadow-md' : 'text-warmgray'}`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-warmgray bg-ivory/50 px-5 py-2.5 rounded-full">
            {galleryItems.length || 8} Captures
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
        {(galleryItems.length > 0 ? galleryItems : [1, 2, 3, 4, 5, 6, 7, 8]).map((item, idx) => {
          const id = item._id || idx;
          const isFav = favorites.has(id);
          const sig = idx + 1;

          return (
            <div key={id} className="group relative aspect-[4/5] bg-white rounded-[2rem] overflow-hidden border border-ivory shadow-sm transition-all duration-700 hover:shadow-2xl hover:-translate-y-3">
              <div className="absolute inset-0 bg-warmgray/5" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-8 z-20">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold opacity-80">{String(sig).padStart(2, '0')}</span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(id)}
                    className={`${isFav ? 'text-[#FFD700]' : 'text-white'} hover:scale-125 transition-transform drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                  >
                    <Star size={24} fill={isFav ? "currentColor" : "none"} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/90 truncate">ALPHA_DSLR_{9800 + sig}.RAW</p>
                    <div className="flex justify-between mt-2 text-[8px] uppercase tracking-widest text-white/60 font-medium">
                      <span>45.2 MB</span>
                      <span>8256 x 5504</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white text-charcoal py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-gold hover:text-white transition-all">
                      <Maximize2 size={12} /> View
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center border border-white/30 rounded-xl hover:bg-white/20 transition-all">
                      <CheckCircle2 size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Image with Layered Effects */}
              <div className="w-full h-full relative">
                <img
                  src={item.imageUrl || `https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800&h=1000&sig=${sig}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt="Gallery Item"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Tooling Footer */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-8 border border-ivory shadow-sm relative overflow-hidden group/footer">
        <div className="absolute top-0 left-0 w-full h-full bg-ivory/10 opacity-0 group-hover/footer:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left relative z-10 transition-transform group-hover/footer:translate-x-2">
          <div className="w-20 h-20 bg-ivory rounded-3xl flex items-center justify-center text-mutedbrown border border-ivory shadow-inner">
            <ImageIcon size={32} strokeWidth={1} />
          </div>
          <div>
            <p className="text-xs font-bold text-charcoal shadow-sm uppercase tracking-[0.3em]">Registry Watermarking</p>
            <p className="text-xs mt-2 text-warmgray/80 font-medium leading-relaxed">Applying <span className="text-mutedbrown">@teamalpha_crew</span> digital protection strictly to all client previews.</p>
          </div>
        </div>
        <div className="flex gap-4 w-full lg:w-auto relative z-10">
          <button className="flex-1 lg:flex-none text-[10px] font-bold uppercase tracking-widest text-mutedbrown border border-ivory px-8 py-4 rounded-full bg-white hover:bg-ivory transition-all shadow-sm">
            Adjust Security
          </button>
          <button className="flex-1 lg:flex-none text-[10px] font-bold uppercase tracking-widest bg-charcoal text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-mutedbrown transition-all">
            Global Publish
          </button>
        </div>
      </div>
    </div>
  );
}
