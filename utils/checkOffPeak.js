import Settings from "../models/Settings.js";

/**
 * Dynamically checks if a given date falls on an "off-peak" day.
 * Instead of a hard-coded rule, this function fetches the current list
 * of off-peak days from the Settings collection in the database.
 *
 * @param {string | Date} date - The date to check for the appointment.
 * @returns {Promise<boolean>} - True if the date is an off-peak day, false otherwise.
 */
const checkOffPeakDay = async (date) => {
  try {
    // Fetch the single settings document from the database.
    const settings = await Settings.findOne();

    // Define a default array of off-peak days as a fallback.
    const offPeakDays = settings ? settings.offPeakDays : ["Monday", "Tuesday"];

    // Get the full name of the day of the week from the input date.
    const dayOfWeek = new Date(date).toLocaleString("en-US", {
      weekday: "long",
    });

    // Check if the calculated day is in the array of off-peak days.
    return offPeakDays.includes(dayOfWeek);
  } catch (error) {
    console.error("Error in checkIfOffPeakDay utility:", error);
    // Default to false to be safe and avoid unintentional discounts.
    return false;
  }
};

export { checkOffPeakDay };
