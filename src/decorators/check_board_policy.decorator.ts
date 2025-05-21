import { SetMetadata } from '@nestjs/common';
import { BoardPolicyHandler } from '../models/board_policy.model';

export const CHECK_BOARD_POLICIES_KEY = 'check_board_policy';
export const CheckBoardPolicies = (...handlers: BoardPolicyHandler[]) =>
  SetMetadata(CHECK_BOARD_POLICIES_KEY, handlers);
