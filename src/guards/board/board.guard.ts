import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import {
  BoardsRoles,
  matchBoardsRoles,
} from '../../decorators/boards_roles.decorator';
import { BoardsRole } from '../../enums/boards_role';
import { UserBoardService } from '../../domains/user_board/user_board.service';

@Injectable()
export class BoardGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userBoardService: UserBoardService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const boardsRoles = this.reflector.get<string[]>(
      BoardsRoles,
      context.getHandler(),
    );
    console.log(boardsRoles);
    if (!boardsRoles) {
      return true;
    }
    console.log('boardsRoles', boardsRoles);

    const request = context.switchToHttp().getRequest();

    // Get the token from the request headers
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(process.env.JWT_SECRET);
      //call API to get user boards roles
      const userBoardsRoles = BoardsRole.Owner;
      return matchBoardsRoles(boardsRoles, userBoardsRoles);
    } catch (e) {
      switch (e.name) {
        case 'TokenExpiredError':
          throw new BadRequestException('Token expired');
        case 'JsonWebTokenError':
          throw new BadRequestException('Invalid token');
        default:
          throw new ForbiddenException('Forbidden');
      }
    }
  }
}
