import { Module } from '@nestjs/common';
import { ColumnsService } from './column.service';
import { ColumnsController } from './column.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../board/entities/board.entity';
import { UserBoard } from '../user_board/entities/user_board.entity';
import { Columns } from './entities/column.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([Columns])],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
