import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../board/entities/board.entity';
import { UserBoard } from '../../user_board/entities/user_board.entity';
import { Card } from '../../card/entities/card.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false, unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: false })
  email: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Board, (board) => board.id, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  boards: Board[];

  @OneToMany(() => UserBoard, (userBoard) => userBoard.user)
  inBoards: UserBoard[];

  @ManyToMany(() => Card, (card) => card.members, {
    onDelete: 'CASCADE',
  })
  cards: Card[];
}
