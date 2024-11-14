import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    origin: {
      type: String,
      required: true,
      index: true,
    },
    destination: {
      type: String,
      required: true,
      index: true,
    },
    scheduledDeparture: {
      type: Date,
      required: true,
      index: true,
    },
    scheduledArrival: {
      type: Date,
      required: true,
    },
    actualDeparture: {
      type: Date,
    },
    actualArrival: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Delayed", "Cancelled", "In-flight", "Landed"],
      default: "Scheduled",
      index: true,
    },
    type: {
      type: String,
      enum: ["Commercial", "Military", "Private"],
      required: true,
      index: true,
    },
    airline: {
      type: String,
      required: true,
      index: true,
    },
    aircraft: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    passengers: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

flightSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  id: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
  },
});

// Create indexes for common queries
flightSchema.index({ airline: 1, scheduledDeparture: 1 });
flightSchema.index({ status: 1, type: 1 });
flightSchema.index({ origin: 1, destination: 1 });

export default mongoose.models.Flight || mongoose.model("Flight", flightSchema);
