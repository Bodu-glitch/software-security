import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Columns } from '../columns/entities/column.entity';
import { Card } from './entities/card.entity';
import { User } from '../user/entities/user.entity';
import { Board } from '../board/entities/board.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([Card, Columns, User,Board])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
