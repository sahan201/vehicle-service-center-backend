import Settings from '../models/Settings.js';

// @desc    Get the current system settings
// @route   GET /api/settings
// @access  Private/Manager
export const getSettings = async (req, res) => {
    try {
        // There should only ever be one settings document in the collection.
        // We find the first one that exists.
        let settings = await Settings.findOne();

        // If no settings document exists yet, create one with default values.
        // This ensures the application always has a configuration to work with.
        if (!settings) {
            settings = await Settings.create({
                // Default off-peak days are Monday and Tuesday
                offPeakDays: ['Monday', 'Tuesday']
            });
        }

        res.status(200).json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error while fetching settings.' });
    }
};

// @desc    Update the system settings
// @route   PUT /api/settings
// @access  Private/Manager
export const updateSettings = async (req, res) => {
    try {
        const { offPeakDays } = req.body;

        // Ensure offPeakDays is an array
        if (!Array.isArray(offPeakDays)) {
            return res.status(400).json({ message: 'offPeakDays must be an array of strings.' });
        }

        // Find the single settings document and update it.
        // The `upsert: true` option is very useful here:
        // If a settings document exists, it updates it.
        // If it does NOT exist, it creates it.
        const updatedSettings = await Settings.findOneAndUpdate(
            {}, // An empty filter will match the first document found
            { offPeakDays },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json(updatedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Server error while updating settings.' });
    }
};

