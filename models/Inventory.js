import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the item name.'],
      trim: true,
      unique: true,
    },
    partNumber: {
      type: String,
      trim: true,
    },
    supplier: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Quantity cannot be negative.'],
    },
    unit: {
      type: String,
      required: [true, 'Please provide a unit (e.g., liters, units, pieces).'],
      default: 'units',
    },
    costPrice: {
      // Price paid by the service center
      type: Number,
      required: [true, 'Please provide the cost price.'],
    },
    salePrice: {
      // Price charged to the customer
      type: Number,
      required: [true, 'Please provide the sale price.'],
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      default: 5,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;

