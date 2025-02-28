import { Router } from "express";
import * as Controller from "./controller";

const userRouter = Router();

userRouter.get("/", Controller.findAll)
userRouter.get("/:id",Controller.findOne)
userRouter.post("/", Controller.store);
userRouter.post("/login", Controller.login);
userRouter.put("/:id", Controller.update)

export default userRouter;