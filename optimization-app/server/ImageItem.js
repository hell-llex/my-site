import mongoose from "mongoose";

const ImgItem = new mongoose.Schema(
  {
    "name": {
      type: String,
      required: true
    },
    "pathJpg": {
      type: String,
      required: true
    },
    "pathWebp": {
      type: String,
      required: true
    },
    "pathThumbnail": {
      type: String,
      required: true
    },
    "description": {
      type: String,
      required: true
    },
    "category": {
      type: [String],
      required: true
    },
    "orientation": {
      type: String,
      required: true
    },
    "metadata": {
      type: Object
    },
  }
);

export default mongoose.model("ImgItem", ImgItem)