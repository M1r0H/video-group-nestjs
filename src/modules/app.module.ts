import { AllExceptionsFilter } from '@core/filters/http-exception.filter';
import { CustomValidationPipe } from '@core/pipes/validation.pipe';
import { AuthModule } from '@modules/auth/auth.module';
import { GroupsModule } from '@modules/groups/groups.module';
import { UsersModule } from '@modules/users/users.module';
import { VideosModule } from '@modules/videos/videos.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripSensitiveFieldsInterceptor } from '@src/core/interseptors/strip-sensitive-fields.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_DATABASE,
      entities: ['dist/src/modules/**/entities/*.entity.js'],
      migrations: ['dist/src/migrations/*.js'],
      migrationsRun: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),
    GroupsModule,
    VideosModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StripSensitiveFieldsInterceptor,
    },
  ],
})
export class AppModule {}
