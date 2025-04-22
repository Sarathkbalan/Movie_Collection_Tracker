import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post()
@UseInterceptors(
  FileInterceptor('image', {
    storage: memoryStorage(),
  }),
)
async create(@UploadedFile() file: Express.Multer.File, @Body() body) {
  if (!file) {
    throw new BadRequestException('Image is required');
  }

  return this.movieService.create({
    title: body.title,
    description: body.description,
    cast: body.cast,
    image: file.buffer.toString('base64'), // Guaranteed to be present now
  });
}

  // @Post()
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: memoryStorage(),
  //   }),
  // )
  // async create(@UploadedFile() file: Express.Multer.File, @Body() body) {
  //   return this.movieService.create({
  //     title: body.title,
  //     description: body.description,
  //     cast: body.cast,
  //     image: file?.buffer.toString('base64') || '', // Store as base64 string
  //   });
  // }

  @Get()
  async getAll() {
    return this.movieService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.movieService.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    return this.movieService.update(id, body);
  }
}
