import { Group } from '@modules/groups/entities/group.entity';
import { Video } from '@modules/videos/entities/video.entity';
import { VideosService } from '@modules/videos/services/videos.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseInterface } from '@core/types/types';

describe('VideosService', () => {
  let service: VideosService;
  let videoRepo: jest.Mocked<Repository<Video>>;
  let groupRepo: jest.Mocked<Repository<Group>>;
  const queryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue({
      data: [],
      total: 0,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: getRepositoryToken(Video),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
            createQueryBuilder: jest.fn(() => queryBuilder),
          },
        },
        {
          provide: getRepositoryToken(Group),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    videoRepo = module.get(getRepositoryToken(Video));
    groupRepo = module.get(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return video by ID', async () => {
    const video = {
      id: '1',
      title: 'NestJS',
      url: 'https://example.com',
    } as Video;

    videoRepo.findOne.mockResolvedValue(video);

    const result = await service.one('1');

    expect(result).toEqual(video);
  });

  it('should return null if video not found', async () => {
    videoRepo.findOne.mockResolvedValue(null);

    const result = await service.one('123');

    expect(result).toBeNull();
  });

  it('should create a video with group', async () => {
    const dto = { title: 'New', url: 'https://example.com', groupId: '2' };
    const video = { id: '5', title: 'New' } as Video;
    const group = { id: '2' } as Group;

    videoRepo.create.mockReturnValue(video);
    groupRepo.findOne.mockResolvedValue(group);
    videoRepo.save.mockResolvedValue({ ...video, group });

    const result = await service.create(dto);

    expect(result).toEqual({ ...video, group });
  });

  it('should create a video without group', async () => {
    const dto = { title: 'Solo', url: 'https://example.com' };
    const video = { id: '6', title: 'Solo' } as Video;

    videoRepo.create.mockReturnValue(video);
    videoRepo.save.mockResolvedValue(video);

    const result = await service.create(dto);

    expect(result).toEqual(video);
  });

  it('should return all videos without filter', async () => {
    const list = [[{ id: '1' }, { id: '2' }], 2] as [Video[], number];
    const response = { data: list[0], total: list[1] } as ResponseInterface<Video>;

    queryBuilder.getManyAndCount.mockResolvedValue(list);

    const result = await service.all({});

    expect(result).toEqual(response);
  });

  it('should return filtered videos by groupId', async () => {
    const list = [[{ id: '3' }], 1] as [Video[], number];
    const response = { data: list[0], total: list[1] } as ResponseInterface<Video>;

    queryBuilder.getManyAndCount.mockResolvedValue(list);

    const result = await service.all({ filters: { groupId: '5' } });

    expect(result).toEqual(response);
  });

  it('should update an existing video', async () => {
    const original = { id: '1', title: 'Old', url: 'https://old' } as Video;
    const updated = { ...original, title: 'New' } as Video;

    videoRepo.findOne.mockResolvedValue(original);
    videoRepo.save.mockResolvedValue(updated);

    const result = await service.update('1', { title: 'New' });

    expect(result).toEqual(updated);
  });

  it('should return null when updating non-existent video', async () => {
    videoRepo.findOne.mockResolvedValue(null);

    const result = await service.update('99', {
      title: 'New',
      url: 'https://old',
      groupId: '10',
    });

    expect(result).toBeNull();
  });

  it('should remove video', async () => {
    const video = { id: '1' } as Video;

    videoRepo.findOne.mockResolvedValue(video);
    videoRepo.remove.mockResolvedValue(video);

    await service.remove('1');

    expect(videoRepo.remove).toHaveBeenCalledWith(video);
  });
});
