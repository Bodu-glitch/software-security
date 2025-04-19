import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    //check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const payload = {
      username: createUserDto.username,
      name: createUserDto.name,
      email: createUserDto.email,
      password: passwordHash,
      otp: otp,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: process.env.JWT_SECRET,
    });

    await this.mailerService
      .sendMail({
        to: createUserDto.email,
        subject: 'Verify your email',
        template: 'verify',
        context: {
          title: 'Verify your email',
          name: createUserDto.name,
          activationCode: otp,
        },
      })
      .catch((reason) => {
        console.log('Email sent failed', reason);
        throw new HttpException(reason, HttpStatus.BAD_REQUEST);
      });
    return token;
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(createUserDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '3h',
      }),
    };
  }

  async forgotPassword(userName: string) {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const payload = {
      username: user.username,
      name: user.name,
      email: user.email,
      otp: otp,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: process.env.JWT_SECRET,
    });
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Reset your password',
        template: 'verify',
        context: {
          title: 'Reset your password',
          name: user.name,
          activationCode: otp,
        },
      })
      .catch((reason) => {
        console.log('Email sent failed', reason);
        throw new HttpException(reason, HttpStatus.BAD_REQUEST);
      });
    return token;
  }

  async resetPassword(verifyJwt: string, otp: string, password: string) {
    try {
      const payload = this.jwtService.verify(verifyJwt, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) {
        throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
      }

      if (payload.otp !== otp) {
        throw new HttpException(
          'Invalid verification code',
          HttpStatus.UNAUTHORIZED,
        );
      }
      payload.password = await bcrypt.hash(password, 10);
      return await this.userRepository
        .update(
          {
            username: payload.username,
          },
          {
            password: payload.password,
          },
        )
        .then((response) => {
          return response;
        })
        .catch((reason) => {
          throw new HttpException(reason, HttpStatus.BAD_REQUEST);
        });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyEmail(verifyToken: string, verificationCode: string) {
    try {
      const payload = this.jwtService.verify(verifyToken, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) {
        console.log('Invalid token', payload);
        throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
      }
      const user = await this.userRepository.findOne({
        where: { username: payload.username },
      });
      if (user) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      if (payload.otp !== verificationCode) {
        throw new HttpException(
          'Invalid verification code',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newUser = this.userRepository.create({
        username: payload.username,
        name: payload.name,
        email: payload.email,
        password: payload.password,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    // const token = this.jwtService.sign(
    //   {
    //     id: newUser.id,
    //     username: newUser.username,
    //     name: newUser.name,
    //     email: newUser.email,
    //     createdAt: newUser.createdAt,
    //   },
    //   {
    //     secret: process.env.JWT_SECRET,
    //     expiresIn: '5h',
    //   },
    // );
  }
}
