import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TeamMember } from 'src/models/team-member.model';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team)
    private teamModel: typeof Team,
    @InjectModel(TeamMember)
    private teamMemberModel: typeof TeamMember,
    @InjectModel(User)
    private userModel: typeof User,
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
  ) {}
  async create(name: string, ownerId: number) {
    return this.teamModel.create({ name, ownerId });
  }
  findAll(ownerId: number) {
    return this.teamModel.findAll({
      where: { ownerId },
      include: [{ model: this.teamMemberModel }],
    });
  }
  async findOne(id: number, ownerId: number) {
    const team = await this.teamModel.findByPk(id, {
      include: [{ model: this.teamMemberModel }],
    });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    if (team.ownerId !== ownerId) {
      throw new ForbiddenException('Not your team');
    }
    return team;
  }
  async update(id: number, name: string, ownerId: number) {
    const team = await this.findOne(id, ownerId);
    return team.update({ name });
  }
  async remove(id: number, ownerId: number) {
    const team = await this.findOne(id, ownerId);
    await team.destroy();
    return team;
  }
  async addMember(
    teamId: number,
    ownerId: number,
    data: { email: string; role: 'lead' | 'member' },
    photoUrl?: string,
  ) {
    await this.findOne(teamId, ownerId);
    const email = data.email.trim().toLowerCase();

    let user = await this.userModel.findOne({ where: { email } });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await this.userModel.create({
        email,
        username: email.split('@')[0], // placeholder, they can change it later
        passwordHash: null,
        profilePhoto: photoUrl ?? null,
      });
    } else if (photoUrl && !user.profilePhoto) {
      user.profilePhoto = photoUrl;
      await user.save();
    }

    const teamMember = await this.teamMemberModel.create({
      teamId,
      userId: user.id,
      role: data.role,
    });

    if (isNewUser) {
      console.log('[DEBUG] isNewUser true, about to sign token');
      const inviteToken = this.jwtService.sign(
        { userId: user.id, purpose: 'invite' },
        { expiresIn: '24h' },
      );
      console.log('[DEBUG] token signed, calling emitAsync');
      await this.eventEmitter.emitAsync('member.invited', {
        email: user.email,
        inviteToken,
      });
      console.log('[DEBUG] emitAsync finished');
    }

    return teamMember;
  }
  async updateMember(
    teamId: number,
    memberId: number,
    ownerId: number,
    data: { role: 'lead' | 'member' },
  ) {
    await this.findOne(teamId, ownerId);
    const member = await this.teamMemberModel.findOne({
      where: { id: memberId, teamId },
    });
    if (!member) {
      throw new NotFoundException('Team member not found');
    }
    return member.update(data);
  }

  async removeMember(teamId: number, memberId: number, ownerId: number) {
    await this.findOne(teamId, ownerId);
    const member = await this.teamMemberModel.findOne({
      where: { id: memberId, teamId },
    });
    if (!member) {
      throw new NotFoundException('Team member not found');
    }
    await member.destroy();
    return member;
  }
}
