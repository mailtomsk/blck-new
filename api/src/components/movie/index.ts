import { Router } from "express";
import * as Controller from "./controller";
import { requireToken } from "../../middlewares/requireToken";
import { upload } from "../../middlewares/upload";
import type { RequestHandler } from "express";

const movieRouter = Router();

// Type assertion for middleware
const uploadMiddleware = upload.fields([
    { name: 'thumbnail', maxCount: 1 }
]) as unknown as RequestHandler;

movieRouter.get("/:id", Controller.findOne);
movieRouter.get("/", Controller.findAll);
movieRouter.post("/", 
    requireToken, 
    uploadMiddleware,
    Controller.store as RequestHandler
);
movieRouter.put("/:id", 
    requireToken,
    uploadMiddleware,
    Controller.update as RequestHandler
);
movieRouter.delete("/:id", requireToken, Controller.remove);

export default movieRouter;