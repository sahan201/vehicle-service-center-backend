import Appointment from "../models/Appointment.js";
import Inventory from "../models/Inventory.js";
import { sendEmail } from "../utils/sendEmail.js";
//import { generateBookingConfirmationPDF } from "../utils/pdfGenerator.js";

/**
 * @desc    Get all appointments assigned to the currently logged-in mechanic
 * @route   GET /api/mechanic/jobs
 * @access  Private (Mechanic)
 */
export const getMyAssignedJobs = async (req, res) => {
  try {
    const mechanicId = req.user._id;
    const myJobs = await Appointment.find({
      assignedMechanic: mechanicId,
    })
      .populate("customer", "name email")
      .populate("vehicle", "make model vehicleNo")
      .sort({ date: 1, time: 1 });

    res.json(myJobs);
  } catch (error) {
    console.error("Error fetching assigned jobs:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Start a service for an assigned appointment
 * @route   PUT /api/mechanic/jobs/start/:id
 * @access  Private (Mechanic)
 */
export const startService = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    // Ensure the job belongs to this mechanic
    if (appointment.assignedMechanic.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to start this service." });
    }
    if (appointment.status !== "Scheduled") {
      return res
        .status(400)
        .json({
          message:
            "Service cannot be started. Current status: " + appointment.status,
        });
    }

    appointment.status = "In Progress";
    appointment.startedAt = new Date();
    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
  } catch (error) {
    console.error("Error starting service:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Add a part from inventory to a job's itemized list
 * @route   POST /api/mechanic/jobs/:id/parts
 * @access  Private (Mechanic)
 */
export const addPartToJob = async (req, res) => {
  try {
    const { inventoryId, quantity } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    if (appointment.assignedMechanic.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized for this service." });
    }
    if (appointment.status !== "In Progress") {
      return res
        .status(400)
        .json({
          message: "Can only add parts to services that are in progress.",
        });
    }

    const inventoryItem = await Inventory.findById(inventoryId);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory part not found." });
    }
    if (inventoryItem.quantity < quantity) {
      return res
        .status(400)
        .json({
          message: `Insufficient stock for ${inventoryItem.name}. Only ${inventoryItem.quantity} left.`,
        });
    }

    // Decrement stock and save
    inventoryItem.quantity -= quantity;
    await inventoryItem.save();

    const newPart = {
      inventoryItem: inventoryItem._id,
      name: inventoryItem.name,
      quantity: Number(quantity),
      salePrice: inventoryItem.salePrice,
    };

    appointment.partsUsed.push(newPart);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error adding part to job:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Add a labor charge to a job's itemized list
 * @route   POST /api/mechanic/jobs/:id/labor
 * @access  Private (Mechanic)
 */
export const addLaborToJob = async (req, res) => {
  try {
    const { description, cost } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    if (appointment.assignedMechanic.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized for this service." });
    }
    if (appointment.status !== "In Progress") {
      return res
        .status(400)
        .json({
          message: "Can only add labor to services that are in progress.",
        });
    }

    const newLaborItem = {
      description,
      cost: Number(cost),
    };

    appointment.laborItems.push(newLaborItem);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error adding labor to job:", error);
    res.status(500).json({ message: "Server error." });
  }
};

/**
 * @desc    Finish a service and calculate final cost
 * @route   PUT /api/mechanic/jobs/finish/:id
 * @access  Private (Mechanic)
 */
export const finishService = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("customer", "name email")
      .populate("vehicle");

    if (!appointment) {
      return res.status(440).json({ message: "Appointment not found." });
    }
    if (appointment.assignedMechanic.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized for this service." });
    }
    if (appointment.status !== "In Progress") {
      return res
        .status(400)
        .json({ message: "Service must be in progress to be finished." });
    }

    // Calculate subtotal from partsUsed and laborItems arrays
    const partsTotal = appointment.partsUsed.reduce(
      (acc, item) => acc + item.salePrice * item.quantity,
      0
    );
    const laborTotal = appointment.laborItems.reduce(
      (acc, item) => acc + item.cost,
      0
    );
    const subtotal = partsTotal + laborTotal;

    let finalCost = subtotal;

    if (appointment.discountEligible) {
      finalCost = subtotal * 0.95; // Apply 5% discount
    }

    appointment.status = "Completed";
    appointment.finishedAt = new Date();
    appointment.subtotal = subtotal;
    appointment.finalCost = finalCost;

    const updatedAppointment = await appointment.save();

    // Generate and send final itemized invoice email
    const pdfBuffer = await generateFinalInvoicePDF(updatedAppointment);
    const emailText = `Dear ${
      appointment.customer.name
    },\n\nYour service for your ${appointment.vehicle.make} ${
      appointment.vehicle.model
    } has been completed. Please find your itemized invoice attached.\n\nTotal Amount Due: $${finalCost.toFixed(
      2
    )}\n\nThank you for choosing our service center.`;

    await sendEmail(
      appointment.customer.email,
      "Your Service is Complete - Final Invoice",
      emailText,
      [
        {
          filename: `invoice-${appointment._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ]
    );

    res.json(updatedAppointment);
  } catch (error) {
    console.error("Error finishing service:", error);
    res.status(500).json({ message: "Server error." });
  }
};
