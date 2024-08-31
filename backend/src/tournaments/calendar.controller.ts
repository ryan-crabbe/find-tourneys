import { Controller, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { EventDetails } from './interfaces/event-details.interface';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('add')
  async addEvent(@Body() eventDetails: EventDetails) {
    const { userAccessToken, userRefreshToken } = eventDetails;

    return this.calendarService.addEventToCalendar(
      eventDetails,
      userAccessToken,
      userRefreshToken,
    );
  }
}