import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TournamentsController } from './tournaments/tournaments.controller';
import { TournamentsService } from './tournaments/tournaments.service';
import { CalendarService } from './tournaments/calendar.service';
import { CalendarController } from './tournaments/calendar.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    HttpModule,
  ],
  controllers: [TournamentsController, CalendarController],
  providers: [TournamentsService, CalendarService],
})
export class AppModule {}
