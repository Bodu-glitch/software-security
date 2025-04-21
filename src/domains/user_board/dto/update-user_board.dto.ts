import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBoardDto } from './create-user_board.dto';

export class UpdateUserBoardDto extends PartialType(CreateUserBoardDto) {}
