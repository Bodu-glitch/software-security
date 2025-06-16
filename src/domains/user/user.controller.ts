import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BoardsRoles } from '../../decorators/boards_roles.decorator';
import { BoardsRole } from '../../enums/boards_role';
import { BoardGuard } from '../../guards/board/board.guard';
import { PolicyGuard } from '../../guards/policy/policy.guard';
import { CheckPolicies } from '../../decorators/check_policy.decorator';
import { AppAbility } from '../../modules/casl/casl-ability.factory';
import { Action } from '../../enums/action.enum';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { CanModifyGuard } from '../../guards/can_modify/can_modify.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Put('change-name')
  @UseGuards(CanModifyGuard)
  @CheckPolicies((ability: AppAbility, user: User) =>
    ability.can(Action.Update, user),
  )
  changeName(@Body() body: UpdateUserDto) {
    return this.userService.changeName(body.userId, body.name);
  }
}
