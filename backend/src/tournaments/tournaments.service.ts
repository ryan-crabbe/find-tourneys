import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TournamentsService {
  private readonly apiUrl: string = 'https://api.start.gg/gql/alpha';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async getTournaments(location: string): Promise<any> {
    const authToken = this.configService.get<string>('STARTGG_AUTH_TOKEN');
    const query = `
      query SocalTournaments($location: String!) {
  tournaments(query: {
    perPage: 4
    filter: {
      location: {
        distanceFrom: $location,
        distance: "100mi"
      }
    }
  }) {
    nodes {
      id
      name
      city
    }
  }
}
    `;

    const variables = {
        location
    }

    try {
        const response = await firstValueFrom(this.httpService.post(
            this.apiUrl,
            { query, variables },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            }
          ));
          console.log('API Response:', response.data);
          return response.data;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  }
}
