import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  name?: string;

  @IsNotEmpty()
  username: string;

  email: string;

  password: string;
}
