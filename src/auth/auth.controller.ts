import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredsDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
    return this.authService.signIn(authCredsDto);
  }
}
