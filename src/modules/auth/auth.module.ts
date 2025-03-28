import { AuthController } from '@modules/auth/controllers/auth.controller';
import { IsValidPassword } from '@modules/auth/decorators/auth-valid-password.decorator';
import { Token } from '@modules/auth/entities/token.entity';
import { AuthTokensService } from '@modules/auth/services/auth-tokens.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Token]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    // Services
    AuthService,
    JwtStrategy,
    AuthTokensService,

    // Decorators
    IsValidPassword,
  ],
  exports: [AuthService],
})
export class AuthModule {}
