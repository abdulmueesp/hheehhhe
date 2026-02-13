import { Controller, Post, Body, Res, Req, UnauthorizedException, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.authService.login(user);

        // Set Refresh Token in HttpOnly Cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true, // Use true in production/HTTPS, or verify if using http locally.
            // Note: secure: true requires HTTPS. If localhost implies http, might need false for dev.
            // But user asked for HTTPS best practices. I will set secure: true but might need to relax for localhost without certs.
            // Usually localhost is exempt or we need secure: false for dev.
            // I'll stick to secure: true but if it fails on localhost http, I'll warn.
            path: '/',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return { accessToken: tokens.accessToken };
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token');
        }
        const tokens = await this.authService.refresh(refreshToken);
        return tokens;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken');
        return { message: 'Logged out' };
    }
}
