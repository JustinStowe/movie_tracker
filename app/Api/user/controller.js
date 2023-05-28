import User from "@/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const checkToken = (req, res) => {
  console.log("req.user", req.user);
  res.json(req.exp);
};

const dataController = {
  async index(req, res, next) {
    try {
      const loggedInUser = req.user._id;
      const users = await User.find({ _id: { $ne: loggedInUser } });
      console.log("all the users", users);
      res.locals.data.users = users;
    } catch (error) {
      console.log("get users error", error);
      res.status(500).json({ error });
    }
    next();
  },

  async friendIndex(req, res, next) {
    try {
      const user = await User.findById(req.user._id).populate("friends");
      const friends = user.friends;
      res.locals.data.friends = friends;
      next();
    } catch (error) {
      console.log("friend index error:", error);
      res.status(500).json({ error });
    }
  },

  async addFriend(req, res, next) {
    const friendId = req.body.friend;
    console.log("friend data", friendId);
    try {
      const user = await User.findById(req.user._id).populate("friends");
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "You are already friends" });
      }
      user.friends.push(friendId);
      await user.save();
      res.status(200).json({ message: "Friend added successfully." });
    } catch (error) {
      console.log("add a friend error", error);
      res.status(500).json({ error });
    }
  },

  async create(req, res, next) {
    try {
      const user = await User.create(req.body);
      const token = createJWT(user);

      res.locals.data.user = user;
      res.locals.data.token = token;
      next();
    } catch (error) {
      res.status(400).json(error);
    }
  },

  async login(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email });
      console.log("User in controller", user);
      if (!user) throw new Error();
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) throw new Error();
      res.locals.data.user = user;
      res.locals.data.token = createJWT(user);
      next();
    } catch (error) {
      console.log("The log in error", error);
      res.status(400).json("Bad Cedentials");
    }
  },
};

const apiController = {
  index(req, res) {
    res.json(res.locals.data.users);
  },
  friendIndex(req, res) {
    res.json(res.locals.data.friends);
  },
  auth(req, res) {
    res.json(res.locals.data.token);
  },
};

export { checkToken, dataController, apiController };

/** Helper function */

function createJWT(user) {
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: "24h" });
}
