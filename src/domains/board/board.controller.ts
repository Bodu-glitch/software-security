import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardsRoles } from '../../decorators/boards_roles.decorator';
import { BoardsRole } from '../../enums/boards_role';
import { BoardGuard } from '../../guards/board/board.guard';
import { AddMemberDto } from './dto/add-member.dto';

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
    return this.boardService.addMember(body.boardId, body.userId);
  }
}
