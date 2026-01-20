import { Bell, Search, User, Globe, Menu } from "lucide-react";

export default function Topbar({ onMenuClick }) {
    return (
        <header className="h-20 px-4 md:px-8 flex items-center justify-between border-b border-[#e6e3df] bg-white/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-ivory rounded-xl transition-all text-charcoal shadow-sm border border-ivory bg-white"
                >
                    <Menu size={20} />
                </button>
                <div className="hidden md:flex items-center max-w-xl relative">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-warmgray" size={18} />
                    <input
                        type="text"
                        placeholder="Registry search..."
                        className="w-full pl-8 py-2 bg-transparent text-sm focus:outline-none placeholder:text-warmgray/60 font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="hidden sm:flex items-center gap-4 border-r border-[#e6e3df] pr-6">
                    <button className="text-warmgray hover:text-charcoal transition-all relative p-2 hover:bg-ivory rounded-full">
                        <Bell size={20} strokeWidth={1.5} />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-mutedbrown rounded-full border border-white"></span>
                    </button>
                    <button className="text-warmgray hover:text-charcoal transition-all p-2 hover:bg-ivory rounded-full">
                        <Globe size={20} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-charcoal">Sreenidhi</p>
                        <p className="text-[9px] text-warmgray uppercase tracking-[0.2em] font-bold">Admin Registry</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-ivory border border-[#e6e3df] flex items-center justify-center overflow-hidden transition-all group-hover:shadow-md group-hover:scale-105">
                        <User size={24} className="text-warmgray translate-y-1" />
                    </div>
                </div>
            </div>
        </header>
    );
}
