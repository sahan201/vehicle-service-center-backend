import Vehicle from '../models/Vehicle.js';

/**
 * @desc    Add a new vehicle for the logged-in customer
 * @route   POST /api/vehicles
 * @access  Private (Customer)
 */
export const addVehicle = async (req, res) => {
    try {
        const { make, model, year, vehicleNo } = req.body;

        if (!make || !model || !year || !vehicleNo) {
            return res.status(400).json({ message: 'Please provide all required vehicle details.' });
        }

        const newVehicle = new Vehicle({
            owner: req.user.id, // Comes from the auth middleware
            make,
            model,
            year,
            vehicleNo
        });

        await newVehicle.save();
        res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        res.status(500).json({ message: 'Server error while adding vehicle.' });
    }
};

/**
 * @desc    Get all vehicles for the logged-in customer
 * @route   GET /api/vehicles
 * @access  Private (Customer)
 */
export const getMyVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ owner: req.user.id });
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ message: 'Server error while fetching vehicles.' });
    }
};

/**
 * @desc    Update a specific vehicle for the logged-in customer
 * @route   PUT /api/vehicles/:id
 * @access  Private (Customer)
 */
export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found.' });
        }

        // Security check: Ensure the user owns the vehicle
        if (vehicle.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this vehicle.' });
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedVehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ message: 'Server error while updating vehicle.' });
    }
};

/**
 * @desc    Delete a specific vehicle for the logged-in customer
 * @route   DELETE /api/vehicles/:id
 * @access  Private (Customer)
 */
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found.' });
        }

        // Security check: Ensure the user owns the vehicle
        if (vehicle.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this vehicle.' });
        }

        await vehicle.deleteOne(); // Use deleteOne() on the document

        res.status(200).json({ message: 'Vehicle removed successfully.' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: 'Server error while deleting vehicle.' });
    }
};

