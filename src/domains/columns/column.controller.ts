import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ColumnsService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { BoardsRoles } from '../../decorators/boards_roles.decorator';
import { BoardsRole } from '../../enums/boards_role';
import { BoardGuard } from '../../guards/board/board.guard';

@Controller('column')
export class ColumnsController {
  constructor(private readonly columnService: ColumnsService) {}

  //
  @Post('new-column/:boardId')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.TeamMember])
  @UseGuards(BoardGuard)
  create(@Body() createColumnDto: CreateColumnDto , @Param('boardId') boardId: string) {
    return this.columnService.create(createColumnDto, boardId);
  }

  @Get("/:boardId")
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  @UseGuards(BoardGuard)
  findAll(
    @Param('boardId') boardId: string
  ) {
    return this.columnService.findAll(
      boardId
    );
  }

  //
  @Put('/:boardId/:columnId')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  @UseGuards(BoardGuard)
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnService.update(id, updateColumnDto);
  }

  //
  @Delete('/:boardId/:id')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  @UseGuards(BoardGuard)
  remove(@Param('id') id: string) {
    return this.columnService.remove(id);
  }
}
