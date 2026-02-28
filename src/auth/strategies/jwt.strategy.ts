import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'super-secret-key', // In production, use env variable
        });
    }

    async validate(payload: any) {
        if (payload.type !== 'access') {
            throw new UnauthorizedException('Token type mismatch');
        }
        return { userId: payload.sub, email: payload.email };
    }
}
