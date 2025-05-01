import { Global, Module } from '@nestjs/common';
import { UserBoardService } from './user_board.service';
import { UserBoardController } from './user_board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBoard } from './entities/user_board.entity';
import { User } from '../user/entities/user.entity';
import { Board } from '../board/entities/board.entity';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  controllers: [UserBoardController],
  imports: [JwtModule, TypeOrmModule.forFeature([UserBoard, User, Board])],
  providers: [UserBoardService],
  exports: [UserBoardService],
})
export class UserBoardModule {}
