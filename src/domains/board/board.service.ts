import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  create(createBoardDto: CreateBoardDto, ownerId: string) {
    console.log('createBoardDto', ownerId);
    const board = this.boardRepository.create({
      ...createBoardDto,
      owner: {
        id: ownerId,
      },
    });
    return this.boardRepository.save(board);
  }

  addMember(boardId: string, userId: string) {
    return {
      boardId,
      userId,
    };
  }
}
