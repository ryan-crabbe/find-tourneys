"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let TournamentsService = class TournamentsService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.apiUrl = 'https://api.start.gg/gql/alpha';
    }
    async getTournaments(coordinates) {
        const authToken = this.configService.get('STARTGG_AUTH_TOKEN');
        const startDate = Math.floor(Date.now() / 1000);
        const beforeDate = startDate + 7 * 24 * 60 * 60;
        const radius = "50mi";
        const perPage = 20;
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
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.apiUrl, { query, variables }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            }));
            console.log('API Response:', response.data.data.tournaments.nodes);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching tournaments:', error);
            throw error;
        }
    }
};
TournamentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], TournamentsService);
exports.TournamentsService = TournamentsService;
//# sourceMappingURL=tournaments.service.js.map