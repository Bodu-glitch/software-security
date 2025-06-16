import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserBoard } from '../user_board/entities/user_board.entity';

@Module({
  controllers: [BoardController],
  imports: [JwtModule, TypeOrmModule.forFeature([Board,UserBoard])],
  providers: [BoardService],
})
export class BoardModule {}
