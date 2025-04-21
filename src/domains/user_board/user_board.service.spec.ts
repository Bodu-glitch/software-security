import { Test, TestingModule } from '@nestjs/testing';
import { UserBoardService } from './user_board.service';

describe('UserBoardService', () => {
  let service: UserBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBoardService],
    }).compile();

    service = module.get<UserBoardService>(UserBoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
