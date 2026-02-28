import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.login.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign({ ...payload, type: 'access' });
        const refreshToken = this.jwtService.sign(
            { ...payload, type: 'refresh' },
            { expiresIn: '7d' }
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);

            if (payload.type !== 'refresh') {
                throw new UnauthorizedException('Invalid token type');
            }

            const newPayload = { email: payload.email, sub: payload.sub };
            const accessToken = this.jwtService.sign({ ...newPayload, type: 'access' });

            // Rotate the refresh token (Optional but recommended for "sliding" sessions)
            const newRefreshToken = this.jwtService.sign(
                { ...newPayload, type: 'refresh' },
                { expiresIn: '7d' }
            );

            return { accessToken, refreshToken: newRefreshToken };
        } catch (e) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
