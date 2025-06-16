import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards, Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardsRoles } from '../../decorators/boards_roles.decorator';
import { BoardsRole } from '../../enums/boards_role';
import { BoardGuard } from '../../guards/board/board.guard';
import { AddMemberDto } from './dto/add-member.dto';
import { SetRoleDto } from './dto/set-role.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() createBoardDto: CreateBoardDto, @Req() req: any) {
    console.log(req.user);
    return this.boardService.create(createBoardDto, req.user.id);
  }

  @Post('add-member')
  @BoardsRoles([BoardsRole.Owner])
  @UseGuards(BoardGuard)
  addMember(@Body() body: AddMemberDto) {
    console.log('addMember', body);
    return this.boardService.addMember(body.boardId, body.userId);
  }

  @Put('set-role')
  @BoardsRoles([BoardsRole.Owner])
  @UseGuards(BoardGuard)
  setRole(@Body() body: SetRoleDto) {
    return this.boardService.setRole(body.boardId, body.userId, body.role);
  }

  @Get('members/:boardId')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.TeamMember])
  @UseGuards(BoardGuard)
  getMembers(@Param('boardId') boardId: string) {
    return this.boardService.getMembers(boardId);
  }

  @Delete ('remove-member/:boardId/:userId')
  @BoardsRoles([BoardsRole.Owner])
  @UseGuards(BoardGuard)
  removeMember(@Param('boardId') boardId: string, @Param('userId') userId: string) {
    return this.boardService.removeMember(boardId, userId);
  }


  @Delete('/:boardId')
  @BoardsRoles([BoardsRole.Owner])
  @UseGuards(BoardGuard)
  remove(@Param('boardId') id: string) {
    return this.boardService.remove(id);
  }
}
