import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Board } from '../../domains/board/entities/board.entity';
import { User } from '../../domains/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Action } from '../../enums/action.enum';
import { UserBoard } from '../../domains/user_board/entities/user_board.entity';
import { BoardsRole } from '../../enums/boards_role';

type Subjects =
  | InferSubjects<typeof Board | typeof User>
  | typeof UserBoard
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    can(Action.Update, User, { id: user.id });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
