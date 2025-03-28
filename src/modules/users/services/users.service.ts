import { User } from '@modules/users/entities/user.entity';
import { UserCreateParams } from '@modules/users/types/service.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private usersRepository: Repository<User>;

  public async oneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  public create(params: UserCreateParams): Promise<User> {
    return this.usersRepository.save(params);
  }
}
