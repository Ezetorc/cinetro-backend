import { Module } from '@nestjs/common'
import { MoviesModule } from './movies/movies.module'
import { CategoriesModule } from './categories/categories.module';
import { CinemasModule } from './cinemas/cinemas.module';
import { RoomsModule } from './rooms/rooms.module';
import { SeatsModule } from './seats/seats.module';
import { ScreeningsModule } from './screenings/screenings.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MoviesModule, CategoriesModule, CinemasModule, RoomsModule, SeatsModule, ScreeningsModule, TicketsModule, AuthModule, UsersModule],
})
export class AppModule {}
