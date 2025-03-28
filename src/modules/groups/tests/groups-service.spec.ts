import { Group } from '@modules/groups/entities/group.entity';
import { GroupsService } from '@modules/groups/services/groups.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('GroupsService', () => {
  let service: GroupsService;
  let repo: jest.Mocked<Repository<Group>>;

  const queryBuilderMock = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn(() => queryBuilderMock),
          },
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    repo = module.get(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a group by ID', async () => {
    const mockGroup = { id: '1', name: 'Frontend' } as Group;

    repo.findOne.mockResolvedValue(mockGroup);

    const result = await service.one('1');

    expect(result).toEqual(mockGroup);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['parent', 'children', 'videos'],
    });
  });

  it('should return null if group not found', async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.one('999');

    expect(result).toBeNull();
  });

  it('should return all groups', async () => {
    const mockGroups = [{ id: '1' }, { id: '2' }] as Group[];

    queryBuilderMock.getMany.mockResolvedValueOnce(mockGroups);

    const result = await service.all({});

    expect(result).toEqual(mockGroups);
  });

  it('should filter groups by name', async () => {
    const resultGroups = [{ id: '10', name: 'Frontend' }] as Group[];

    queryBuilderMock.getMany.mockResolvedValueOnce(resultGroups);

    const result = await service.all({ name: 'Front' });

    expect(result).toEqual(resultGroups);
  });

  it('should filter groups by parentId', async () => {
    const filtered = [{ id: '11', parent: { id: '5' } }] as Group[];

    queryBuilderMock.getMany.mockResolvedValueOnce(filtered);

    const result = await service.all({ parentId: '5' });

    expect(result).toEqual(filtered);
  });

  it('should create a new group', async () => {
    const name = 'Backend';
    const savedGroup = { id: '2', name } as Group;

    repo.save.mockResolvedValue(savedGroup);

    const result = await service.create({ name });

    expect(result).toEqual(savedGroup);
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ name }));
  });

  it('should update a group', async () => {
    const group = { id: '3', name: 'Old Name', description: 'Old' } as Group;
    const updatedGroup = { ...group, name: 'New Name' } as Group;

    repo.findOne.mockResolvedValue(group);
    repo.save.mockResolvedValue(updatedGroup);

    const result = await service.update('3', { name: 'New Name' });

    expect(result).toEqual(updatedGroup);
    expect(repo.save).toHaveBeenCalledWith({
      ...group,
      name: 'New Name',
      parent: null,
    });
  });

  it('should return null when updating a non-existent group', async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.update('999', { name: 'Any' });

    expect(result).toBeNull();
  });

  it('should remove a group', async () => {
    const group = { id: '4', name: 'ToDelete' } as Group;

    repo.findOne.mockResolvedValue(group);
    repo.remove.mockResolvedValue(group);

    await service.remove('4');

    expect(repo.remove).toHaveBeenCalledWith(group);
  });
});
