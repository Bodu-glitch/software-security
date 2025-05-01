import { Injectable } from '@nestjs/common';
import { CreateUserBoardDto } from './dto/create-user_board.dto';
import { UpdateUserBoardDto } from './dto/update-user_board.dto';
import { UserBoard } from './entities/user_board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsRole } from '../../enums/boards_role';
import { User } from '../user/entities/user.entity';
import { BoardsRoles } from '../../decorators/boards_roles.decorator';
import { Board } from '../board/entities/board.entity';

@Injectable()
export class UserBoardService {
  constructor(
    @InjectRepository(UserBoard)
    private userBoardRepository: Repository<UserBoard>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async getUserBoards(userId: string, boardId: string) {
    const isOwner = await this.boardRepository.findOne({
      where: {
        id: boardId,
        owner: { id: userId },
      },
    });
    if (isOwner) {
      return BoardsRole.Owner;
    }
    const userBoard = await this.userBoardRepository.findOne({
      where: { userId, boardId },
    });
    return userBoard?.role || null;
  }

  async addNewMember(createUserBoardDto: CreateUserBoardDto) {
    console.log('addNewMember', createUserBoardDto);
    const userBoard = this.userBoardRepository.create(createUserBoardDto);
    return this.userBoardRepository.save(userBoard);
  }
}
