import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { Columns } from '../columns/entities/column.entity';
import { User } from '../user/entities/user.entity';
import { Board } from '../board/entities/board.entity';

@Injectable()
export class CardService {

  constructor(
    @InjectRepository(Card) private  cardRepository: Repository<Card>,
    @InjectRepository(Columns) private columnsRepository: Repository<Columns>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    ) {
  }

  async create(createCardDto: CreateCardDto) {
    console.log('createCardDto', createCardDto);
    //check columnId
    const column = await this.columnsRepository.findOne({
      where: { id: createCardDto.columnsId },
    });
    if (!column) {
      throw new BadRequestException('Column not found');
    }

    // add card to column
    const card = this.cardRepository.create({
      ...createCardDto,
      columns: column,
    });

    return this.cardRepository.save(card);
  }

  async findAll(
    columnId: string
  ) {
    // check columnId
    const column = await this.columnsRepository.findOne({
      where: { id: columnId },
    });
    if (!column) {
      throw new BadRequestException('Column not found');
    }

    // find all cards in column
    return this.cardRepository.find({
      where: { columns: { id: columnId } },
      relations: ['members'],
    });
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['columns'],
    });
    if (!card) {
      throw new BadRequestException('Card not found');
    }

    // check if column exists
    if (updateCardDto.columnsId) {
      const column = await this.columnsRepository.findOne({
        where: { id: updateCardDto.columnsId },
      });
      if (!column) {
        throw new BadRequestException('Column not found');
      }
      card.columns = column;
    }

    // update other fields
    Object.assign(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  async remove(id: string) {
    const card = await this.cardRepository.findOne({
      where: { id },
    });
    if (!card) {
      throw new BadRequestException('Card not found');
    }

    // remove card
    return this.cardRepository.remove(card);
  }

  async getCardsByUser(boardId: string, userId: string) {
    // find cards for user
    return this.cardRepository.find({
      where: { members: { id: userId } },
    });
  }

  async removeUserCard(boardId: string, userId: string, number: string) {
    // find card by id
    const card = await this.cardRepository.findOne({
      where: { id: number },
      relations: ['members'],
    });
    if (!card) {
      throw new BadRequestException('Card not found');
    }

    // check if user is a member of the card
    const user = card.members.find(member => member.id === userId);
    if (!user) {
      throw new BadRequestException('User is not a member of this card');
    }

    // remove user from card members
    card.members = card.members.filter(member => member.id !== userId);
    return this.cardRepository.save(card);
  }

  async addMember( id: string, userId: string) {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!card) {
      throw new BadRequestException('Card not found');
    }

    // found user in database
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (card.members.some(member => member.id === userId)) {
      throw new BadRequestException('User is already a member of this card');
    }

    card.members.push(user); // Assuming members are User entities
    return this.cardRepository.save(card);

  }
}
