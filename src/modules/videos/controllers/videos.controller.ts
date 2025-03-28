import { AuthRole } from '@modules/auth/decorators/auth-role.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/auth-jwt.guard';
import { RolesGuard } from '@modules/auth/guards/auth-role.guard';
import { UserRole } from '@modules/users/constans';
import { Video } from '@modules/videos/entities/video.entity';
import { VideoNotFoundGuard } from '@modules/videos/guards/videos-not-found.guard';
import { VideosCreateRequest } from '@modules/videos/requests/videos-create.request';
import { VideosEditRequest } from '@modules/videos/requests/videos-edit.request';
import { VideosListQueryRequest } from '@modules/videos/requests/videos-list-query.request';
import { VideosService } from '@modules/videos/services/videos.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterface } from '@core/types/types';

@ApiTags('Videos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('videos')
export class VideosController {
  public constructor(private readonly videosService: VideosService) {}

  @Get()
  @AuthRole(UserRole.VIEWER, UserRole.EDITOR)
  @ApiQuery({
    name: 'groupId',
    required: false,
    type: String,
    description: 'Filter videos by group ID',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Filter videos by title',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search videos by title or description',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Number of videos per page',
  })
  @ApiResponse({ status: 200, description: 'Returns a list of videos' })
  public async index(
    @Query() query: VideosListQueryRequest,
  ): Promise<ResponseInterface<Video>> {
    const { groupId, title, page, perPage, search } = query;
    const filters = {
      groupId,
      title,
    };

    return this.videosService.all({
      page,
      perPage,
      filters,
      search,
    });
  }

  @Get(':id')
  @UseGuards(VideoNotFoundGuard)
  @AuthRole(UserRole.VIEWER, UserRole.EDITOR)
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'Returns the video by ID' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  public view(@Param('id') id: string): Promise<Video | null> {
    return this.videosService.one(id);
  }

  @Post()
  @AuthRole(UserRole.EDITOR)
  @ApiBody({ type: VideosCreateRequest })
  @ApiResponse({ status: 201, description: 'Creates a new video' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  public create(@Body() body: VideosCreateRequest): Promise<Video> {
    return this.videosService.create(body);
  }

  @Patch(':id')
  @UseGuards(VideoNotFoundGuard)
  @AuthRole(UserRole.EDITOR)
  @ApiParam({ name: 'id', description: 'Video ID to update' })
  @ApiBody({ type: VideosEditRequest })
  @ApiResponse({
    status: 200,
    description: 'Updates and returns the updated video',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  public edit(
    @Param('id') id: string,
    @Body() body: VideosEditRequest,
  ): Promise<Video | null> {
    return this.videosService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(VideoNotFoundGuard)
  @AuthRole(UserRole.EDITOR)
  @ApiParam({ name: 'id', description: 'Video ID to delete' })
  @ApiResponse({ status: 200, description: 'Video successfully deleted' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  public delete(@Param('id') id: string): Promise<void> {
    return this.videosService.remove(id);
  }
}
