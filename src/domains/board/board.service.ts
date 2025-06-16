import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { UserBoard } from '../user_board/entities/user_board.entity';
import { BoardsRole } from '../../enums/boards_role';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(UserBoard) private userBoardRepository: Repository<UserBoard>,
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

  async addMember(boardId: string, userId: string) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['owner'],
    });

    if (!board) {
      throw new BadRequestException('Board not found');
    }

    if (board.owner.id == userId){
      throw new BadRequestException('Cannot add the owner as a member');
    }

    // Check if the user is already a member
    const boardUser = await this.userBoardRepository.findOne(
      {
        where: { boardId, userId },
      }
    )

    if (boardUser) {
      throw new BadRequestException('User is already a member of this board');
    }

    const userBoard = this.userBoardRepository.create({
      boardId,
      userId,
      role: BoardsRole.TeamMember,
    });

    return this.userBoardRepository.save(userBoard);
  }

  setRole(boardId: string, userId: string, role: BoardsRole) {
    return this.userBoardRepository.update(
      { boardId, userId },
      { role },
    );
  }

  async getMembers(boardId: string) {
    //get owner and members of the board
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['owner'],
    });
    if (!board) {
      throw new BadRequestException('Board not found');
    }

    const members = await this.userBoardRepository.find({
      where: { boardId },
      relations: ['user'],
    });
    console.log(members);

    return {
      owner: board.owner,
      members: members.map(member => member.user),
    };
  }

  remove(id: string) {
    return this.boardRepository.delete(id);
  }

  removeMember(boardId: string, userId: string) {
    // Check if the user is a member of the board
    const userBoard = this.userBoardRepository.findOne({
      where: { boardId, userId },
    });

    if (!userBoard) {
      throw new BadRequestException('User is not a member of this board');
    }

    return this.userBoardRepository.delete({ boardId, userId });
  }
}
