import Appointment from '../models/Appointment.js';
import Vehicle from '../models/Vehicle.js';
import { checkOffPeakDay } from '../utils/checkOffPeak.js';
import { sendEmail } from '../utils/sendEmail.js';
import { generateBookingConfirmationPDF } from '../utils/pdfGenerator.js';

/**
 * @desc    Create a new appointment
 * @route   POST /api/appointments/book
 * @access  Private (Customer)
 */
export const createAppointment = async (req, res) => {
  try {
    const { vehicleId, serviceType, date, time } = req.body;
    const customerId = req.user._id; // Logged-in user from auth middleware

    // 1. Validation: Ensure the vehicle belongs to the customer
    const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: customerId });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or does not belong to the user.' });
    }

    // 2. Slot Conflict Check (Basic Implementation)
    const existingAppointment = await Appointment.findOne({ date, time, status: { $ne: 'Canceled' } });
    if (existingAppointment) {
      return res.status(409).json({ message: 'This time slot is already booked. Please choose another time.' });
    }

    // 3. Check for Off-Peak Discount
    const isDiscountEligible = await checkIfOffPeakDay(new Date(date));

    // 4. Create the new appointment
    const appointment = new Appointment({
      customer: customerId,
      vehicle: vehicleId,
      serviceType,
      date,
      time,
      discountEligible: isDiscountEligible,
    });

    const savedAppointment = await appointment.save();

    // 5. Generate PDF and Send Confirmation Email
    const pdfBuffer = await generateBookingConfirmationPDF(savedAppointment, req.user, vehicle);
    const emailText = `Dear ${req.user.name},\n\nYour appointment for your ${vehicle.make} ${vehicle.model} is confirmed for ${date} at ${time}.\n\nPlease find your booking confirmation attached.\n\nThank you,\nTrustX Service Center`;

    await sendEmail(
      req.user.email,
      'Your Appointment is Confirmed!',
      emailText,
      [{
        filename: `confirmation-${savedAppointment._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }]
    );

    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error while creating appointment.' });
  }
};

/**
 * @desc    Get a single appointment by ID
 * @route   GET /api/appointments/:id
 * @access  Private (Customer, Manager, Mechanic)
 */
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('customer', 'name email')
            .populate('vehicle')
            .populate('assignedMechanic', 'name');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        res.json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get all appointments (for Manager/Mechanic view)
 * @route   GET /api/appointments
 * @access  Private (Manager, Mechanic)
 */
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('customer', 'name email')
            .populate('vehicle', 'make model vehicleNo')
            .populate('assignedMechanic', 'name')
            .sort({ date: -1, time: -1 }); // Sort by most recent first
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get all appointments for the logged-in customer
 * @route   GET /api/appointments/my-appointments
 * @access  Private (Customer)
 */
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ customer: req.user._id })
            .populate('vehicle')
            .populate('assignedMechanic', 'name')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching user appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Cancel an appointment
 * @route   PUT /api/appointments/:id/cancel
 * @access  Private (Customer)
 */
export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Security check: Ensure the appointment belongs to the user trying to cancel it
        if (appointment.customer.toString() !== req.user._id) {
            return res.status(401).json({ message: 'Not authorized to cancel this appointment.' });
        }

        appointment.status = 'Canceled';
        await appointment.save();
        res.json({ message: 'Appointment canceled successfully.' });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

