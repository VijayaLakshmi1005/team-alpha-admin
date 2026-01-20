import { useState, useMemo } from "react";
import { FileText, Send, IndianRupee, Plus, Trash2, X } from "lucide-react";

export default function InvoiceForm({ onClose }) {
  const [clientName, setClientName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([{ description: "", price: 0 }]);

  const addItem = () => setItems([...items, { description: "", price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
    setItems(newItems);
  };

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Generating Invoice:", { clientName, invoiceDate, items, total });
    alert("Invoice Generated Successfully!");
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-3xl border border-[#e6e3df]/40 shadow-2xl overflow-hidden max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="p-8 border-b border-ivory flex justify-between items-center bg-ivory/20">
        <div>
          <h2 className="font-serif text-3xl text-charcoal">Create Invoice</h2>
          <p className="text-[10px] text-warmgray mt-2 font-bold uppercase tracking-[0.2em]">Team Alpha Luxury Billing</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white rounded-full transition-colors text-warmgray"
        >
          <X size={20} />
        </button>
      </div>

      <form className="p-8 space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Client Name</label>
            <input
              required
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Rahul Mehta"
              className="w-full bg-ivory/40 border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-mutedbrown transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-warmgray ml-1">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full bg-ivory/40 border border-[#e6e3df] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-mutedbrown transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs uppercase font-bold tracking-widest text-charcoal">Line Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-mutedbrown hover:text-charcoal transition-colors border border-ivory px-3 py-1.5 rounded-full"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  required
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Service Description"
                  className="flex-1 w-full bg-ivory/20 border border-[#e6e3df] rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                />
                <div className="flex gap-2 items-center w-full md:w-auto">
                  <div className="relative flex-1 md:w-32">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray" size={14} />
                    <input
                      required
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-ivory/20 border border-[#e6e3df] rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-warmgray hover:text-red-400 p-2 bg-ivory/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-ivory flex flex-col items-end gap-3">
          <div className="flex justify-between w-full md:w-64 text-sm text-warmgray font-medium">
            <span className="uppercase tracking-widest text-[10px]">Subtotal:</span>
            <span>₹ {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-full md:w-64 font-serif text-2xl border-t border-ivory pt-4 mt-2 text-charcoal">
            <span>Total:</span>
            <span className="text-mutedbrown">₹ {total.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-charcoal text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-mutedbrown transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] mt-8"
        >
          <Send size={18} /> Generate & Send Invoice
        </button>
      </form>
    </div>
  );
}
