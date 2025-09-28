import Appointment from '../models/Appointment.js';
import Vehicle from '../models/Vehicle.js';

// FR-EXT-B2: Get all vehicles for the logged-in customer
export const getMyVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ owner: req.user.id });
  res.json(vehicles);
};

// FR-EXT-B2: Get service history for a specific vehicle
export const getVehicleServiceHistory = async (req, res) => {
  const history = await Appointment.find({ 
    vehicle: req.params.vehicleId, 
    status: 'Completed' 
  }).sort({ finishedAt: -1 });
  res.json(history);
};

// FR-EXT-C2: Allow customer to cancel a scheduled appointment
export const cancelMyAppointment = async (req, res) => {
  const appointment = await Appointment.findOne({ _id: req.params.id, customer: req.user.id });
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  if (appointment.status !== 'Scheduled') {
    return res.status(400).json({ message: 'Cannot cancel an appointment that is already in progress or completed.' });
  }

  appointment.status = 'Canceled';
  await appointment.save();
  res.json({ message: 'Appointment has been canceled.' });
};
