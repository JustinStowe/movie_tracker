import { NextApiRequest, NextApiResponse } from "next";
import { dataController, apiController } from "./controller";
import authenticate from "@/app/config/authenticate";
import requireAuth from "@/app/config/requireAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (req.query.friends !== undefined) {
      // Get all user's friends
      dataController.friendIndex(req, res, () => {
        apiController.index(req, res);
      });
    } else {
      // Get all users
      dataController.index(req, res, () => {
        apiController.index(req, res);
      });
    }
  } else if (req.method === "PUT") {
    if (req.query.friends !== undefined) {
      // Add a friend
      dataController.addFriend(req, res);
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  } else if (req.method === "POST") {
    if (req.query.login !== undefined) {
      // Post /api/users/login
      dataController.login(req, res, () => {
        apiController.auth(req, res);
      });
    } else {
      // POST /api/users
      dataController.create(req, res, () => {
        apiController.auth(req, res);
      });
    }
  } else if (req.method === "GET" && req.query["check-token"] !== undefined) {
    // Get /api/users/check-token
    authenticate(req, res, () => {
      requireAuth(req, res);
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
