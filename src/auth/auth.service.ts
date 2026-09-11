import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
    });

    return { id: user.id, username: user.username, email: user.email };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { access_token: token };
  }

  async googleLogin(googleUser: {
    googleId: string;
    email: string;
    name: string;
  }) {
    let user = await this.userModel.findOne({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.userModel.create({
        username: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
      });
    } else if (!user.googleId) {
      await user.update({ googleId: googleUser.googleId });
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { access_token: token };
  }
  async completeInvite(token: string, password: string) {
    let payload: { userId: number; purpose: string };
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Invite link is invalid or has expired');
    }

    if (payload.purpose !== 'invite') {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.userModel.findByPk(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.passwordHash) {
      throw new BadRequestException('This account is already set up');
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();

    return { message: 'Account set up successfully. You can now log in.' };
  }
}
