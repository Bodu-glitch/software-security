import { AppBoardAbility } from '../modules/board-casl/board-casl.factory';

export interface IBoardPolicyHandler {
  handle(ability: AppBoardAbility): boolean;
}

type BoardPolicyHandlerCallback = (ability: AppBoardAbility) => boolean;

export type BoardPolicyHandler =
  | IBoardPolicyHandler
  | BoardPolicyHandlerCallback;
