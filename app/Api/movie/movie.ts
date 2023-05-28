import { NextApiRequest, NextApiResponse } from "next";
import { dataController, apiController } from "./controller";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      if (req.query.watched) {
        // watched Index
        dataController.watchedIndex(req, res, () => {
          apiController.index(req, res);
        });
      } else {
        // Index
        dataController.index(req, res, () => {
          apiController.index(req, res);
        });
      }
      break;
    case "DELETE":
      // Delete
      dataController.destroy(req, res, () => {
        apiController.show(req, res);
      });
      break;
    case "PUT":
      if (req.query.remove) {
        // Update
        dataController.update(req, res, () => {
          apiController.show(req, res);
        });
      } else {
        // Edit
        dataController.edit(req, res, () => {
          apiController.show(req, res);
        });
      }
      break;
    case "POST":
      // Create
      dataController.create(req, res, () => {
        apiController.show(req, res);
      });
      break;
    case "GET":
      // Show
      dataController.show(req, res, () => {
        apiController.show(req, res);
      });
      break;
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}
