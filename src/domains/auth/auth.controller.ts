import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    console.log('login', createUserDto);
    return this.authService.login(createUserDto);
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
}
