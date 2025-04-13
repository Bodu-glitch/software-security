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
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const newUser = this.userRepository.create({
      createdAt: new Date(),
      ...createUserDto,
      password: hash,
    });
    return this.userRepository.save(newUser);
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
      createdAt: user.createdAt,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '3h',
      }),
      //calculate expiration date milliseconds
      expiresIn: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).getTime(),
    };
  }

  async forgotPassword() {
    await this.mailerService
      .sendMail({
        to: 'minhq@gmail.com', // list of receivers
        subject: 'Hello Minh quân ngu', // Subject line
        text: 'Hello Minh quân ngu', // plaintext body
        html: '<b>Hello Minh quân ngu</b>', // HTML body content
      })
      .then(() => {
        console.log('Email sent successfully');
      })
      .catch((reason) => {
        console.log('Email sent failed', reason);
        throw new HttpException(reason, HttpStatus.BAD_REQUEST);
      });
    return 'Email sent successfully';
  }
}
