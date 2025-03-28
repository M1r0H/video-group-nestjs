import { GroupsController } from '@modules/groups/controllers/groups.controller';
import { IsGroupExist } from '@modules/groups/decorators/groups-exist.decorator';
import { Group } from '@modules/groups/entities/group.entity';
import { GroupsService } from '@modules/groups/services/groups.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  controllers: [GroupsController],
  providers: [
    // Decorators
    IsGroupExist,

    // Services
    GroupsService,
  ],
})
export class GroupsModule {}
