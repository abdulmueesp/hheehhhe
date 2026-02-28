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

        // Cookie options (Helper)
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Dynamic based on env
            path: '/',
            sameSite: 'lax' as const, // Lax is safer for dev
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        // Set Refresh Token in HttpOnly Cookie
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

        return { accessToken: tokens.accessToken };
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token');
        }

        const tokens = await this.authService.refresh(refreshToken);

        // Update the refresh token in cookie (Rotation)
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax' as const,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { accessToken: tokens.accessToken };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken');
        return { message: 'Logged out' };
    }
}
