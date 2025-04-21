import { Injectable } from '@nestjs/common';
import { CreateUserBoardDto } from './dto/create-user_board.dto';
import { UpdateUserBoardDto } from './dto/update-user_board.dto';
import { UserBoard } from './entities/user_board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsRole } from '../../enums/boards_role';

@Injectable()
export class UserBoardService {
  constructor(
    @InjectRepository(UserBoard)
    private userBoardRepository: Repository<UserBoard>,
  ) {}

  async getUserBoards(userId: string) {
    return BoardsRole.TeamMember;
  }
}
