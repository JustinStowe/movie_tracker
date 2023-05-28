import Comment from "@/models/comment";
import Movie from "@/models/Movie";
import User from "@/models/user";

const dataController = {
  // index
  async index(req, res, next) {
    console.log("index req", res);
    try {
      const movie = await Movie.find(req.movieid).populate("comments");
      const foundComments = movie.comments;
      console.log("the found comments", foundComments);
      return res.json(foundComments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
    next();
  },

  // destroy
  async destroy(req, res, next) {
    const { id } = req.params;
    try {
      const deleteComment = await Comment.findByIdAndDelete(id);
      console.log("the deleted comment", deleteComment);
      return;
    } catch (error) {
      console.log("deleted comment error", error);
      res.status(500).json({ error });
    }
    next();
  },

  // update
  async update(req, res, next) {
    const { id } = req.params;
    try {
      const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      console.log("updated comment", updatedComment);
      return updatedComment;
    } catch (error) {
      console.log("updated comment error", error);
      res.status(500).json({ error });
    }
    next();
  },

  // create
  // Define a pre-findOne middleware to populate comments field
  async create(req, res, next) {
    console.log("The req.body.movieId:", req.body._id);
    try {
      const user = await User.findById(req.user._id);
      const newComment = await Comment.create(req.body);
      console.log("the created comment", newComment);
      console.log("the found user", user);
      newComment.username = user;
      await newComment.save();
      user.comments.push(newComment);
      await user.save();
      const targetMovie = await Movie.findById(req.body.id);
      console.log("the target movie", targetMovie);
      targetMovie.comments.push(newComment);
      await targetMovie.save();
      console.log("the movie comments", targetMovie.comments);
    } catch (error) {
      console.log("create comment error:", error);
      res.status(500).json({ error });
    }
    next();
  },

  // show
  async show(req, res, next) {
    const { id } = req.params;
    try {
      const targetComment = await Comment.findById(id);
      console.log("show route comment", targetComment);
      res.locals.data.comment = targetComment;
    } catch (error) {
      console.log("show route comment error", error);
      res.status(500).json({ error });
    }
  },
};

const apiController = {
  index(req, res, next) {
    res.json(res.locals.data.comments);
  },

  show(req, res, next) {
    res.json(res.locals.data.comment);
  },
};

export { dataController, apiController };
