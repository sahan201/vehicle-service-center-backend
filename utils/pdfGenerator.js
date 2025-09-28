import fs from 'fs';
import PDFDocument from 'pdfkit';

/**
 * @description Generates an itemized PDF invoice for a completed appointment.
 * @param {object} appointment - The completed appointment object from the database.
 * @returns {Promise<string>} - A promise that resolves with the file path of the generated PDF.
 */
export const generateBookingConfirmationPDF = async (appointment) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      // Define the path and ensure the directory exists
      const receiptsDir = 'public/receipts';
      await fs.promises.mkdir(receiptsDir, { recursive: true });
      const filePath = `${receiptsDir}/invoice-${appointment._id}.pdf`;

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // --- PDF Content ---

      // Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('TrustX Vehicle Service Center', { align: 'center' });
      doc
        .fontSize(10)
        .font('Helvetica')
        .text('123 Service Lane, Auto City, 10101', { align: 'center' })
        .moveDown(2);

      // Invoice Info
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('INVOICE', { align: 'left' });

      doc.fontSize(10).font('Helvetica');
      const invoiceDate = new Date(appointment.finishedAt).toLocaleDateString();
      doc.text(`Invoice #: ${appointment._id}`);
      doc.text(`Date Issued: ${invoiceDate}`);
      doc.moveDown();

      // Customer and Vehicle Info
      doc.text(`Customer: ${appointment.customer.name}`);
      doc.text(`Vehicle: ${appointment.vehicle.make} ${appointment.vehicle.model} (${appointment.vehicle.vehicleNo})`);
      doc.moveDown(2);

      // Table Header for Itemized Costs
      doc.font('Helvetica-Bold');
      doc.text('Description', 50, doc.y, { continued: true, width: 350 });
      doc.text('Cost', 450, doc.y, { align: 'right' });
      doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).stroke();
      doc.moveDown(2);
      doc.font('Helvetica');

      let subtotal = 0;

      // Table Rows for Itemized Costs
      appointment.itemizedCosts.forEach(item => {
        doc.text(item.description, 50, doc.y, { width: 350, continued: true });
        doc.text(`Rs. ${item.cost.toFixed(2)}`, 450, doc.y, { align: 'right' });
        doc.moveDown(0.5);
        subtotal += item.cost;
      });

      doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
      doc.moveDown();

      // Subtotal
      doc.font('Helvetica-Bold');
      doc.text('Subtotal', 350, doc.y, { continued: true, align: 'right', width: 100 });
      doc.text(`Rs. ${subtotal.toFixed(2)}`, 450, doc.y, { align: 'right' });
      doc.moveDown(0.5);

      // Discount (if applicable)
      if (appointment.discountEligible) {
        const discountAmount = subtotal * 0.05;
        doc.font('Helvetica');
        doc.text('Discount (5%)', 350, doc.y, { continued: true, align: 'right', width: 100 });
        doc.text(`- Rs. ${discountAmount.toFixed(2)}`, 450, doc.y, { align: 'right', color: 'green' });
        doc.moveDown(0.5);
      }
      
      doc.moveTo(340, doc.y + 5).lineTo(550, doc.y + 5).stroke();
      doc.moveDown();

      // Total
      doc.font('Helvetica-Bold').fontSize(14);
      doc.text('TOTAL', 350, doc.y, { continued: true, align: 'right', width: 100 });
      doc.text(`Rs. ${appointment.finalCost.toFixed(2)}`, 450, doc.y, { align: 'right' });
      doc.moveDown(3);
      
      // Footer
      doc.fontSize(10).font('Helvetica-Oblique');
      doc.text('Thank you for choosing TrustX Service Center!', { align: 'center' });


      // Finalize the PDF and resolve the promise
      doc.end();

      writeStream.on('finish', () => {
        resolve(filePath);
      });

      writeStream.on('error', (err) => {
        reject(err);
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};

