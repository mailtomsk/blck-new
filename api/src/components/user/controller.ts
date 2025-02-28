import type { Request, Response } from "express";
import prisma from "../../datasource";
import { success, failure } from "../../utils/responses";
import { hashPassword, comparePassword, generateToken } from "../../utils/auth";


export const store = async (req: Request, res: Response): Promise<Response> => {
    try {
        
        const data = req.body;
        data.password = hashPassword(data.password);
        data.last_session = new Date(data.last_session ?? null);
        data.date_born = new Date(data.date_born);

        const user = await prisma.user.create({ data });

        return success({ res, status: 201, data: user, message: "User created successfully" });
    } catch (error) {
        return failure({ res, message: error });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password, type } = req.body;

        const user = await prisma.user.findFirst({ where: { email, role: type } });

        if (!user) {
            return failure({ res, status: 403, message: "Username doesn't exist" });
        } else {
            if (!comparePassword(user?.password as string, password)) {
                return failure({ res, message: "Incorrect password" });
            } else {
                const token = generateToken(user?.id);
                const loggedUser = await prisma.user.update({
                    where: {
                        email: user.email,
                    },
                    data: {
                        last_session: new Date(),
                    },
                })
                return success({ res, data: { loggedUser, token }, message: "Logged user" });
            }
        }
    } catch (error) {
        return failure({ res, message: error });
    }
};

export const findAll = async (_req: Request, res: Response): Promise<Response> => {

    try {
        const users = await prisma.user.findMany();
        return success({ res, data: users });
    } catch (error) {
        return failure({ res, message: error });
    }

}

export const findOne = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const id =Number(req.params.id)
        const user =await prisma.user.findUnique({where:{id}});
        return success({ res, data: user ?? "User not found" });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const update = async(req:Request, res:Response):Promise<Response> =>{
    try {
        const id =Number(req.params.id)
        const data = req.body;
        const user =await prisma.user.update({where:{id}, data:{
            "name": data.name,
            "email": data.email,
            "password": hashPassword(data.password),
            "date_born": new Date(data.date_born),
            "phone_number": data.phone_number,
            "role":data.role
        }})
        return success({ res, data: user, message: "User updated successfully" });
    } catch (error) {
        return failure({ res, message: error });
    }
}