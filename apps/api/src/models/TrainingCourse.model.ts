import mongoose from "mongoose";

const trainingCourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, enum: ["introductorio", "intermedio", "avanzado"], default: "intermedio" },
    access: { type: String, enum: ["public", "private"], default: "private" },
    coverImageUrl: String,
    price: String,
    duration: String,
    topics: [{
      title: { type: String, required: true, trim: true },
      summary: String,
      content: String,
      imageUrls: [{ type: String }],
      videoUrl: String,
      order: { type: Number, default: 0 }
    }],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    featured: { type: Boolean, default: false },
    publishedAt: Date
  },
  { timestamps: true }
);

export const TrainingCourse = mongoose.model("TrainingCourse", trainingCourseSchema);
