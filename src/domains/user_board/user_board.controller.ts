import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserBoardService } from './user_board.service';
import { CreateUserBoardDto } from './dto/create-user_board.dto';
import { UpdateUserBoardDto } from './dto/update-user_board.dto';
import { BoardsRoles } from '../../decorators/boards_roles.decorator';
import { BoardsRole } from '../../enums/boards_role';
import { BoardGuard } from '../../guards/board/board.guard';

@Controller('user-board')
export class UserBoardController {
  constructor(private readonly userBoardService: UserBoardService) {}

  @Post()
  @BoardsRoles([BoardsRole.Owner])
  @UseGuards(BoardGuard)
  addNewMember(@Body() createUserBoardDto: CreateUserBoardDto) {
    return this.userBoardService.addNewMember(createUserBoardDto);
  }
}
