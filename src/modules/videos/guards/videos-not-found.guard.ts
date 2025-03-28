import { BaseGuard } from '@core/guards/base.guard';
import { VideosService } from '@modules/videos/services/videos.service';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class VideoNotFoundGuard extends BaseGuard<{ id: string }> {
  @Inject(VideosService)
  private videosService: VideosService;

  public async process(): Promise<boolean> {
    const id = this.request.params.id;

    if (!id) {
      this.error('Invalid video ID');
    }

    const video = await this.videosService.one(id).catch(() => null);

    if (!video) {
      this.error(`Video with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return true;
  }
}
