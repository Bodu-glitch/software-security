import { IsEnum, IsUUID } from 'class-validator';
import { BoardsRole } from '../../../enums/boards_role';

export class SetRoleDto{
  @IsUUID()
  userId: string;

  @IsUUID()
  boardId: string;

  @IsEnum(BoardsRole)
  role: BoardsRole;
}