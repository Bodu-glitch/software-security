import { Test, TestingModule } from '@nestjs/testing';
import { UserBoardController } from './user_board.controller';
import { UserBoardService } from './user_board.service';

describe('UserBoardController', () => {
  let controller: UserBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBoardController],
      providers: [UserBoardService],
    }).compile();

    controller = module.get<UserBoardController>(UserBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
