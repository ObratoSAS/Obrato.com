import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OtpService } from './otp.service';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email.toLowerCase());
    if (existing) {
      throw new BadRequestException('El correo ya está registrado');
    }
    const user = await this.usersService.createLocalUser({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      language: dto.language
    });
    await this.usersService.ensureDefaultRole(user.id, 'student');
    return this.issueTokens(user);
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.usersService.findByEmail(dto.email.toLowerCase());
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (user.twoFactorSecret) {
      if (!dto.twoFactorToken) {
        throw new ForbiddenException('Se requiere token de 2FA');
      }
      const ok = this.otpService.verify(dto.twoFactorToken, user.twoFactorSecret);
      if (!ok) {
        throw new ForbiddenException('Token 2FA inválido');
      }
    }
    await this.usersService.update(user.id, { lastLoginAt: new Date() });
    return this.issueTokens(user);
  }

  async refresh(user: User) {
    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId);
  }

  async enableTwoFactor(userId: string) {
    const user = await this.usersService.findById(userId);
    if (user.twoFactorSecret) {
      throw new BadRequestException('La verificación en dos pasos ya está configurada');
    }
    const secret = this.otpService.generateSecret();
    const uri = this.otpService.generateUri(user.email, secret);
    await this.usersService.update(userId, { twoFactorSecret: secret });
    return { secret, uri };
  }

  async disableTwoFactor(userId: string, token: string) {
    const user = await this.usersService.findById(userId);
    if (!user.twoFactorSecret) {
      return { disabled: true };
    }
    const valid = this.otpService.verify(token, user.twoFactorSecret);
    if (!valid) {
      throw new ForbiddenException('Token inválido');
    }
    await this.usersService.update(userId, { twoFactorSecret: null });
    return { disabled: true };
  }

  private async issueTokens(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email, fullName: user.fullName };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m'
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'insecure-refresh-secret',
      expiresIn: '30d'
    });
    await this.usersService.setRefreshToken(user.id, refreshToken);
    return {
      accessToken,
      refreshToken,
      expiresIn: 900
    };
  }
}
