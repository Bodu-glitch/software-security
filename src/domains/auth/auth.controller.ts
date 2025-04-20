import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('login', createUserDto);
    const data = await this.authService.login(createUserDto);
    response
      .cookie('access_token', data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .cookie('refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

    response.status(HttpStatus.OK).send(data);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { userName: string }) {
    console.log('forgot-password', body);
    return this.authService.forgotPassword(body.userName);
  }

  @Post('reset-password')
  resetPassword(
    @Body() body: { password: string; token: string; otp: string },
  ) {
    return this.authService.resetPassword(body.token, body.otp, body.password);
  }

  @Post('verify-email')
  verifyEmail(
    @Body() body: { verificationToken: string; verificationCode: string },
  ) {
    return this.authService.verifyEmail(
      body.verificationToken,
      body.verificationCode,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response
      .clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    return { message: 'Logged out successfully' };
  }
}
