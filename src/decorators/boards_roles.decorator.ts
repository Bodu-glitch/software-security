import { Reflector } from '@nestjs/core';

export const BoardsRoles = Reflector.createDecorator<string[]>();

export const matchBoardsRoles = (
  boardsRoles: string[],
  userBoardsRoles: string,
): boolean => {
  if (!boardsRoles || !userBoardsRoles) {
    return false;
  }

  return boardsRoles.includes(userBoardsRoles);
};
