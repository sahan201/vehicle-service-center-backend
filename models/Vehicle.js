import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a link to the User model
    },
    make: {
      type: String,
      required: [true, 'Please provide the vehicle make (e.g., Toyota).'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide the vehicle model (e.g., Corolla).'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please provide the vehicle year.'],
    },
    vehicleNo: {
      type: String,
      required: [true, 'Please provide the vehicle registration number.'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;

