import { Module } from '@nestjs/common'
import { MoviesModule } from './resources/movies/movies.module'
import { CategoriesModule } from './resources/categories/categories.module'
import { CinemasModule } from './resources/cinemas/cinemas.module'
import { RoomsModule } from './resources/rooms/rooms.module'
import { SeatsModule } from './resources/seats/seats.module'
import { ScreeningsModule } from './resources/screenings/screenings.module'
import { TicketsModule } from './resources/tickets/tickets.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './resources/users/users.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { RolesGuard } from './resources/common/guards/roles.guard'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'
import { REDIS_CONFIG } from './common/constants/redis-config.constant'

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: REDIS_CONFIG.host,
            port: REDIS_CONFIG.port
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
