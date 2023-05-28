import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 6;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  picture?: string;
  comments: mongoose.Schema.Types.ObjectId[];
  movies: mongoose.Schema.Types.ObjectId[];
  watchedMovies: mongoose.Schema.Types.ObjectId[];
  friends: mongoose.Schema.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 3,
      required: true,
    },
    picture: { type: String, required: false },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    watchedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
