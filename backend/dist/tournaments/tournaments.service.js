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
        this.apiUrl = 'https://api.start.gg/tournaments';
    }
    async getTournaments(location, startDate, endDate) {
        const authToken = this.configService.get('STARTGG_AUTH_TOKEN');
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
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.apiUrl, { query }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            }));
            return response.data.data.tournaments;
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