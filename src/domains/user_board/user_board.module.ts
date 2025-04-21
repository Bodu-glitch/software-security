import { Global, Module } from '@nestjs/common';
import { UserBoardService } from './user_board.service';
import { UserBoardController } from './user_board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBoard } from './entities/user_board.entity';

@Global()
@Module({
  controllers: [UserBoardController],
  imports: [TypeOrmModule.forFeature([UserBoard])],
  providers: [UserBoardService],
  exports: [UserBoardService],
})
export class UserBoardModule {}
