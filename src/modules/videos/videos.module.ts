import { VideosController } from '@modules/videos/controllers/videos.controller';
import { Video } from '@modules/videos/entities/video.entity';
import { VideosService } from '@modules/videos/services/videos.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
