import { Router } from "express";
import * as Controller from "./controller";
import { requireToken } from "../../middlewares/requireToken";

const hostRouter = Router();

hostRouter.get("/:id", requireToken, Controller.findOne);
hostRouter.get("/", requireToken, Controller.findAll);
hostRouter.post("/", requireToken, Controller.store);
hostRouter.put("/:id", requireToken, Controller.update);
hostRouter.delete("/:id", requireToken, Controller.remove);

export default hostRouter;