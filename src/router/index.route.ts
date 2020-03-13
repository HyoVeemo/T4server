import * as express from "express";
import { verify } from "../middleware/auth.middleware"

class IndexRoute {
  public IndexRouter: express.Router = express.Router();
  constructor() {
    this.IndexRouter.get("/", verify, (req, res, next) => {
      res.send({
        message: "index Page"
      });
    });
  }
}

export const indexRoute: IndexRoute = new IndexRoute();
