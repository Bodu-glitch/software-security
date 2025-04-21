import { Injectable } from '@nestjs/common';
import { CreateUserBoardDto } from './dto/create-user_board.dto';
import { UpdateUserBoardDto } from './dto/update-user_board.dto';
import { UserBoard } from './entities/user_board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserBoardService {
  constructor(
    @InjectRepository(UserBoard)
    private userBoardRepository: Repository<UserBoard>,
  ) {}

  getUserBoards(userId: string) {
    return this.userBoardRepository.find({
      where: {
        user_id: userId,
      },
    });
  }
}
