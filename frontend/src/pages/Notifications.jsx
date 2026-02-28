import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, Trash2, Bell, CheckSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/notifications");
            setNotifications(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            toast.error("Failed to mark as read");
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post("http://localhost:5000/api/notifications/mark-all-read");
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success("All marked as read");
        } catch (err) {
            toast.error("Failed to mark all as read");
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success("Notification deleted");
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const clearAll = async () => {
        if (!window.confirm("Are you sure you want to clear all notifications?")) return;
        try {
            await axios.delete("http://localhost:5000/api/notifications/clear/all");
            setNotifications([]);
            toast.success("All notifications cleared");
        } catch (err) {
            toast.error("Failed to clear notifications");
        }
    };

    if (loading) {
        return <div className="p-8 text-warmgray">Loading notifications...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="font-serif text-3xl md:text-4xl text-charcoal flex items-center gap-3">
                        <Bell className="text-mutedbrown" size={32} />
                        All Activity
                    </h1>
                    <p className="text-sm text-warmgray mt-1 uppercase tracking-widest font-bold text-[10px]">Your Studio Notifications</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 bg-white border border-[#e6e3df] text-charcoal px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-ivory transition-all shadow-sm active:scale-95"
                    >
                        <CheckSquare size={14} />
                        Mark All Read
                    </button>
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm active:scale-95"
                    >
                        <Trash2 size={14} />
                        Clear All
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#e6e3df]/40 shadow-sm overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-16 text-center text-warmgray italic font-serif">
                        No notifications found.
                    </div>
                ) : (
                    <div className="divide-y divide-ivory">
                        {notifications.map(n => (
                            <div key={n._id} className={`p-6 flex items-start justify-between gap-4 transition-colors ${n.isRead ? 'bg-white' : 'bg-ivory/20'}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 w-3 h-3 rounded-full ${n.type === 'new' ? 'bg-blue-500' : n.type === 'alert' ? 'bg-amber-500' : n.type === 'success' ? 'bg-green-500' : 'bg-warmgray'}`}></div>
                                    <div>
                                        <p className={`text-sm ${n.isRead ? 'text-charcoal' : 'text-charcoal font-bold'}`}>{n.text}</p>
                                        <p className="text-xs text-warmgray mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!n.isRead && (
                                        <button onClick={() => markAsRead(n._id)} className="p-2 text-warmgray hover:text-green-600 rounded-full hover:bg-green-50 transition-colors" title="Mark as read">
                                            <CheckCircle2 size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => deleteNotification(n._id)} className="p-2 text-warmgray hover:text-red-500 rounded-full hover:bg-red-50 transition-colors" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
