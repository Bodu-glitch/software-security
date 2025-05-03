import { AppAbility } from '../modules/casl/casl-ability.factory';
import { User } from '../domains/user/entities/user.entity';

export interface IPolicyHandler {
  handle(ability: AppAbility, user?: User): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility, user?: User) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
