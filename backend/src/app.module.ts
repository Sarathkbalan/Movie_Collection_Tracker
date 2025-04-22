import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 

    MongooseModule.forRoot('mongodb://localhost:27017/Movie_collection_tracker'),
    UserModule,
    MoviesModule,
  ],
})
export class AppModule {}
