import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TournamentsService {
  private readonly apiUrl: string = 'https://api.start.gg/tournaments';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async getTournaments(location: string, startDate: string, endDate: string): Promise<any> {
    const authToken = this.configService.get<string>('STARTGG_AUTH_TOKEN');

    try {
      const response = await firstValueFrom(this.httpService.get(this.apiUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: {
          location,
          startDate,
          endDate,
        },
      }));

      return response.data;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  }
}
