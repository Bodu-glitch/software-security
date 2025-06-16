import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  title: string;

}
