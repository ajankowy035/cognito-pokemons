import { AuthConfirmPasswordUserDto } from './dtos/auth-confirm-password';
import { AuthForgotPasswordUserDto } from './dtos/auth-forgotten-password';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthChangePasswordUserDto } from './dtos';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async registerUser({ email, name, password }: AuthRegisterUserDto) {
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'name', Value: name })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async authentificateUser({ email, password }: AuthLoginUserDto) {
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = this.getCognitoUser(email);
    try {
      return new Promise((resolve, reject) => {
        userCognito.authenticateUser(authDetails, {
          onSuccess: (result) => {
            resolve({
              accessToken: result.getAccessToken().getJwtToken(),
              refreshToken: result.getRefreshToken().getToken(),
            });
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });
    } catch (err) {
      new UnauthorizedException(err);
    }
  }

  async changeUserPassword({
    email,
    currentPassword,
    newPassword,
  }: AuthChangePasswordUserDto) {
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: currentPassword,
    });

    const userCognito = this.getCognitoUser(email);

    return new Promise((resolve, reject) => {
      try {
        userCognito.authenticateUser(authDetails, {
          onFailure: (err) => {
            reject(err);
          },
          onSuccess: () => {
            userCognito.changePassword(
              currentPassword,
              newPassword,
              (err, result) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(result);
              },
            );
          },
        });
      } catch (err) {
        new UnauthorizedException(err);
      }
    });
  }

  async fogotUserPassword({ email }: AuthForgotPasswordUserDto) {
    const userCognito = this.getCognitoUser(email);
    try {
      return new Promise((resolve, reject) => {
        userCognito.forgotPassword({
          onSuccess: (result) => {
            resolve(result);
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });
    } catch (err) {
      new UnauthorizedException(err);
    }
  }

  async confirmUserPassword({
    email,
    confirmationCode,
    newPassword,
  }: AuthConfirmPasswordUserDto) {
    const userCognito = this.getCognitoUser(email);
    try {
      return new Promise((resolve, reject) => {
        userCognito.confirmPassword(confirmationCode, newPassword, {
          onSuccess: () => {
            resolve({ status: 'success' });
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });
    } catch (err) {
      new UnauthorizedException(err);
    }
  }

  private getCognitoUser(email: string) {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    return new CognitoUser(userData);
  }
}
