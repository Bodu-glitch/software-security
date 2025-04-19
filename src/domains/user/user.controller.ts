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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BoardsRoles } from '../../decorators/boards_roles.decorator';
import { BoardsRole } from '../../enums/boards_role';
import { BoardGuard } from '../../guards/board/board.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @BoardsRoles([BoardsRole.Owner])
  @UseGuards(BoardGuard)
  findAll() {
    return this.userService.findAll();
  }
}
