import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TournamentsController } from './tournaments/tournaments.controller';
import { TournamentsService } from './tournaments/tournaments.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'yourpassword', // Replace with your actual password
      database: 'tournament_map', // Replace with your database name
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Syncs the database schema with your entities (disable in production)
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    HttpModule,
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class AppModule {}
