import { IndianRupee, TrendingUp, TrendingDown, ArrowUpRight, Filter, Download } from "lucide-react";

export default function Finance() {
    return (
        <div className="space-y-8 md:space-y-12 text-charcoal px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="font-serif text-3xl md:text-5xl">Financial Ledger</h1>
                    <p className="text-[10px] md:text-xs text-warmgray mt-3 font-bold uppercase tracking-[0.4em]">Tracking luxury growth and studio metrics.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-3 border border-ivory bg-white px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-ivory transition-all shadow-sm">
                        <Download size={18} /> Export
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-charcoal text-white px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-mutedbrown transition-all shadow-xl">
                        <TrendingUp size={18} /> Growth
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-ivory shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-charcoal group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={120} />
                    </div>
                    <p className="text-[10px] text-warmgray uppercase tracking-[0.3em] font-bold mb-4">Annual Sales</p>
                    <h3 className="text-4xl md:text-5xl font-serif">₹ 42.5L</h3>
                    <div className="mt-8 flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        +12% vs last treasury
                    </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-ivory shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-charcoal group-hover:scale-110 transition-transform duration-700">
                        <TrendingDown size={120} />
                    </div>
                    <p className="text-[10px] text-warmgray uppercase tracking-[0.3em] font-bold mb-4">Total Expenses</p>
                    <h3 className="text-4xl md:text-5xl font-serif">₹ 12.8L</h3>
                    <div className="mt-8 flex items-center gap-2 text-[10px] text-amber-600 font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        Increased travel allocation
                    </div>
                </div>

                <div className="bg-charcoal p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-bold mb-4">Studio Profit</p>
                    <h3 className="text-4xl md:text-5xl font-serif text-ivory">₹ 29.7L</h3>
                    <div className="mt-8 flex items-center gap-2 text-[10px] text-gold font-bold uppercase tracking-[0.25em] italic">
                        "Precision Over Volume"
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                <div className="bg-white rounded-[2.5rem] border border-ivory shadow-sm p-8 md:p-12 overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <h4 className="font-serif text-2xl md:text-3xl">Recent Transactions</h4>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none p-3 border border-ivory rounded-xl hover:bg-ivory transition-all text-warmgray">
                                <Filter size={18} />
                            </button>
                            <button className="flex-1 sm:flex-none text-[10px] text-mutedbrown font-bold uppercase tracking-widest border border-ivory px-5 rounded-xl hover:bg-ivory transition-all">
                                Download All
                            </button>
                        </div>
                    </div>
                    <div className="space-y-8">
                        {[
                            { name: "Rahul Mehta", category: "Wedding Final Installment", amount: "₹ 1,50,000", status: "Success" },
                            { name: "Ananya Sharma", category: "Pre-Wedding Advance", amount: "₹ 75,000", status: "Pending" },
                            { name: "Megha Rao", category: "Album Printing", amount: "₹ 20,000", status: "Success" },
                        ].map((tx, i) => (
                            <div key={i} className="flex items-center justify-between pb-8 border-b border-ivory/60 last:border-0 last:pb-0 group/row">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-ivory rounded-2xl flex items-center justify-center text-mutedbrown group-hover/row:bg-charcoal group-hover/row:text-white transition-all duration-500 shadow-inner">
                                        <IndianRupee size={18} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-charcoal">{tx.name}</h5>
                                        <p className="text-[10px] text-warmgray mt-1 font-bold uppercase tracking-tight">{tx.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-base font-bold text-charcoal">{tx.amount}</div>
                                    <div className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${tx.status === 'Success' ? 'text-green-600' : 'text-amber-600'
                                        }`}>{tx.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-ivory shadow-sm p-8 md:p-12">
                    <div className="flex justify-between items-center mb-10">
                        <h4 className="font-serif text-2xl md:text-3xl">Treasury Allocation</h4>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-mutedbrown bg-ivory/50 px-4 py-2 rounded-full">FY 2025-26</button>
                    </div>
                    <div className="space-y-10">
                        {[
                            { label: "Studio Equipment & R&D", value: "85,000", progress: "65%", color: "bg-mutedbrown" },
                            { label: "Global Travel & Logistics", value: "2,40,000", progress: "40%", color: "bg-charcoal" },
                            { label: "Strategic Brand Marketing", value: "45,000", progress: "90%", color: "bg-gold" },
                        ].map((exp, idx) => (
                            <div key={idx} className="group/exp">
                                <div className="flex justify-between text-[11px] mb-3 font-bold uppercase tracking-widest">
                                    <span className="text-warmgray group-hover/exp:text-charcoal transition-colors">{exp.label}</span>
                                    <span className="text-charcoal">₹ {exp.value}</span>
                                </div>
                                <div className="w-full bg-ivory h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                                    <div className={`${exp.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: exp.progress }} />
                                </div>
                                <div className="mt-2 text-right">
                                    <span className="text-[9px] font-bold text-warmgray uppercase tracking-widest">{exp.progress} Utilized</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-ivory/40 rounded-3xl border border-ivory font-serif italic text-sm text-center text-warmgray">
                        "Wealth is the ability to fully experience life."
                    </div>
                </div>
            </div>
        </div>
    );
}
