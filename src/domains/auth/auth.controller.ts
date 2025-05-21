import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CheckPolicies } from '../../decorators/check_policy.decorator';
import { User } from '../user/entities/user.entity';
import { Ability } from '@casl/ability';
import { AppAbility } from '../../modules/casl/casl-ability.factory';
import { Action } from '../../enums/action.enum';
import { PolicyGuard } from '../../guards/policy/policy.guard';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: SignupDto) {
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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.cookies?.refresh_token;
    if (!token) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }
    const data = await this.authService.refresh(token);
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
    return data;
  }
}
