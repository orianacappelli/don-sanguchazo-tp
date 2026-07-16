import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    // Agregamos el campo para el emoji (que ya venías usando)
    icon: {
      type: String,
      default: "🥪",
    },
    // Agregamos el campo para la imagen
    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default mongoose.models.Category || mongoose.model('Category', CategorySchema, 'categories');