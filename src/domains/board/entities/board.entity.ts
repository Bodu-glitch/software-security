import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserBoard } from '../../user_board/entities/user_board.entity';
import { Columns } from '../../columns/entities/column.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.boards, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;

  @OneToMany(() => UserBoard, (userBoard) => userBoard.board)
  usersInBoard: UserBoard[];

  @OneToMany(() => Columns, (column) => column.board, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  columns: Columns[];
}
