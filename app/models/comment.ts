import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
  body: string;
  username: mongoose.Schema.Types.ObjectId;
}

const commentSchema: Schema<IComment> = new mongoose.Schema(
  {
    body: { type: String, required: true },
    username: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
