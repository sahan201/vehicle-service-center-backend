import Appointment from "../models/Appointment.js";
import { sendEmail } from "../utils/sendEmail.js";

export const startService = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    appt.status = "In Progress";
    appt.startedAt = new Date();
    await appt.save();
    res.json({ message: "Service status updated to 'In Progress'", appt });
  } catch (err) {
    console.error("Start Service Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const finishService = async (req, res) => {
  try {
    const { cost } = req.body;
    if (!cost || isNaN(cost) || cost <= 0) return res.status(400).json({ message: "A valid cost must be provided" });
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    const numericCost = parseFloat(cost);
    let finalCost = numericCost;
    if (appt.discountEligible) {
      finalCost = Math.round(numericCost * 0.95);
    }
    appt.status = "Completed";
    appt.cost = numericCost;
    appt.finalCost = finalCost;
    appt.finishedAt = new Date();
    await appt.save();
    const text = `Dear ${appt.name},\n\nYour service for vehicle ${appt.vehicleNo} is completed.\n\nPlease find the invoice details below:\n\nOriginal Cost: Rs. ${numericCost.toFixed(2)}\n${appt.discountEligible ? `Discount (5%): -Rs. ${(numericCost - finalCost).toFixed(2)}\nFinal Cost: Rs. ${finalCost.toFixed(2)}` : `Final Cost: Rs. ${finalCost.toFixed(2)}`}\n\nThank you for choosing TrustX Service Center.`;
    await sendEmail(appt.email, "Service Completed - Final Invoice", text);
    res.json({ message: "Service marked as 'Completed' and invoice sent.", appt });
  } catch (err) {
    console.error("Finish Service Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

