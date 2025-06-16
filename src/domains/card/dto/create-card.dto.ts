import { IsString, IsOptional, IsUUID, IsDateString, ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateCardDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  dueDate?: Date;

  @IsUUID()
  columnsId: string;

}