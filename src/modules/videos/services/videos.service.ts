import { Video } from '@modules/videos/entities/video.entity';
import { CreateVideoParams, UpdateVideoParams, VideosListQueryParams } from '@modules/videos/types/service.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUndefined } from 'lodash';
import { Brackets, Repository } from 'typeorm';
import { ResponseInterface } from '@core/types/types';

@Injectable()
export class VideosService {
  @InjectRepository(Video)
  private videoRepository: Repository<Video>;

  public async all(params: VideosListQueryParams): Promise<ResponseInterface<Video>> {
    const { filters, page, perPage, search } = params;
    const query = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.group', 'group');

    if (page && perPage) {
      query
        .take(perPage ? perPage : 100)
        .skip(page > 1 ? ( page - 1 ) * perPage : 0);
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('video.title ILIKE :search', {
            search: `%${ search }%`,
          }).orWhere('video.description ILIKE :search', {
            search: `%${ search }%`,
          });
        }),
      );
    }

    for (const [ key, value ] of Object.entries(filters ?? {})) {
      if (isUndefined(value)) {
        continue;
      }

      switch (key) {
        case 'groupId': {
          query.andWhere('group.id = :groupId', { groupId: value });

          break;
        }

        case 'title': {
          query.andWhere('video.title ILIKE :title', { title: `%${ value }%` });

          break;
        }
      }
    }

    const [ list, total ] = await query.getManyAndCount();

    return {
      data: list,
      total,
    };
  }

  public async create(params: CreateVideoParams): Promise<Video> {
    return this.videoRepository.save(params);
  }

  public async one(id: string): Promise<Video | null> {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['group'],
    });

    if (!video) {
      return null;
    }

    return video;
  }

  public async update(
    id: string,
    params: UpdateVideoParams,
  ): Promise<Video | null> {
    const oldVideo = await this.one(id);

    if (!oldVideo) {
      return null;
    }

    return this.videoRepository.save({ ...oldVideo, ...params });
  }

  public async remove(id: string): Promise<void> {
    const video = await this.one(id);

    if (!video) {
      return;
    }

    await this.videoRepository.remove(video);
  }
}
