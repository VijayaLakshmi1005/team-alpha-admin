import { useState, useMemo } from "react";
import { FileText, Send, IndianRupee, Plus, Trash2, X, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import toast from "react-hot-toast";

export default function InvoiceForm({ onClose, initialClientName = "" }) {
  // ... state ...
  const [clientName, setClientName] = useState(initialClientName);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([{ description: "", price: 0 }]);
  const [loading, setLoading] = useState(false);

  const addItem = () => setItems([...items, { description: "", price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
    setItems(newItems);
  };

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);

  /* Helper to load image */
  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (error) => reject(error);
    });
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();

      // Add Logo
      try {
        // Ensure the file path matches where we copied it
        const logoData = await getBase64ImageFromURL('/team-alpha-logo.png');
        doc.addImage(logoData, 'PNG', 20, 10, 20, 20); // Logo at top-left
      } catch (e) {
        console.warn("Logo not found, skipping", e);
      }

      // Header Text (Shifted Right)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("TEAM ALPHA", 45, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Luxury Photography & Cinematography", 45, 26);

      // Invoice Info
      doc.setFontSize(10);
      doc.text(`Invoice Date: ${invoiceDate}`, 20, 45); // Moved down slightly
      doc.text(`Client: ${clientName}`, 20, 51);

      // Table
      autoTable(doc, {
        startY: 65,
        head: [['Description', 'Amount (INR)']],
        body: items.map(item => [item.description, `Rs. ${item.price.toLocaleString()}`]),
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50] },
        foot: [['TOTAL', `Rs. ${total.toLocaleString()}`]],
        showFoot: 'lastPage'
      });

      // Footer message
      const finalY = (doc).lastAutoTable?.finalY || 150;
      doc.text("Thank you for choosing Team Alpha.", 20, finalY + 20);

      return doc;
    } catch (err) {
      console.error("PDF Generation Error", err);
      toast.error("Error generating PDF preview");
      return null;
    }
  };

  const handleDownload = async () => {
    const doc = await generatePDF();
    if (doc) {
      doc.save(`Invoice_${clientName}_${invoiceDate}.pdf`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to backend
      await axios.post('http://localhost:5000/api/invoices', {
        clientName,
        invoiceDate,
        items,
        total,
        status: 'Pending'
      });

      // Also save to Finance module as Income (Pending)
      // Redundant Finance entry removed - Finance page now reads Invoices directly

      toast.success("Invoice generated and saved to Finance!");

      // offer download?
      // handleDownload(); // Auto download or let user click button?

      if (onClose) onClose();
    } catch (err) {
      console.error("Error generating invoice:", err);
      toast.error("Failed to save invoice.");
    } finally {
      setLoading(false);
    }
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

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 bg-white border border-[#e6e3df] text-charcoal py-5 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-ivory transition-all shadow-sm active:scale-[0.98]"
          >
            <Download size={18} /> Download PDF
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-charcoal text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-mutedbrown transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-70"
          >
            <Send size={18} /> {loading ? 'Saving...' : 'Save & Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
