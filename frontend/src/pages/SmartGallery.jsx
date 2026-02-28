import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Star, ChevronDown, Image as ImageIcon, Plus, CheckCircle2, SlidersHorizontal, Grid3X3, Maximize2, Download, X, Share2, Heart, Folder, ChevronRight, FolderPlus, Trash2 } from "lucide-react";

// Extended Mock Data for Rich Visuals
const MOCK_GALLERY = [
  // John & Doe Wedding
  { _id: 'w1', clientFolder: 'John & Doe', type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600', title: 'The Vows', aspect: 'tall' },
  { _id: 'w2', clientFolder: 'John & Doe', type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=600', title: 'Just Married', aspect: 'portrait' },
  { _id: 'h1', clientFolder: 'John & Doe', type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=600', title: 'Haldi Splash', aspect: 'portrait' },

  // Kunal & Priya Pre-wedding
  { _id: 'p1', clientFolder: 'Kunal & Priya', type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600', title: 'The Ring', aspect: 'square' },
  { _id: 'p2', clientFolder: 'Kunal & Priya', type: 'image', category: 'Pre-wedding', url: 'https://images.unsplash.com/photo-1522673607200-1645062cd95c?q=80&w=600', title: 'Mountain Love', aspect: 'landscape' },
  { _id: 'e1', clientFolder: 'Kunal & Priya', type: 'image', category: 'Engagement', url: 'https://images.unsplash.com/photo-1519225448526-0cb85b511856?q=80&w=600', title: 'Engagement Party', aspect: 'landscape' },

  // Generic mocks mapped to Default Client
  { _id: 'w3', clientFolder: 'Default Client', type: 'image', category: 'Wedding', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600', title: 'Floral Details', aspect: 'square' },
  { _id: 'w4', clientFolder: 'Default Client', type: 'video', category: 'Wedding', url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-holding-hands-sunset-1115-large.mp4', title: 'Sunset Walk', aspect: 'video' },
  { _id: 'h2', clientFolder: 'Default Client', type: 'image', category: 'Haldi', url: 'https://images.unsplash.com/photo-1605218457332-9cb1277a6277?q=80&w=600', title: 'Yellow Hues', aspect: 'square' },
];

const CATEGORIES = ["Wedding", "Engagement", "Pre-wedding", "Haldi", "Reception", "Other"];

export default function SmartGallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('masonry');
  const [lightboxItem, setLightboxItem] = useState(null);

  // Folder navigation state
  const [activeClientFolder, setActiveClientFolder] = useState(null);
  const [activeEventFolder, setActiveEventFolder] = useState(null);

  const [showUploadForm, setShowUploadForm] = useState(false);

  // Upload Form State
  const [selectedType, setSelectedType] = useState("Image"); // "Image", "Video", "Drive Link"
  const [uploadFile, setUploadFile] = useState(null);
  const [driveUrl, setDriveUrl] = useState("");

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
        setGalleryItems(MOCK_GALLERY);
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

  const deleteItem = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this asset?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/gallery/${id}`);
      setGalleryItems(prev => prev.filter(item => item._id !== id));
      if (lightboxItem?._id === id) setLightboxItem(null);
      toast.success("Asset deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete asset.");
    }
  };

  const submitUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newClientFolder = formData.get('newClientFolder');
    const clientFolderSelect = formData.get('clientFolderSelect');
    const clientFolder = newClientFolder ? newClientFolder.trim() : (clientFolderSelect || 'Default Client');
    const category = formData.get('category') || 'Wedding';
    const generatedTitle = `${clientFolder} - ${category} Moment`;

    if (!uploadFile) return toast.error("Please explicitly select a media file or a cover photo.");

    // type mappings
    const typeMapping = { 'Image': 'image', 'Video': 'video', 'Drive Link': 'drive' };
    const type = typeMapping[selectedType];

    let finalUrl = "";
    try {
      const fileData = new FormData();
      fileData.append("file", uploadFile);
      const res = await axios.post("http://localhost:5000/api/gallery/upload", fileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      finalUrl = res.data.url;
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload the file to our server");
      setLoading(false);
      return;
    }

    const payload = {
      title: generatedTitle,
      albumName: generatedTitle,
      clientFolder,
      url: finalUrl,
      category,
      type,
      link: selectedType === 'Drive Link' ? driveUrl : undefined
    };

    try {
      const res = await axios.post("http://localhost:5000/api/gallery", payload);
      setGalleryItems([res.data, ...galleryItems]);
      setShowUploadForm(false);
      setUploadFile(null);
      setDriveUrl("");
      toast.success("Successfully added to the gallery!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save gallery item.");
    }
  };

  // Derive Client Folders
  const clientFolders = [...new Set(galleryItems.map(item => item.clientFolder || 'Default Client'))];

  // Derive Event Folders for Active Client
  const itemsForActiveClient = galleryItems.filter(item => (item.clientFolder || 'Default Client') === activeClientFolder);
  const eventFolders = [...new Set(itemsForActiveClient.map(item => item.category || 'Other'))];

  // Final Media to show
  const filteredItems = itemsForActiveClient.filter(item => item.category === activeEventFolder);

  return (
    <div className="space-y-8 md:space-y-12 text-charcoal px-4 md:px-0 pb-20 mt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl">Smart Gallery</h1>
          <p className="text-[10px] md:text-xs text-warmgray mt-3 font-bold uppercase tracking-[0.4em]">Organized Client Folders</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={() => setShowUploadForm(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-charcoal text-white px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-mutedbrown transition-all shadow-xl active:scale-95">
            <Upload size={18} />
            Upload Media
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-3 text-sm text-warmgray font-medium">
        <span className="cursor-pointer hover:text-charcoal transition-colors" onClick={() => { setActiveClientFolder(null); setActiveEventFolder(null); }}>Gallery</span>
        {activeClientFolder && (
          <>
            <ChevronRight size={16} />
            <span className="cursor-pointer hover:text-charcoal transition-colors" onClick={() => setActiveEventFolder(null)}>{activeClientFolder}</span>
          </>
        )}
        {activeEventFolder && (
          <>
            <ChevronRight size={16} />
            <span className="text-charcoal">{activeEventFolder}</span>
          </>
        )}
      </div>

      {showUploadForm && (
        <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-ivory pb-4">
              <h3 className="font-serif text-2xl text-charcoal">Upload Media</h3>
              <button type="button" onClick={() => setShowUploadForm(false)} className="p-2 hover:bg-ivory rounded-full text-warmgray hover:text-charcoal"><X size={20} /></button>
            </div>

            <form onSubmit={submitUpload} className="space-y-6">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Client Folder</label>
                  <select name="clientFolderSelect" defaultValue={activeClientFolder || clientFolders[0]} className="w-full bg-ivory/40 border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-mutedbrown appearance-none custom-select">
                    {clientFolders.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" name="newClientFolder" placeholder="Or type new client name..." className="w-full mt-2 bg-white border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-mutedbrown" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Event Category</label>
                  <select name="category" defaultValue={activeEventFolder || CATEGORIES[0]} className="w-full bg-ivory/40 border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-mutedbrown appearance-none custom-select">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Asset Type</label>
                <div className="flex gap-4 mb-4">
                  {['Image', 'Video', 'Drive Link'].map((assetType) => (
                    <label key={assetType} className={`flex-1 flex gap-2 items-center justify-center p-3 rounded-xl border text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors ${selectedType === assetType ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-warmgray border-[#e6e3df] hover:border-charcoal'}`}>
                      <input type="radio" name="mediaType" value={assetType} className="hidden" checked={selectedType === assetType} onChange={() => setSelectedType(assetType)} />
                      {assetType}
                    </label>
                  ))}
                </div>
              </div>

              {selectedType === 'Drive Link' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Google Drive Folder/Shared Link</label>
                    <input type="url" required value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full bg-ivory/40 border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-mutedbrown" />
                    <p className="text-[9px] text-warmgray italic">Paste a shareable Google Drive link for this collection.</p>
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Upload Cover Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files[0])} required className="w-full bg-white border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-mutedbrown file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-charcoal file:text-white" />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Select {selectedType}</label>
                  <input type="file" accept={selectedType === 'Video' ? "video/*" : "image/*"} onChange={(e) => setUploadFile(e.target.files[0])} required className="w-full bg-white border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-mutedbrown file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-charcoal file:text-white" />
                </div>
              )}

              <button type="submit" className="w-full bg-charcoal text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-mutedbrown transition-all shadow-xl">
                Add to Folder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Control Bar Removed as requested */}

      {/* LEVEL 1: Client Folders */}
      {!activeClientFolder && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clientFolders.map(client => {
            const itemsCount = galleryItems.filter(i => (i.clientFolder || 'Default Client') === client).length;
            return (
              <div key={client} onClick={() => setActiveClientFolder(client)} className="group bg-white p-6 rounded-3xl border border-ivory/50 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 flex flex-col gap-4">
                <div className="w-16 h-16 bg-ivory rounded-2xl flex items-center justify-center text-charcoal group-hover:bg-charcoal group-hover:text-white transition-colors">
                  <Folder size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-1">{client}</h3>
                  <p className="text-xs text-warmgray font-medium uppercase tracking-widest">{itemsCount} Moments</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LEVEL 2: Event Folders */}
      {activeClientFolder && !activeEventFolder && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {eventFolders.map(event => {
            const itemsCount = itemsForActiveClient.filter(i => i.category === event).length;
            return (
              <div key={event} onClick={() => setActiveEventFolder(event)} className="group bg-white p-6 rounded-3xl border border-ivory/50 shadow-sm hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 flex flex-col gap-4">
                <div className="w-16 h-16 bg-ivory/50 rounded-2xl flex items-center justify-center text-charcoal group-hover:bg-charcoal group-hover:text-white transition-colors">
                  <FolderPlus size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-1">{event}</h3>
                  <p className="text-xs text-warmgray font-medium uppercase tracking-widest">{itemsCount} Assets</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LEVEL 3: Media Grid */}
      {activeClientFolder && activeEventFolder && (
        <div className={`min-h-[50vh] ${viewMode === 'masonry' ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
          {filteredItems.map((item, idx) => {
            const id = item._id || idx;
            const isFav = favorites.has(id);
            const isVideo = item.type === 'video';

            return (
              <div key={id} className={`group relative bg-white rounded-3xl overflow-hidden border border-ivory/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer break-inside-avoid ${viewMode === 'grid' ? 'aspect-4/5' : 'mb-6'}`} onClick={() => item.type === 'drive' ? window.open(item.link || item.url, '_blank') : setLightboxItem(item)}>
                <div className="w-full h-full relative">
                  {isVideo ? (
                    <video src={item.url} className="w-full h-auto object-cover block" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.albumName || "Gallery"}
                      className="w-full h-auto min-h-[240px] bg-gray-50 object-cover block query-target"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"; // Fallback aesthetic cover
                      }}
                    />
                  )}

                  {isVideo && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-0.5"></div>
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  {item.type === 'drive' && (
                    <div className="absolute top-4 left-4 bg-[#1aa0a0]/90 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1">
                      <Folder size={12} /> Drive Access
                    </div>
                  )}
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-serif text-lg">{item.title || "Wedding Moment"}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <button onClick={(e) => toggleFavorite(id, e)} className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${isFav ? 'bg-white/20 border-gold/50 text-gold' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
                          <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                        </button>
                        {item.type === 'drive' ? (
                          <button onClick={(e) => { e.stopPropagation(); window.open(item.link || item.url, '_blank') }} className="px-4 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-[#1aa0a0] hover:border-[#1aa0a0] transition-all text-xs font-bold tracking-widest">
                            <Share2 size={16} className="mr-2" /> Open Drive
                          </button>
                        ) : (
                          <button onClick={(e) => downloadItem(item.url, e)} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-white hover:text-charcoal transition-all">
                            <Download size={16} />
                          </button>
                        )}
                        <button onClick={(e) => deleteItem(id, e)} className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-red-500 hover:border-red-500 hover:text-white transition-all ml-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State for Media */}
      {activeClientFolder && activeEventFolder && filteredItems.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center opacity-50">
          <ImageIcon size={48} className="text-warmgray mb-4" strokeWidth={1} />
          <p className="font-serif text-xl text-warmgray">No media found in {activeEventFolder}. Upload some!</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-100 bg-charcoal/95 backdrop-blur-xl animate-in fade-in duration-200 flex items-center justify-center p-4">
          <button onClick={() => setLightboxItem(null)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2">
            <X size={32} strokeWidth={1} />
          </button>
          <div className="w-full max-w-6xl max-h-[90vh] flex flex-col items-center">
            {lightboxItem.type === 'video' ? (
              <video src={lightboxItem.url} controls autoPlay className="max-h-[80vh] w-auto rounded-lg shadow-2xl" />
            ) : lightboxItem.type === 'drive' ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl border border-white/20 backdrop-blur-md text-center max-w-lg mb-8">
                <Folder size={64} className="text-gold mb-6" strokeWidth={1} />
                <h3 className="font-serif text-3xl text-white mb-2">{lightboxItem.title || "Google Drive Collection"}</h3>
                <p className="text-white/60 text-sm mb-8">This is an external Drive Link containing high-resolution assets.</p>
                <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/20 animate-pulse">
                  <p className="text-xs text-white uppercase tracking-widest font-bold flex items-center gap-3">
                    Click the arrow below to navigate to the Drive folders
                    <ChevronDown size={16} className="text-gold" />
                  </p>
                </div>
              </div>
            ) : (
              <img src={lightboxItem.url} className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl" alt="Full view" />
            )}

            <div className="mt-8 flex items-center gap-6">
              {lightboxItem.type === 'drive' ? (
                <button onClick={() => window.open(lightboxItem.link || lightboxItem.url, '_blank')} className="flex items-center gap-3 bg-white text-charcoal px-8 py-4 rounded-full hover:bg-gold hover:text-white transition-all shadow-xl hover:-translate-y-1">
                  <Share2 size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">Open in Google Drive</span>
                </button>
              ) : (
                <button onClick={() => downloadItem(lightboxItem.url)} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                  <Download size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">Download Original</span>
                </button>
              )}

              {/* Delete inside Lightbox */}
              {lightboxItem._id && (
                <button onClick={(e) => deleteItem(lightboxItem._id, e)} className="flex items-center gap-2 text-white/50 hover:text-red-500 transition-colors ml-4 border-l border-white/20 pl-6">
                  <Trash2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Delete Asset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
