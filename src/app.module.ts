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
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { RolesGuard } from './common/guards/roles.guard'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'
import configuration from './configuration/configuration'
import { validationSchema } from './configuration/validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [configuration]
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
    UsersModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
