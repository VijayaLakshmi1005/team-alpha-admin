import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Filter, Users, Globe } from "lucide-react";
import { useState } from "react";

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState("January 2026");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="space-y-8 md:space-y-12 text-charcoal px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-serif text-3xl md:text-5xl">Studio Itinerary</h1>
                    <p className="text-[10px] md:text-xs text-warmgray mt-3 font-bold uppercase tracking-[0.4em]">Coordinating luxury moments across the globe.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-3 border border-ivory bg-white px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-ivory transition-all shadow-sm">
                        <Users size={18} /> Teams
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-charcoal text-white px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-mutedbrown transition-all shadow-xl">
                        <Plus size={18} /> Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 lg:gap-12">
                {/* Calendar Grid */}
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-ivory shadow-sm p-6 md:p-12">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <h3 className="font-serif text-3xl md:text-4xl">{currentMonth}</h3>
                            <div className="flex bg-ivory/50 p-1 rounded-xl border border-ivory">
                                <button className="p-2 hover:bg-white rounded-lg transition-all text-warmgray hover:text-charcoal shadow-sm">
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="p-2 hover:bg-white rounded-lg transition-all text-warmgray hover:text-charcoal shadow-sm">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none text-[9px] font-bold uppercase tracking-widest bg-ivory/50 px-6 py-2.5 rounded-full border border-ivory">Today</button>
                            <button className="flex-1 sm:flex-none p-2.5 border border-ivory rounded-full hover:bg-ivory text-warmgray">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-ivory/40 rounded-3xl overflow-hidden border border-ivory shadow-inner">
                        {days.map(day => (
                            <div key={day} className="bg-ivory/20 p-5 text-[10px] uppercase tracking-[0.2em] text-mutedbrown font-bold text-center border-b border-ivory">
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: 31 }).map((_, i) => {
                            const isToday = i + 1 === 16;
                            const hasEvent = i + 1 === 16 || i + 1 === 22 || i + 1 === 28;

                            return (
                                <div key={i} className={`bg-white min-h-[100px] md:min-h-[140px] p-4 hover:bg-ivory/10 transition-all group relative cursor-pointer border-r border-b border-ivory/30 last:border-r-0 ${isToday ? 'bg-ivory/5' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[11px] font-bold tracking-widest ${isToday ? 'bg-charcoal text-white w-7 h-7 flex items-center justify-center rounded-xl shadow-lg' : 'text-warmgray group-hover:text-charcoal'}`}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        {hasEvent && <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>}
                                    </div>

                                    {i + 1 === 16 && (
                                        <div className="mt-4 p-3 bg-charcoal text-white rounded-2xl text-[9px] border-l-4 border-gold leading-tight shadow-xl animate-in fade-in zoom-in-95 duration-500">
                                            <span className="font-bold uppercase tracking-widest block mb-1">Wedding Gala</span>
                                            <span className="text-white/60 block truncate font-medium">Taj Palace, Mumbai</span>
                                        </div>
                                    )}
                                    {i + 1 === 22 && (
                                        <div className="mt-4 p-3 bg-ivory rounded-2xl text-[9px] border-l-4 border-mutedbrown leading-tight border border-ivory shadow-sm group-hover:shadow-md transition-all">
                                            <span className="font-bold uppercase tracking-widest block text-charcoal mb-1">Pre-Wedding</span>
                                            <span className="text-warmgray block truncate font-medium">Amer Fort, Jaipur</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Events */}
                <div className="space-y-10">
                    <div className="bg-white rounded-[2.5rem] border border-ivory shadow-sm p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ivory rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-beige/50 transition-colors"></div>
                        <h4 className="font-serif text-2xl md:text-3xl mb-10 relative z-10">Upcoming Registry</h4>
                        <div className="space-y-10 relative z-10">
                            {[1, 2].map(i => (
                                <div key={i} className="group/item cursor-pointer">
                                    <div className="flex gap-6">
                                        <div className="flex flex-col items-center justify-center w-14 h-16 bg-ivory rounded-2xl border border-ivory shadow-sm group-hover/item:bg-charcoal group-hover/item:text-white transition-all duration-500">
                                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Jan</span>
                                            <span className="text-2xl font-serif">{i === 1 ? '16' : '22'}</span>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <h5 className="text-sm font-bold text-charcoal group-hover/item:text-mutedbrown transition-colors">
                                                {i === 1 ? 'Taj Wedding: Ananya & Rahul' : 'Jaipur Heritage Pre-Shoot'}
                                            </h5>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2.5 text-[10px] text-warmgray font-bold uppercase tracking-widest">
                                                    <Clock size={12} className="text-gold" /> 09:00 AM onwards
                                                </div>
                                                <div className="flex items-center gap-2.5 text-[10px] text-warmgray font-bold uppercase tracking-widest">
                                                    <MapPin size={12} className="text-gold" /> {i === 1 ? 'Mumbai Core' : 'Jaipur, Rajasthan'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-12 py-5 border border-ivory rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-ivory transition-all shadow-sm">
                            View Full Studio Schedule
                        </button>
                    </div>

                    <div className="bg-charcoal text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                        <h4 className="font-serif text-2xl md:text-3xl mb-6 relative z-10">Team Sync</h4>
                        <p className="text-[11px] text-white/50 leading-relaxed mb-10 font-medium relative z-10">
                            3 shooting teams are locked for the upcoming week. Global coordination is active.
                        </p>
                        <div className="flex -space-x-4 relative z-10 mb-10">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-[1.25rem] border-2 border-charcoal bg-white/10 backdrop-blur-md flex items-center justify-center text-xs text-white font-bold hover:translate-y-[-5px] transition-transform cursor-pointer">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-[1.25rem] border-2 border-charcoal bg-gold flex items-center justify-center text-[10px] text-white font-bold shadow-lg">
                                +2
                            </div>
                        </div>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                            Assign Lead Team
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
