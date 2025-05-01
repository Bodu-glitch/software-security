import { PickType } from '@nestjs/mapped-types';
import { UserBoard } from '../entities/user_board.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BoardsRole } from '../../../enums/boards_role';

export class CreateUserBoardDto extends PickType(UserBoard, [
  'userId',
  'boardId',
  'role',
] as const) {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  boardId: string;

  @IsEnum(BoardsRole)
  @IsNotEmpty()
  role: BoardsRole;
}
