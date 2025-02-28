import type { Request, Response } from "express";
import prisma from "../../datasource";
import { success, failure } from "../../utils/responses";
import { uploadToS3, deleteFromS3 } from "../../utils/s3";

// Define the movie request type
export type MovieRequest = Request & {
    files?: {
        [fieldname: string]: Express.Multer.File[];
    };
};

export const store = async (req: MovieRequest, res: Response): Promise<Response> => {
    try {
        const data = req.body;
        
        // Initialize URLs as empty strings
        let video_url = '';
        let thumbnail_url = '';

        // Check if files exist and handle them
        if (req.files) {
            if (req.files['video']?.[0]) {
                video_url = await uploadToS3(req.files['video'][0], 'videos');
            }

            if (req.files['thumbnail']?.[0]) {
                thumbnail_url = await uploadToS3(req.files['thumbnail'][0], 'thumbnails');
            }
        }

        // Validate required fields
        if (!data.title || !data.categories || !data.duration || !data.release_year) {
            return failure({ 
                res, 
                status: 400, 
                message: "Missing required fields: title, categoryIds, duration, release_year are required" 
            });
        }

        // Parse category IDs - handle both array and single value
        let categories: number[] = [];
        if (Array.isArray(data.categories)) {
            categories = data.categories.map((id: string) => parseInt(id));
        } else if (typeof data.categories === 'string') {
            // If it's a comma-separated string
            if (data.categories.includes(',')) {
                categories = JSON.parse(data.categories);
            } else {
                categories = [parseInt(data.categories)];
            }
        }

        // Create movie with categories
        const movie = await prisma.movie.create({
            data: {
                title: data.title,
                duration: data.duration,
                release_year: parseInt(data.release_year),
                rating: data.rating || '',
                description: data.description || '',
                cast: data.cast || '',         
                director: data.director || '', 
                tags: data.tags || '', 
                video_url,
                thumbnail_url,
                categories: {
                    create: categories.map(categoryId => ({
                        category: {
                            connect: { id: categoryId }
                        }
                    }))
                }
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });

        // Transform the response to include categories directly
        const formattedMovie = {
            ...movie,
            categories: movie.categories.map(mc => mc.category)
        };

        return success({ res, status: 201, data: formattedMovie, message: "Movie created" });
    } catch (error) {
        console.error('Error in store movie:', error);
        return failure({ res, message: error });
    }
}

export const findOne = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const id = Number(req.params.id)
        const movie = await prisma.movie.findUnique({
            where: { id },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });

        if (!movie) {
            return success({ res, data: "movie not found" });
        }

        // Transform the response to include categories directly
        const formattedMovie = {
            ...movie,
            categories: movie.categories.map(mc => mc.category)
        };

        return success({ res, data: formattedMovie });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tags = req.query.tags as string;
        const movies = await prisma.movie.findMany({
            where: {
                tags: {
                    contains: tags
                }
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });

        // Transform the response to include categories directly
        const formattedMovies = movies.map(movie => ({
            ...movie,
            categories: movie.categories.map(mc => mc.category)
        }));

        return success({ res, data: formattedMovies });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const update = async (req: MovieRequest, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        // Validate if movie exists
        const existingMovie = await prisma.movie.findUnique({
            where: { id }
        });

        if (!existingMovie) {
            return failure({ res, status: 404, message: "Movie not found" });
        }

        // Prepare update data
        const updateData: any = {
            title: data.title || undefined,
            duration: data.duration || undefined,
            release_year: data.release_year ? parseInt(data.release_year) : undefined,
            rating: data.rating || undefined,
            description: data.description || undefined,
            cast: data.cast || undefined,         
            director: data.director || undefined,  
            tags: data.tags || undefined,
        };

        // Handle file uploads if present
        if (req.files) {
            if (req.files['video']?.[0]) {
                updateData.video_url = await uploadToS3(req.files['video'][0], 'videos');
            }

            if (req.files['thumbnail']?.[0]) {
                updateData.thumbnail_url = await uploadToS3(req.files['thumbnail'][0], 'thumbnails');
            }
        }

        // Remove undefined values
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        // Handle category updates if present
        let categoryUpdateOperations = {};
        if (data.categories) {
            // Parse category IDs - handle both array and single value
            let categories: number[] = [];
            if (Array.isArray(data.categories)) {
                categories = data.categories.map((id: string) => parseInt(id));
            } else if (typeof data.categories === 'string') {
                // If it's a comma-separated string
                if (data.categories.includes(',')) {
                    categories = JSON.parse(data.categories);
                } else {
                    categories = [parseInt(data.categories)];
                }
            }

            // First delete all existing category connections
            categoryUpdateOperations = {
                categories: {
                    deleteMany: {},
                    create: categories.map(categoryId => ({
                        category: {
                            connect: { id: categoryId }
                        }
                    }))
                }
            };
        }

        // Update the movie with all changes
        const movie = await prisma.movie.update({
            where: { id },
            data: {
                ...updateData,
                ...categoryUpdateOperations
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });

        // Transform the response to include categories directly
        const formattedMovie = {
            ...movie,
            categories: movie.categories.map(mc => mc.category)
        };

        return success({ res, data: formattedMovie, message: "Movie updated successfully" });
    } catch (error) {
        console.error('Error in update movie:', error);
        return failure({ res, message: error });
    }
}

export const remove = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);

        // Find the movie first to get the file URLs
        const movie = await prisma.movie.findUnique({
            where: { id }
        });

        if (!movie) {
            return failure({ res, status: 404, message: "Movie not found" });
        }

        // Delete the movie from the database
        // Note: The MovieCategory records will be automatically deleted due to the onDelete: Cascade setting
        await prisma.movie.delete({
            where: { id }
        });

        // Delete associated files from S3
        try {
            if (movie.video_url) {
                const videoKey = movie.video_url.split('.com/')[1];
                await deleteFromS3(videoKey);
            }
            
            if (movie.thumbnail_url) {
                const thumbnailKey = movie.thumbnail_url.split('.com/')[1];
                await deleteFromS3(thumbnailKey);
            }
        } catch (s3Error) {
            console.error('Error deleting files from S3:', s3Error);
            // Continue with the response even if S3 deletion fails
        }

        return success({ res, message: "Movie deleted successfully" });
    } catch (error) {
        console.error('Error in delete movie:', error);
        return failure({ res, message: error });
    }
}