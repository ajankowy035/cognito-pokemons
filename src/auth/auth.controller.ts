import { AuthConfirmPasswordUserDto } from './dtos/auth-confirm-password';
import { AuthForgotPasswordUserDto } from './dtos/auth-forgotten-password';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AuthChangePasswordUserDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly awsCognitoService: AwsCognitoService) {}

  @Post('/register')
  async register(@Body() body: AuthRegisterUserDto) {
    return this.awsCognitoService.registerUser(body);
  }

  @Post('/login')
  async login(@Body() body: AuthLoginUserDto) {
    return this.awsCognitoService.authentificateUser(body);
  }

  @Post('change-password')
  @UsePipes(ValidationPipe)
  async changePassowr(@Body() body: AuthChangePasswordUserDto) {
    await this.awsCognitoService.changeUserPassword(body);
  }

  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  forgotPassword(@Body() body: AuthForgotPasswordUserDto) {
    return this.awsCognitoService.fogotUserPassword(body);
  }

  @Post('/confirm-password')
  @UsePipes(ValidationPipe)
  confirmPassword(@Body() body: AuthConfirmPasswordUserDto) {
    return this.awsCognitoService.confirmUserPassword(body);
  }
}
