import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserBoardService } from './user_board.service';
import { CreateUserBoardDto } from './dto/create-user_board.dto';
import { UpdateUserBoardDto } from './dto/update-user_board.dto';

@Controller('user-board')
export class UserBoardController {
  constructor(private readonly userBoardService: UserBoardService) {}
}
