import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './movie.schema';
import { Model } from 'mongoose';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async create(movieData: any) {
    const movie = new this.movieModel({
      title: movieData.title,
      description: movieData.description,
      image: movieData.image,
      cast: movieData.cast, // Convert from string to number
    });
  
    return movie.save();
  }
  

  async findAll() {
    return this.movieModel.find();
  }

  async delete(id: string) {
    const result = await this.movieModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Movie not found');
    return {
      message: 'Movie deleted successfully'
    };
  }

  async update(id: string, data: Partial<Movie>) {
    const result = await this.movieModel.findByIdAndUpdate(id, data, { new: true });
    if (!result) throw new NotFoundException('Movie not found');
    return result;
  }
}
