import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { before } from 'node:test';

@Injectable()
export class TournamentsService {
  private readonly apiUrl: string = 'https://api.start.gg/gql/alpha';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async getTournaments(coordinates: string): Promise<any> {
    const authToken = this.configService.get<string>('STARTGG_AUTH_TOKEN');

    const startDate = Math.floor(Date.now() / 1000); 
    const beforeDate = startDate + 7 * 24 * 60 * 60;
    const radius = "50mi"
    const perPage = 5

    const query = `
      query SocalTournaments($perPage: Int, $coordinates: String!, $radius: String!, $startDate: Timestamp, $beforeDate: Timestamp) {
  tournaments(query: {
    perPage: $perPage
    filter: {
      afterDate: $startDate
      beforeDate:$beforeDate
      location: {
        distanceFrom: $coordinates,
        distance: $radius
      }
    }
    sort: endAt
  }) {
    nodes {
      id
      name
      city
      venueAddress
    }
  }
}
    `;

    const variables = {
        perPage: perPage,
        coordinates: coordinates,
        radius: radius, 
        startDate: startDate,
        beforeDate: beforeDate
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
          console.log('API Response:', response.data.data.tournaments.nodes);
          return response.data.data.tournaments.nodes;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  }
}
