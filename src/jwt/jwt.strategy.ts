/* eslint-disable @typescript-eslint/require-await */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JWT_SECRET } from '@/auth/auth.module';
import { ActiveUser } from '@/interfaces/active.user';
import { JwtPayload } from '@/interfaces/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }
  async validate(payload: JwtPayload): Promise<ActiveUser> {
    return { id: payload.sub, email: payload.email };
  }
}
