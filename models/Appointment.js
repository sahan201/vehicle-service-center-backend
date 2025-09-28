import mongoose from 'mongoose';

const laborChargeSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  // Rate can be stored here if it varies, or pulled from a central config
  rate: {
    type: Number,
    required: true,
    default: 50, // Example default hourly rate
  }
});

const partUsedSchema = new mongoose.Schema({
  part: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  // Price at the time of service to prevent historical data changes
  salePrice: {
    type: Number,
    required: true,
  }
});


const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Vehicle',
    },
    serviceType: {
      type: String,
      required: [true, 'Please specify a service type.'],
    },
    date: {
      type: String, // Storing as String to preserve user's input timezone
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assigned mechanic
    },
    notes: {
      // Internal notes by the mechanic
      type: String,
    },
    // --- Digital Job Card Fields ---
    partsUsed: [partUsedSchema],
    laborCharges: [laborChargeSchema],
    // --- Billing Fields ---
    subtotal: {
      type: Number,
      default: 0
    },
    finalCost: {
      type: Number,
      default: 0
    },
    discountEligible: {
      type: Boolean,
      default: false,
    },
    // --- Timestamps ---
    startedAt: {
      type: Date,
    },
    finishedAt: {
      type: Date,
    },
    // --- Feedback Tracking ---
    feedbackSubmitted: {
        type: Boolean,
        default: false,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;

