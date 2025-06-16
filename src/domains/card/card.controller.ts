import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BoardsRoles } from '../../decorators/boards_roles.decorator';
import { BoardsRole } from '../../enums/boards_role';
import { BoardGuard } from '../../guards/board/board.guard';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  //
  @Post('/:boardId')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  @UseGuards(BoardGuard)
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  //
  @Post('/add-member/:boardId/:userId/:id')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  @UseGuards(BoardGuard)
  addMember(
    @Param('id') id: string,
    @Param('userId') userId: string
  ) {
    return this.cardService.addMember( id, userId);
  }

  //
  @Get('/get-cards-by-column/:boardId/:columnId')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  @UseGuards(BoardGuard)
  findAll(
    @Param('columnId') columnId: string
  ) {
    return this.cardService.findAll(columnId);
  }

  //
  @Get('get-cards-by-user/:boardId/:userId')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager, BoardsRole.TeamMember])
  @UseGuards(BoardGuard)
  getCardsByUser(
    @Param('boardId') boardId: string,
    @Param('userId') userId: string
  ) {
    return this.cardService.getCardsByUser(boardId, userId);
  }

  //
  @Put('/:boardId/:columnId/:id')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  @UseGuards(BoardGuard)
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(id, updateCardDto);
  }

  //
  @Delete('/delete-user-from-card/:boardId/:userId/:id')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  @UseGuards(BoardGuard)
  removeUserCard(
    @Param('boardId') boardId: string,
    @Param('userId') userId: string,
    @Param('id') id: string
  ) {
    return this.cardService.removeUserCard(boardId, userId, id);
  }

  @Delete('/:boardId/:id')
  @BoardsRoles([BoardsRole.Owner, BoardsRole.ProjectManager])
  @UseGuards(BoardGuard)
  remove(@Param('id') id: string) {
    return this.cardService.remove(id);
  }
}
