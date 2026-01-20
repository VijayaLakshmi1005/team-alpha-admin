module.exports = function generateInvoiceNumber() {
    const date = Date.now().toString().slice(-6);
    return `INV-${date}`;
};
