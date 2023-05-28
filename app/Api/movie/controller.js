import Movie from "../../models/Movie";
import User from "../../models/user";

const dataController = {
  // index
  async index(req, res, next) {
    try {
      const user = await User.findById(req.user._id).populate("movies");
      const foundMovies = user.movies;
      console.log("the found movies:", foundMovies);
      return res.json(foundMovies);
    } catch (error) {
      res.status(500).json({ error });
    }
    next();
  },

  // watched index
  async watchedIndex(req, res, next) {
    try {
      const user = await User.findById(req.user._id).populate("watchedMovies");
      const foundWatchedMovies = user.watchedMovies;
      return res.json(foundWatchedMovies);
    } catch (error) {
      console.log("watched movies index error", error);
      res.status(500).json({ error });
    }
  },

  // destroy
  async destroy(req, res, next) {
    const { id } = req.params;
    try {
      const deleteMovie = await Movie.findByIdAndDelete(id);
      console.log("the deleted movie", deleteMovie);
      return res.json({ message: "movie deleted successfully" });
    } catch (error) {
      console.log("Error in destroy route", error);
      res.status(500).json({ error });
    }
    next();
  },

  // update
  async update(req, res, next) {
    console.log("We are in update");
    const { id } = req.params;
    console.log("id of the movie", id);
    try {
      // Find the target movie in the user's movies array
      const targetMovieIndex = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { movies: id, watchedMovies: id } }
      );

      console.log("our found movie", targetMovieIndex);
      res.json({ message: "Movie updated successfully" });
    } catch (error) {
      console.log("update error", error);
      res.status(500).json({ error });
    }
    next();
  },

  // create
  async create(req, res, next) {
    const { imdbID } = req.body;
    console.log("IMDB movie", imdbID);
    try {
      // searching for an existing movie in the database
      const existingMovie = await Movie.findOne({
        imdbID: imdbID,
      }).populate();
      console.log("the existing movie", existingMovie);
      // if it exists, push it into the user movie array
      if (existingMovie) {
        console.log("We did go in here");
        const user = await User.findById(req.user._id).populate("movies");

        const userHasMovie = user.movies.some(
          (movie) => movie.imdbID === imdbID
        );
        const userHasWatchedMovie = user.watchedMovies.some(
          (movie) => movie.imdbID === imdbID
        );
        console.log("userHasMovie:", userHasMovie);
        console.log("userHasWatchedMovie:", userHasWatchedMovie);
        if (userHasMovie || userHasWatchedMovie) {
          return console.log("you already have this movie in your lists");
        } else {
          user.movies.push(existingMovie);
          await user.save();
          console.log("user movie collection", user.movies);
          return res.json(existingMovie);
        }
      } else {
        // if the movie doesn't already exist, create it and push it into the user's movie array
        const newMovie = await Movie.create({
          ...req.body,
        });
        const user = await User.findById(req.user._id).populate("movies");
        user.movies.push(newMovie);
        await user.save();
        return res.json(newMovie);
      }
    } catch (error) {
      console.log("create movie error", error);
      res.status(500).json({ error });
    }
    next();
  },

  // edit
  async edit(req, res, next) {
    const { id } = req.params;

    try {
      const user = await User.findById(req.user._id);

      // Find the target movie in the user's movies array
      const movieToPop = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { movies: id } }
      );
      const movieToPush = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { watchedMovies: id } }
      ).populate("watchedMovies");

      console.log("our edit found movie", movieToPop, movieToPush);

      res.json({ message: "Movie updated successfully" });
    } catch (error) {
      console.log("edit movie error", error);
      res.status(500).json({ error });
    }
    next();
  },

  // show
  async show(req, res, next) {
    const { id } = req.params;
    try {
      const targetMovie = await Movie.findById(id);
      console.log(targetMovie);
      return res.json(targetMovie);
    } catch (error) {
      console.log("show movie error", error);
      res.status(500).json({ error });
    }
    next();
  },
};

const apiController = {
  index(req, res, next) {
    res.json(res.locals.data.movies);
  },

  show(req, res, next) {
    res.json(res.locals.data.movie);
  },
};

export { dataController, apiController };
