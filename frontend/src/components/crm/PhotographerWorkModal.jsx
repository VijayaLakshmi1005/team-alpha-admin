import { X, Calendar, MapPin, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { format, isPast } from "date-fns";

export default function PhotographerWorkModal({ photographerName, works, onClose }) {

    // Split works into Upcoming and Past
    const sortedWorks = [...works].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    const upcomingWorks = sortedWorks.filter(w => !isPast(new Date(w.eventDate)));
    const pastWorks = sortedWorks.filter(w => isPast(new Date(w.eventDate))).reverse(); // Show most recent past first

    const sendWhatsApp = (work) => {
        const text = `Hello ${photographerName}, this is a reminder for the upcoming ${work.eventType} shoot for ${work.name} on ${format(new Date(work.eventDate), 'PPP')}. Please confirm your availability.`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const WorkCard = ({ work, isPastEvent }) => (
        <div className={`bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all ${isPastEvent ? 'border-gray-100 opacity-80' : 'border-[#e6e3df]'}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-semibold text-gray-800">{work.name}</h4>
                    <span className="text-[10px] text-gray-500 font-medium">Client: {work.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${isPastEvent
                    ? 'bg-gray-100 text-gray-500'
                    : (work.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')
                    }`}>
                    {work.eventType}
                </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{work.eventDate ? format(new Date(work.eventDate), 'PPP') : 'Date TBD'}</span>
                </div>
                {work.notes && (
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate max-w-[200px]">{work.notes}</span>
                    </div>
                )}
            </div>

            {!isPastEvent && (
                <button
                    onClick={() => sendWhatsApp(work)}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366]/90 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#128C7E] transition-colors shadow-sm"
                >
                    <MessageCircle size={16} /> WhatsApp Reminder
                </button>
            )}

            {isPastEvent && (
                <div className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-400 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-gray-100">
                    <CheckCircle size={16} /> Completed
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-md z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                <div className="p-6 border-b border-ivory flex justify-between items-center bg-ivory/30">
                    <div>
                        <h3 className="font-serif text-2xl text-charcoal">{photographerName}</h3>
                        <p className="text-[10px] text-warmgray uppercase tracking-widest font-bold mt-1">Assignment Portfolio & Schedule</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-ivory">
                        <X size={20} className="text-warmgray" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-gray-50/50">
                    {/* Upcoming Section */}
                    <div>
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mutedbrown mb-4">
                            <Clock size={14} /> Upcoming Assignments
                        </h4>
                        <div className="space-y-3">
                            {upcomingWorks.length > 0 ? (
                                upcomingWorks.map(work => <WorkCard key={work._id} work={work} isPastEvent={false} />)
                            ) : (
                                <p className="text-sm text-gray-400 italic bg-white p-4 rounded-xl border border-dashed border-gray-200 text-center">No upcoming assignments scheduled.</p>
                            )}
                        </div>
                    </div>

                    {/* Past Section */}
                    {pastWorks.length > 0 && (
                        <div>
                            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-t border-gray-200 pt-6">
                                <CheckCircle size={14} /> Work History
                            </h4>
                            <div className="space-y-3">
                                {pastWorks.map(work => <WorkCard key={work._id} work={work} isPastEvent={true} />)}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-ivory bg-white text-center">
                    <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Team Alpha Internal Schedule</p>
                </div>
            </div>
        </div>
    );
}
