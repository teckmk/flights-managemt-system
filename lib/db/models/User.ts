import { encryptPassword } from "@/lib/utils/password";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Operator"],
      default: "Operator",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await encryptPassword(this.password);
  }
  next();
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  id: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
  },
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

export default mongoose.models.User || mongoose.model("User", userSchema);
