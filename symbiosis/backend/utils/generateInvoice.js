const PDFDocument = require('pdfkit');

const generateInvoice = (fee, res) => {
    const doc = new PDFDocument({ margin: 50 });

    // Stream PDF to HTTP response
    doc.pipe(res);

    // Header
    doc
        .fontSize(20)
        .text('INVOICE / RECEIPT', { align: 'center' })
        .moveDown();

    // School Info
    doc
        .fontSize(12)
        .text('ISBM School', { align: 'right' })
        .text('Education City', { align: 'right' })
        .text('contact@isbm.com', { align: 'right' })
        .moveDown();

    // Invoice Details
    doc
        .fontSize(10)
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' })
        .text(`Invoice #: INV-${fee._id.toString().slice(-6).toUpperCase()}`, { align: 'left' })
        .text(`Status: ${fee.status.toUpperCase()}`, { align: 'left' })
        .moveDown();
    
    // Line Separator
    doc.moveTo(50, 200).lineTo(550, 200).stroke();
    doc.moveDown();

    // Student Info
    doc
        .fontSize(14)
        .text(`Bill To:`, 50, 220)
        .fontSize(12)
        .text(fee.student.name)
        .text(`Admission No: ${fee.student.admissionNumber}`)
        .text(`Class: ${fee.academicYear}`) // Assuming academic year or class field
        .moveDown();

    // Table Header
    const tableTop = 330;
    doc
        .fontSize(12)
        .text('Description', 50, tableTop, { bold: true })
        .text('Amount', 400, tableTop, { align: 'right', bold: true });
    
    doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();

    // Table Row
    const rowTop = tableTop + 30;
    doc
        .fontSize(12)
        .text(`${fee.type} Fees`, 50, rowTop)
        .text(`$${fee.amount.toLocaleString()}`, 400, rowTop, { align: 'right' });

    // Total
    const totalTop = rowTop + 50;
    doc.moveTo(50, totalTop).lineTo(550, totalTop).stroke();
    
    doc
        .fontSize(14)
        .text('Total:', 300, totalTop + 10)
        .text(`$${fee.amount.toLocaleString()}`, 400, totalTop + 10, { align: 'right', bold: true });

    // Footer
    if (fee.status === 'Paid') {
        doc
            .fontSize(25)
            .fillColor('green')
            .text('PAID', 50, 500, { align: 'center', opacity: 0.3 });
    }

    doc
        .fontSize(10)
        .fillColor('black')
        .text('Thank you for your payment.', 50, 700, { align: 'center' });

    doc.end();
};

module.exports = generateInvoice;
