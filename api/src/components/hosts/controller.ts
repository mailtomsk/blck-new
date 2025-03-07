import type { Request, Response } from "express";
import prisma from "../../datasource";
import { success, failure } from "../../utils/responses";

export const store = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, bio } = req.body;
        
        // Validate required fields
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return failure({ 
                res, 
                status: 400, 
                message: "Name is required and must be a non-empty string" 
            });
        }

        // Create host
        const host = await prisma.host.create({
            data: {
                name: name.trim(),
                bio: bio ? bio.trim() : ""
            }
        });

        return success({ res, status: 201, data: host, message: "Host created" });
    } catch (error) {
        console.error('Error in store host:', error);
        return failure({ res, message: error });
    }
}

export const findOne = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        
        if (isNaN(id)) {
            return failure({ res, status: 400, message: "Invalid ID format" });
        }

        const host = await prisma.host.findUnique({
            where: { id },
            include: {
                movie_hosts: {
                    include: {
                        movie: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });

        if (!host) {
            return failure({ res, status: 404, message: "Host not found" });
        }

        // Transform the response to include movies directly
        const transformedHost = {
            ...host,
            movies: host.movie_hosts.map(mh => mh.movie),
            movie_hosts: undefined
        };

        return success({ res, data: transformedHost });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const hosts = await prisma.host.findMany({
            include: {
                movie_hosts: {
                    include: {
                        movie: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });

        // Transform the response to include movies directly
        const transformedHosts = hosts.map(host => ({
            ...host,
            movies: host.movie_hosts.map(mh => mh.movie),
            movie_hosts: undefined
        }));

        return success({ res, data: transformedHosts });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const update = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        const { name, bio } = req.body;

        if (isNaN(id)) {
            return failure({ res, status: 400, message: "Invalid ID format" });
        }

        // Validate if host exists
        const existingHost = await prisma.host.findUnique({
            where: { id }
        });

        if (!existingHost) {
            return failure({ res, status: 404, message: "Host not found" });
        }

        // Validate required fields
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return failure({ 
                res, 
                status: 400, 
                message: "Name is required and must be a non-empty string" 
            });
        }

        // Update the host
        const host = await prisma.host.update({
            where: { id },
            data: {
                name: name.trim(),
                bio: bio ? bio.trim() : existingHost.bio
            },
            include: {
                movie_hosts: {
                    include: {
                        movie: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });

        // Transform the response to include movies directly
        const transformedHost = {
            ...host,
            movies: host.movie_hosts.map(mh => mh.movie),
            movie_hosts: undefined
        };

        return success({ res, data: transformedHost, message: "Host updated successfully" });
    } catch (error) {
        console.error('Error in update host:', error);
        return failure({ res, message: error });
    }
}

export const remove = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return failure({ res, status: 400, message: "Invalid ID format" });
        }

        // Find the host first
        const host = await prisma.host.findUnique({
            where: { id }
        });

        if (!host) {
            return failure({ res, status: 404, message: "Host not found" });
        }

        // Delete the host from the database
        await prisma.host.delete({
            where: { id }
        });

        return success({ res, message: "Host deleted successfully" });
    } catch (error) {
        console.error('Error in delete host:', error);
        return failure({ res, message: error });
    }
}