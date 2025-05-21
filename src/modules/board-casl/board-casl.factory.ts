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

export type AppBoardAbility = Ability<[Action, Subjects]>;

@Injectable()
export class BoardCaslAbilityFactory {
  createForUser(user: User, role: string) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppBoardAbility>);

    if (role == BoardsRole.Owner) {
      cannot(Action.Create, UserBoard, {
        role: BoardsRole.Owner,
      });
    } else if (role == BoardsRole.ProjectManager) {
      cannot(Action.Create, UserBoard, {
        role: BoardsRole.ProjectManager,
      });
      cannot(Action.Create, UserBoard, {
        role: BoardsRole.Owner,
      });
      cannot(Action.Update, UserBoard, {
        role: BoardsRole.Owner,
      });
      cannot(Action.Update, UserBoard, {
        role: BoardsRole.ProjectManager,
      });
      cannot(Action.Delete, UserBoard, {
        userId: user.id,
      });
      cannot(Action.Delete, UserBoard, {
        role: BoardsRole.Owner,
      });
      cannot(Action.Delete, UserBoard, {
        role: BoardsRole.ProjectManager,
      });
      cannot(Action.Update, UserBoard, {
        userId: user.id,
      });
    } else if (role == BoardsRole.TeamMember) {
      cannot(Action.Create, UserBoard);
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
