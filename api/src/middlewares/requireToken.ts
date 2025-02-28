import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { success, failure } from "../utils/responses";
import type { NextFunction, Request, Response } from "express";

dotenv.config()

export function requireToken(req: Request, res: Response, next: NextFunction) {
    try {

        let token = req.headers?.authorization;

        if (!token) return success({ res, status: 401, message: "Unauthorized" });
        if (!token.startsWith("Bearer "))
            return success({ res, status: 401, message: "Token format wrong" });
        token = token.split(' ')[1]
        const uid = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).uid = uid;
        next()

    } catch (error) {
        return failure({ res, status:401,message: error });
}
}
