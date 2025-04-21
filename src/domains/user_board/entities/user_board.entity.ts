import { Entity, ManyToOne, PrimaryColumn, JoinColumn, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Board } from '../../board/entities/board.entity';
import { BoardsRoles } from '../../../decorators/boards_roles.decorator';
import { BoardsRole } from '../../../enums/boards_role';

@Entity()
export class UserBoard {
  @PrimaryColumn('uuid')
  user_id: string;

  @PrimaryColumn('uuid')
  board_id: string;

  @ManyToOne(() => User, (user) => user.inBoards)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Board, (board) => board.usersInBoard)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'text',
    nullable: false,
    default: BoardsRole.TeamMember,
  })
  role: BoardsRole;
}
