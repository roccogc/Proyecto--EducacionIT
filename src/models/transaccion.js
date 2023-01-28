import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
    }

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("transaccion", NoteSchema);
