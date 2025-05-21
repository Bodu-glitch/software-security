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
import { PolicyGuard } from '../../guards/policy/policy.guard';
import { CheckPolicies } from '../../decorators/check_policy.decorator';
import { Action } from '../../enums/action.enum';
import { UserBoard } from './entities/user_board.entity';

@Controller('user-board')
export class UserBoardController {
  constructor(private readonly userBoardService: UserBoardService) {}

  @Post('add-new-member')
  @BoardsRoles([BoardsRole.Owner])
  addNewMember(@Body() createUserBoardDto: CreateUserBoardDto) {
    return this.userBoardService.addNewMember(createUserBoardDto);
  }

  // @Post('update-role')
  // @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  // @UseGuards(BoardGuard)
}
