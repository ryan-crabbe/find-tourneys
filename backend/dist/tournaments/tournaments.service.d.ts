import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class TournamentsService {
    private httpService;
    private configService;
    private readonly apiUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    getTournaments(location: string): Promise<any>;
}
