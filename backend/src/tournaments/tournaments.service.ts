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
    const query = `
      query {
        tournaments(query: {location: "${location}", startDate: "${startDate}", endDate: "${endDate}"}) {
          id
          name
          location
          date
        }
      }
    `;

    try {
        const response = await firstValueFrom(this.httpService.post(
            this.apiUrl,
            { query },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            }
          ));
    
          return response.data.data.tournaments;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  }
}
