import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.['obrato.refresh']
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'insecure-refresh-secret',
      ignoreExpiration: false,
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: { sub: string }) {
    const token = request.cookies?.['obrato.refresh'];
    if (!token) {
      throw new UnauthorizedException('Refresh token ausente');
    }
    await this.usersService.assertRefreshToken(payload.sub, token);
    const user = await this.usersService.findById(payload.sub);
    const { passwordHash, refreshTokenHash, ...safeUser } = user as any;
    return safeUser;
  }
}
