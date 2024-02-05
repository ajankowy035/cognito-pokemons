import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AwsCognitoService } from './aws-cognito.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AwsCognitoService, JwtStrategy],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})
export class AuthModule {}
