import type { Request, Response } from "express";
import prisma from "../../datasource";
import { success, failure } from "../../utils/responses";

export const store = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = req.body;
        const category = await prisma.category.create({
            data: {
                name: data.name,
                description: data.description
            }
        });

        return success({ res, status: 201, data: category, message: "Category created" });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const findOne = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const id = Number(req.params.id)
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                movies: true
            }
        });
        return success({ res, data: category ?? "category not found" });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                movies: true
            }
        });
        return success({ res, data: categories });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const update = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id)
        const data = req.body;
        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description
            },
            include: {
                movies: true
            }
        });
        return success({ res, data: category, message: "Category updated successfully" });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const remove = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        await prisma.category.delete({
            where: { id }
        });
        return success({ res, message: "Category deleted successfully" });
    } catch (error) {
        return failure({ res, message: error });
    }
}