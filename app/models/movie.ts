import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMovie extends Document {
  Title: string;
  Year?: number;
  imdbID?: string;
  Type?: string;
  Poster?: string;
  completed: boolean;
  comments: mongoose.Schema.Types.ObjectId[];
}

const movieSchema: Schema<IMovie> = new mongoose.Schema({
  Title: { type: String, required: true },
  Year: { type: Number },
  imdbID: { type: String },
  Type: { type: String },
  Poster: { type: String },
  completed: { type: Boolean, default: false },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Movie: Model<IMovie> =
  mongoose.models.Movie || mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;
