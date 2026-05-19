import mongoose from "mongoose";

const trainingChatMessageSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingCourse", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseTitle: { type: String, required: true },
    courseSlug: { type: String, required: true, index: true },
    blockId: String,
    blockTitle: String,
    topicId: String,
    topicTitle: String,
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "reviewed", "replied", "archived"], default: "new" },
    source: { type: String, default: "training_public_chat" },
    userAgent: String,
    ip: String
  },
  { timestamps: true }
);

export const TrainingChatMessage = mongoose.model("TrainingChatMessage", trainingChatMessageSchema);
