import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Team } from '../models/team.model';
import { TeamMember } from '../models/team-member.model';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { User } from 'src/models/user.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Team, TeamMember, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-this',
      signOptions: { expiresIn: '1h' }, // shorter than login's 1d — invite links shouldn't stay valid too long
    }),
  ],

  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
