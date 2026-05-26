import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  content: { type: String, default: "" },
  imageUrls: [{ type: String }],
  videoUrl: { type: String, default: "" },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "published"], default: "draft" }
});

const blockSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  topics: [topicSchema]
});

const trainingCourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    learningObjectives: [{ type: String }],
    coverImageUrl: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    blocks: [blockSchema],
    publishedAt: Date
  },
  { timestamps: true }
);

export const TrainingCourse = mongoose.model("TrainingCourse", trainingCourseSchema);
