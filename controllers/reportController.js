/*import Appointment from '../models/Appointment.js';
import PDFDocument from 'pdfkit';

/**
 * @desc    Generate a PDF report for appointments within a date range
 * @route   GET /api/reports/appointments
 * @access  Private (Manager)
 
export const generateAppointmentReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide both a start and end date.' });
    }

    const appointments = await Appointment.find({
      date: {
        $gte: new Date(startDate).toISOString(),
        $lte: new Date(endDate).toISOString(),
      },
    })
      .populate('customer', 'name')
      .populate('mechanic', 'name')
      .sort({ date: 1 });

    // --- Report Summary Calculation ---
    const totalAppointments = appointments.length;
    const completedServices = appointments.filter(a => a.status === 'Completed').length;
    const totalIncome = appointments.reduce((sum, appt) => {
        return appt.status === 'Completed' ? sum + (appt.finalCost || 0) : sum;
    }, 0);


    // --- PDF Generation ---
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=VSC_Report_${startDate}_to_${endDate}.pdf`);

    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text('Vehicle Service Center - Performance Report', { align: 'center' });
    doc.moveDown();

    // Summary Section
    doc
      .fontSize(16)
      .text('Summary', { underline: true });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(`Report Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`)
      .text(`Total Appointments Booked: ${totalAppointments}`)
      .text(`Completed Services: ${completedServices}`)
      .text(`Total Income Generated: $${totalIncome.toFixed(2)}`);
    doc.moveDown();

    // Details Section
    doc
      .fontSize(16)
      .text('Appointment Details', { underline: true });
    doc.moveDown(0.5);

    // Table Header
    const tableTop = doc.y;
    const itemX = 50;
    const dateX = 150;
    const statusX = 250;
    const costX = 350;
    const mechanicX = 450;

    doc
        .fontSize(10)
        .text('Customer', itemX, tableTop, { bold: true })
        .text('Date', dateX, tableTop, { bold: true })
        .text('Status', statusX, tableTop, { bold: true })
        .text('Final Cost', costX, tableTop, { bold: true })
        .text('Mechanic', mechanicX, tableTop, { bold: true });
    
    doc.moveTo(itemX - 10, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);


    // Table Rows
    appointments.forEach(appt => {
        const y = doc.y;
        doc
            .fontSize(10)
            .text(appt.customer ? appt.customer.name : 'N/A', itemX, y)
            .text(new Date(appt.date).toLocaleDateString(), dateX, y)
            .text(appt.status, statusX, y)
            .text(appt.finalCost ? `$${appt.finalCost.toFixed(2)}` : 'N/A', costX, y)
            .text(appt.mechanic ? appt.mechanic.name : 'Unassigned', mechanicX, y);
        doc.moveDown(1.5);
    });


    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error while generating report.' });
  }
};
*/

import PDFDocument from "pdfkit";
import Appointment from "../models/Appointment.js";

// @desc    Generate a PDF performance report
// @route   GET /api/reports/generate
// @access  Private/Manager
export const generateReport = async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ message: 'Please provide both a start and end date.' });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        const appointments = await Appointment.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        })
            .populate('customer', 'name')
            .populate('assignedMechanic', 'name') // Corrected field name to 'assignedMechanic'
            .sort({ date: 1 });

        // --- Report Summary Calculation ---
        const totalAppointments = appointments.length;
        const completedServices = appointments.filter(a => a.status === 'Completed').length;
        const totalIncome = appointments.reduce((sum, appt) => {
            return appt.status === 'Completed' ? sum + (appt.finalCost || 0) : sum;
        }, 0);


        // --- PDF Generation ---
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=VSC_Report_${start}_to_${end}.pdf`);

        doc.pipe(res);

        // Header
        doc
            .fontSize(20)
            .text('Vehicle Service Center - Performance Report', { align: 'center' });
        doc.moveDown();

        // Summary Section
        doc
            .fontSize(16)
            .text('Summary', { underline: true });
        doc.moveDown(0.5);
        doc
            .fontSize(12)
            .text(`Report Period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`)
            .text(`Total Appointments Booked: ${totalAppointments}`)
            .text(`Completed Services: ${completedServices}`)
            .text(`Total Income Generated: $${totalIncome.toFixed(2)}`);
        doc.moveDown();

        // Details Section
        doc
            .fontSize(16)
            .text('Appointment Details', { underline: true });
        doc.moveDown(0.5);

        // Table Header
        const tableTop = doc.y;
        const customerX = 50;
        const dateX = 150;
        const statusX = 250;
        const costX = 350;
        const mechanicX = 450;

        doc
            .fontSize(10)
            .text('Customer', customerX, tableTop, { bold: true })
            .text('Date', dateX, tableTop, { bold: true })
            .text('Status', statusX, tableTop, { bold: true })
            .text('Final Cost', costX, tableTop, { bold: true })
            .text('Mechanic', mechanicX, tableTop, { bold: true });
        
        doc.moveTo(customerX - 10, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);


        // Table Rows
        appointments.forEach(appt => {
            const y = doc.y;
            doc
                .fontSize(10)
                .text(appt.customer ? appt.customer.name : 'N/A', customerX, y)
                .text(new Date(appt.date).toLocaleDateString(), dateX, y)
                .text(appt.status, statusX, y)
                .text(appt.finalCost ? `$${appt.finalCost.toFixed(2)}` : 'N/A', costX, y)
                .text(appt.assignedMechanic ? appt.assignedMechanic.name : 'Unassigned', mechanicX, y); // Corrected field name
            doc.moveDown(1.5);
        });


        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Server error while generating report.' });
    }
};

// @desc    Get booking statistics by day of the week
// @route   GET /api/reports/booking-stats
// @access  Private/Manager
export const getBookingStats = async (req, res) => {
    try {
        const stats = await Appointment.aggregate([
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: { $toDate: "$date" } } // Convert string date to date object
                }
            },
            {
                $group: {
                    _id: "$dayOfWeek",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 } // Sort by day number (1=Sun, 2=Mon, etc.)
            }
        ]);

        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        // Map results to day names and ensure all days are present
        const formattedStats = daysOfWeek.map((day, index) => {
            const stat = stats.find(s => s._id === (index + 1));
            return {
                day: day,
                count: stat ? stat.count : 0
            };
        });

        res.status(200).json(formattedStats);
    } catch (error) {
        console.error("Error fetching booking stats:", error);
        res.status(500).json({ message: "Server error while fetching booking stats." });
    }
};

