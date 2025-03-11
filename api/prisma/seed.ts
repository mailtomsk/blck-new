import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function readCSV(filePath: string) {
  return new Promise<any[]>((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function seed() {
  try {
    const dataFolder = path.join(__dirname, 'data');

    // Read and insert categories
    const categories = await readCSV(path.join(dataFolder, 'categories.csv'));
    for (const category of categories) {
      await prisma.category.upsert({
        where: { id: Number(category.id) },
        update: { name: category.name, description: category.description },
        create: {
          id: Number(category.id),
          name: category.name,
          description: category.description,
        },
      });
    }

    // Read and insert hosts
    const hosts = await readCSV(path.join(dataFolder, 'hosts.csv'));
    for (const host of hosts) {
      await prisma.host.upsert({
        where: { id: Number(host.id) },
        update: { name: host.name, bio: host.bio },
        create: {
          id: Number(host.id),
          name: host.name,
          bio: host.bio
        },
      });
    }

    // Read and insert movies
    const movies = await readCSV(path.join(dataFolder, 'movies.csv'));
    for (const movie of movies) {
      const movieHosts = movie.hostIds ? JSON.parse(movie.hostIds).map((hostId: string) => ({
        hostId: Number(hostId)
      })) : [];

      await prisma.movie.upsert({
        where: { id: Number(movie.id) },
        update: {
          title: movie.title,
          description: movie.description,
          thumbnail_url: movie.thumbnail_url,
          video_url: movie.video_url,
          release_year: Number(movie.release_year),
          duration: movie.duration,
          rating: movie.rating,
          director: movie.director,
          cast: movie.cast,
          products_reviewed: movie.products_reviewed,
          key_highlights: movie.key_highlights,
          additional_context: movie.additional_context,
          movie_hosts: {
            create: movieHosts
          }
        },
        create: {
          id: Number(movie.id),
          title: movie.title,
          description: movie.description,
          thumbnail_url: movie.thumbnail_url,
          video_url: movie.video_url,
          release_year: Number(movie.release_year),
          duration: movie.duration,
          rating: movie.rating,
          director: movie.director,
          cast: movie.cast,
          products_reviewed: movie.products_reviewed,
          key_highlights: movie.key_highlights,
          additional_context: movie.additional_context,
          movie_hosts: {
            create: movieHosts
          }
        },
      });
    }

    // Read and insert users
    const users = await readCSV(path.join(dataFolder, 'users.csv'));
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: Number(user.id) },
        update: {
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
          password: user.password, // Assuming passwords are hashed
          role: user.role
        },
        create: {
          id: Number(user.id),
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
          password: user.password, // Assuming passwords are hashed
          role: user.role
        },
      });
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });