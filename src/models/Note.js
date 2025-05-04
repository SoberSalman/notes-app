import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    fileType: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Note", NoteSchema);
