import { CanModifyGuard } from './can_modify.guard';

describe('CanModifyGuard', () => {
  it('should be defined', () => {
    expect(new CanModifyGuard()).toBeDefined();
  });
});
