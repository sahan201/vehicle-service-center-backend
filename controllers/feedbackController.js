import Feedback from '../models/Feedback.js';
import Appointment from '../models/Appointment.js';

/**
 * @desc    Create a new feedback entry for an appointment
 * @route   POST /api/feedback
 * @access  Private (Customer)
 */
export const createFeedback = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const customerId = req.user._id;

    // 1. Verify the appointment exists and belongs to the customer
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      customer: customerId,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or you are not authorized to leave feedback for it.' });
    }

    // 2. Check if the service is completed
    if (appointment.status !== 'Completed') {
      return res.status(400).json({ message: 'You can only leave feedback for completed services.' });
    }

    // 3. Check if feedback has already been submitted for this appointment
    const existingFeedback = await Feedback.findOne({ appointment: appointmentId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback has already been submitted for this appointment.' });
    }

    // 4. Create and save the new feedback
    const feedback = new Feedback({
      appointment: appointmentId,
      customer: customerId,
      rating,
      comment,
    });

    const savedFeedback = await feedback.save();

    // 5. Link feedback to the appointment document
    appointment.feedback = savedFeedback._id;
    await appointment.save();


    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback.' });
  }
};

/**
 * @desc    Get all feedback entries
 * @route   GET /api/feedback
 * @access  Private (Manager)
 */
export const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find({})
      .populate({
        path: 'appointment',
        select: 'serviceType date vehicle',
        populate: {
          path: 'vehicle',
          select: 'make model vehicleNo',
        }
      })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.json(feedbackList);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error while fetching feedback.' });
  }
};

