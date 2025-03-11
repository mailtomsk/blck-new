import { Router } from "express";
import * as Controller from "./controller";
import { requireToken } from "../../middlewares/requireToken";

const orderRouter = Router();

orderRouter.get("/:id", requireToken, Controller.findOne);
orderRouter.get("/", Controller.findAll);
// orderRouter.post("/", requireToken, Controller.store);
orderRouter.post("/", Controller.store);
// orderRouter.put("/:id/status", requireToken, Controller.updateStatus);
orderRouter.put("/:id/status", requireToken, Controller.updateStatus);

export default orderRouter;