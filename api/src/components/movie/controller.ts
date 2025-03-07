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
        
        // Initialize thumbnail URL as empty string
        let thumbnail_url = '';

        // Check if thumbnail file exists and handle it
        if (req.files && req.files['thumbnail']?.[0]) {
            thumbnail_url = await uploadToS3(req.files['thumbnail'][0], 'thumbnails');
        } else {
            return failure({ 
                res, 
                status: 400, 
                message: "Thumbnail file is required" 
            });
        }

        // Validate required fields
        if (!data.title || !data.categoryId || !data.description || !data.video_url) {
            return failure({ 
                res, 
                status: 400, 
                message: "Missing required fields: title, categoryId, description, video_url are required" 
            });
        }

        // Parse hosts if provided
        let hosts: number[] = [];
        if (data.hostIds) {
            try {
                hosts = JSON.parse(data.hostIds);
                if (!Array.isArray(hosts)) {
                    hosts = [];
                }
            } catch (e) {
                console.error("Error parsing hosts:", e);
                hosts = [];
            }
        }

        // Create movie
        const movie = await prisma.movie.create({
            data: {
                title: data.title,
                categoryId: parseInt(data.categoryId),
                description: data.description,
                video_url: data.video_url,
                thumbnail_url,
                show: data.show || "",
                products_reviewed: data.products_reviewed || "",
                key_highlights: data.key_highlights || "",
                rating: data.rating || "",
                additional_context: data.additional_context || "",
                duration: data.duration || "",
                release_year: data.release_year ? parseInt(data.release_year) : 0,
                cast: data.cast || "",
                director: data.director || "",
                movie_hosts: {
                    create: hosts.map(hostId => ({
                        hostId: parseInt(hostId.toString())
                    }))
                }
            },
            include: {
                category: true,
                movie_hosts: {
                    include: {
                        host: true
                    }
                }
            }
        });

        // Transform the response to include hosts directly
        const { movie_hosts, ...transformedMovie } = {
            ...movie,
            hosts: movie.movie_hosts.map(mh => mh.host)
        };

        return success({ res, status: 201, data: transformedMovie, message: "Movie created" });
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
                category: true,
                movie_hosts: {
                    include: {
                        host: true
                    }
                }
            }
        });

        if (!movie) {
            return success({ res, data: "movie not found" });
        }

        // Transform the response to include hosts directly
        const { movie_hosts, ...transformedMovie } = {
            ...movie,
            hosts: movie.movie_hosts.map(mh => mh.host)
        };

        return success({ res, data: transformedMovie });
    } catch (error) {
        return failure({ res, message: error });
    }
}

export const findAll = async (req: Request, res: Response): Promise<Response> => {
    try {
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
        const hostId = req.query.hostId ? Number(req.query.hostId) : undefined;
        
        // Build where clause based on query parameters
        const whereClause: any = {};
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }
        if (hostId) {
            whereClause.movie_hosts = {
                some: {
                    hostId: hostId
                }
            };
        }
        
        const movies = await prisma.movie.findMany({
            where: whereClause,
            include: {
                category: true,
                movie_hosts: {
                    include: {
                        host: true
                    }
                }
            }
        });

        // Transform the response to include hosts directly
        const transformedMovies = movies.map(movie => {
            const { movie_hosts, ...transformedMovie } = {
                ...movie,
                hosts: movie.movie_hosts.map(mh => mh.host)
            } as any;
            return transformedMovie;
        });

        return success({ res, data: transformedMovies });
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
            title: data.title,
            description: data.description,
            video_url: data.video_url,
            categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
            show: data.show || undefined,
            products_reviewed: data.products_reviewed || undefined,
            key_highlights: data.key_highlights || undefined,
            rating: data.rating || undefined,
            additional_context: data.additional_context || undefined,
            duration: data.duration || undefined,
            release_year: data.release_year ? parseInt(data.release_year) : undefined,
            cast: data.cast || undefined,
            director: data.director || undefined
        };

        // Handle thumbnail upload if present
        if (req.files && req.files['thumbnail']?.[0]) {
            updateData.thumbnail_url = await uploadToS3(req.files['thumbnail'][0], 'thumbnails');
            
            // Delete old thumbnail file if exists
            if (existingMovie.thumbnail_url) {
                try {
                    const thumbnailKey = existingMovie.thumbnail_url.split('.com/')[1];
                    await deleteFromS3(thumbnailKey);
                } catch (s3Error) {
                    console.error('Error deleting old thumbnail from S3:', s3Error);
                }
            }
        }

        // Remove undefined values
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        // Parse hosts if provided
        let hosts: number[] = [];
        if (data.hostIds) {
            try {
                hosts = JSON.parse(data.hostIds);
                if (!Array.isArray(hosts)) {
                    hosts = [];
                }
            } catch (e) {
                console.error("Error parsing hosts:", e);
                hosts = [];
            }
        }

        // Update the movie
        const movie = await prisma.$transaction(async (prisma) => {
            // First delete existing host relationships if hosts are provided
            if (data.hostIds) {
                await prisma.movieHost.deleteMany({
                    where: { movieId: id }
                });
            }
            
            // Update the movie
            const updatedMovie = await prisma.movie.update({
                where: { id },
                data: {
                    ...updateData,
                    ...(data.hostIds ? {
                        movie_hosts: {
                            create: hosts.map(hostId => ({
                                hostId: parseInt(hostId.toString())
                            }))
                        }
                    } : {})
                },
                include: {
                    category: true,
                    movie_hosts: {
                        include: {
                            host: true
                        }
                    }
                }
            });
            
            return updatedMovie;
        });

        // Transform the response to include hosts directly
        const { movie_hosts, ...transformedMovie } = {
            ...movie,
            hosts: movie.movie_hosts.map(mh => mh.host)
        } as any;
        delete transformedMovie.movie_hosts;

        return success({ res, data: transformedMovie, message: "Movie updated successfully" });
    } catch (error) {
        console.error('Error in update movie:', error);
        return failure({ res, message: error });
    }
}

export const remove = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);

        // Find the movie first to get the thumbnail URL
        const movie = await prisma.movie.findUnique({
            where: { id }
        });

        if (!movie) {
            return failure({ res, status: 404, message: "Movie not found" });
        }

        // Delete the movie from the database
        await prisma.movie.delete({
            where: { id }
        });

        // Delete associated thumbnail from S3 if exists
        if (movie.thumbnail_url) {
            try {
                const thumbnailKey = movie.thumbnail_url.split('.com/')[1];
                await deleteFromS3(thumbnailKey);
            } catch (s3Error) {
                console.error('Error deleting thumbnail from S3:', s3Error);
                // Continue with the response even if S3 deletion fails
            }
        }

        return success({ res, message: "Movie deleted successfully" });
    } catch (error) {
        console.error('Error in delete movie:', error);
        return failure({ res, message: error });
    }
}