import { Injectable } from "@nestjs/common";
import { google } from 'googleapis';
import { EventDetails } from './interfaces/event-details.interface';

@Injectable()
export class CalendarService {
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );

  async addEventToCalendar(eventDetails: EventDetails, userAccessToken: string, userRefreshToken: string) {
    this.oauth2Client.setCredentials({
      access_token: userAccessToken,
      refresh_token: userRefreshToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    const event = {
      summary: eventDetails.name,
      location: eventDetails.venueAddress,
      description: eventDetails.description,
      start: {
        dateTime: new Date(Number(eventDetails.startAt) * 1000).toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: eventDetails.endTime,
      },
    };
    
    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      console.log('Event added to calendar:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding event to calendar:', error);
    }
  }
}