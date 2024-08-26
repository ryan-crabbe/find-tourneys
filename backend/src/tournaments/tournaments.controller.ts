import { Controller, Get, Query } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  async getTournaments(
    @Query('location') location: string,
  ) {
    return this.tournamentsService.getTournaments(location);
  }
}
