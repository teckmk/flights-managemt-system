import mongoose from "mongoose";

const alertConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    flightType: {
      type: String,
      enum: ["all", "commercial", "military", "private"],
      default: "all",
    },
    delayThreshold: {
      type: Number,
      required: true,
      default: 15,
    },
    notifyEmail: {
      type: Boolean,
      default: true,
    },
    notifyPush: {
      type: Boolean,
      default: true,
    },
    notifySMS: {
      type: Boolean,
      default: false,
    },
    emailRecipients: {
      type: String,
    },
    phoneNumbers: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

alertConfigSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  id: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
  },
});

alertConfigSchema.index({ userId: 1 });

export default mongoose.models.AlertConfig ||
  mongoose.model("AlertConfig", alertConfigSchema);
