import { Body, Controller, Post } from '@nestjs/common';
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
  forgotPassword() {
    return this.authService.forgotPassword();
  }
}
