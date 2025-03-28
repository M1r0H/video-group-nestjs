import { IsUserEmailAlreadyRegistered } from '@modules/users/decorators/users-email-already-registered.decorator';
import { IsUserExist } from '@modules/users/decorators/users-exist.decorator';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/services/users.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    // Decorators
    IsUserExist,
    IsUserEmailAlreadyRegistered,

    // Services
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
