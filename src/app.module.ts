import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MoviesModule } from './movies/movies.module'
import { CategoriesModule } from './categories/categories.module'
import { CinemasModule } from './cinemas/cinemas.module'
import { RoomsModule } from './rooms/rooms.module'
import { SeatsModule } from './seats/seats.module'
import { ScreeningsModule } from './screenings/screenings.module'
import { TicketsModule } from './tickets/tickets.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'
import { envConfiguration } from './configuration/env.configuration'
import { envValidation } from './configuration/env.validation'
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { UserRolesModule } from './user-roles/user-roles.module'
import { PolicyModule } from './policy/policy.module'
import { PolicyGuard } from './policy/guards/policy.guard'
import { JwtGuard } from './auth/guards/jwt.guard'
import { MovieCategoriesModule } from './movie-categories/movie-categories.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
      load: [envConfiguration]
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.getOrThrow<string>('redis.host'),
            port: configService.getOrThrow<number>('redis.port')
          }
        })
      })
    }),
    MoviesModule,
    CategoriesModule,
    CinemasModule,
    RoomsModule,
    SeatsModule,
    ScreeningsModule,
    TicketsModule,
    AuthModule,
    UsersModule,
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 4, ttl: seconds(10) }],
      errorMessage: 'Too many requests'
    }),
    UserRolesModule,
    PolicyModule,
    MovieCategoriesModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    },
    {
      provide: APP_GUARD,
      useClass: PolicyGuard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
