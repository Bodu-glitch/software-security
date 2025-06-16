import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
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
    @Inject(UserBoardService) private userBoardService: UserBoardService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    if (!request.body.boardId && !request.params.boardId) {
      throw new BadRequestException('Board ID not found');
    }

    try {
      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(process.env.JWT_SECRET);
      //call API to get user boards roles
      const boardId = request.body.boardId || request.params.boardId;

      const userBoardsRoles = await this.userBoardService.getUserBoards(
        user.id,
        boardId,
      );

      console.log('userBoardsRoles', userBoardsRoles);
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
