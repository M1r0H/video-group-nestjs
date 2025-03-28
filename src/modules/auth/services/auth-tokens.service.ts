import { Token } from '@modules/auth/entities/token.entity';
import { CreateTokenParams } from '@modules/auth/types/service.types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthTokensService {
  @InjectRepository(Token)
  private readonly tokensRepository: Repository<Token>;

  public async createToken(params: CreateTokenParams): Promise<Token> {
    await this.deleteOldTokens(params.userId);

    return this.tokensRepository.save(params);
  }

  public async oneByToken(
    token: string,
    relations: string[] = [],
  ): Promise<Token | null> {
    return this.tokensRepository.findOne({
      where: { token },
      relations,
    });
  }

  public async deleteOldTokens(userId: string): Promise<void> {
    await this.tokensRepository.delete({ userId });
  }
}
