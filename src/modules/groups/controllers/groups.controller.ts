import { AuthRole } from '@modules/auth/decorators/auth-role.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/auth-jwt.guard';
import { RolesGuard } from '@modules/auth/guards/auth-role.guard';
import { Group } from '@modules/groups/entities/group.entity';
import { GroupNotFoundGuard } from '@modules/groups/guards/groups-not-found.guard';
import { PreventCircularGroupGuard } from '@modules/groups/guards/groups-prevent-circular.guard';
import { GroupsCreateRequest } from '@modules/groups/requests/groups-create.request';
import { GroupsEditRequest } from '@modules/groups/requests/groups-edit.request';
import { GroupsListQueryRequest } from '@modules/groups/requests/groups-list-query.request';
import { GroupsTreeQueryRequest } from '@modules/groups/requests/groups-tree-query.request';
import { GroupsService } from '@modules/groups/services/groups.service';
import { UserRole } from '@modules/users/constans';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('groups')
export class GroupsController {
  public constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @AuthRole(UserRole.VIEWER, UserRole.EDITOR)
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter groups by name (partial match)',
  })
  @ApiQuery({
    name: 'parentId',
    required: false,
    type: String,
    description: 'Filter groups by parent group ID',
  })
  @ApiResponse({ status: 200, description: 'Returns a list of groups' })
  public index(@Query() query: GroupsListQueryRequest): Promise<Group[]> {
    return this.groupsService.all(query);
  }

  @Get('tree')
  @AuthRole(UserRole.VIEWER, UserRole.EDITOR)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated tree of groups',
  })
  public getTree(
    @Query() query: GroupsTreeQueryRequest,
  ): Promise<{ data: Group[]; total: number }> {
    return this.groupsService.getPaginatedTree(query.page, query.limit);
  }

  @Get(':id')
  @UseGuards(GroupNotFoundGuard)
  @AuthRole(UserRole.VIEWER, UserRole.EDITOR)
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Returns the group by ID' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  public view(@Param('id') id: string): Promise<Group | null> {
    return this.groupsService.one(id);
  }

  @Post()
  @UseGuards(PreventCircularGroupGuard)
  @AuthRole(UserRole.EDITOR)
  @ApiBody({ type: GroupsCreateRequest })
  @ApiResponse({ status: 201, description: 'Creates a new group' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  public async create(
    @Body() createGroupDto: GroupsCreateRequest,
  ): Promise<Group> {
    return this.groupsService.create({
      name: createGroupDto.name,
      description: createGroupDto.description,
      parentId: createGroupDto.parentId,
    });
  }

  @Patch(':id')
  @UseGuards(GroupNotFoundGuard, PreventCircularGroupGuard)
  @AuthRole(UserRole.EDITOR)
  @ApiParam({ name: 'id', description: 'Group ID to update' })
  @ApiBody({ type: GroupsEditRequest })
  @ApiResponse({
    status: 200,
    description: 'Updates and returns the updated group',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  public async edit(
    @Param('id') id: string,
    @Body() updateGroupDto: GroupsEditRequest,
  ): Promise<Group | null> {
    return this.groupsService.update(id, {
      name: updateGroupDto.name,
      description: updateGroupDto.description,
      parentId: updateGroupDto.parentId,
    });
  }

  @Delete(':id')
  @UseGuards(GroupNotFoundGuard)
  @AuthRole(UserRole.EDITOR)
  @ApiParam({ name: 'id', description: 'Group ID to delete' })
  @ApiResponse({ status: 200, description: 'Group successfully deleted' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  public async delete(@Param('id') id: string): Promise<void> {
    return this.groupsService.remove(id);
  }
}
