import { Router } from "express";
import * as Controller from "./controller";
import { requireToken } from "../../middlewares/requireToken";

const categoryRouter = Router();

categoryRouter.get("/:id", Controller.findOne);
categoryRouter.get("/", Controller.findAll);
categoryRouter.post("/", requireToken, Controller.store);
categoryRouter.put("/:id", requireToken, Controller.update);
categoryRouter.delete("/:id", requireToken, Controller.remove);

export default categoryRouter;