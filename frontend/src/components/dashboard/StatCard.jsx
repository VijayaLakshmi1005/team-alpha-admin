export default function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-[#e6e3df]/40 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-ivory rounded-lg text-warmgray">
                    {icon}
                </div>
                <span className="text-[10px] bg-beige px-2 py-0.5 rounded-full text-mutedbrown font-medium">
                    +4.2%
                </span>
            </div>
            <p className="text-xs text-warmgray uppercase tracking-widest font-medium">{title}</p>
            <h3 className="text-3xl font-serif text-charcoal mt-1">{value}</h3>
        </div>
    );
}
