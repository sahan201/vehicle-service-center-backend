import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Appointment',
      unique: true, // A customer can only leave one feedback per appointment
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: [true, 'A rating between 1 and 5 is required.'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;

