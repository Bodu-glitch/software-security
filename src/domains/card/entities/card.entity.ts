import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Columns } from '../../columns/entities/column.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('timestamptz', { nullable: true })
  dueDate: Date;

  @ManyToOne(()=> Columns, (column) => column.cards, {
    onDelete: 'CASCADE',
  })
  columns: Columns;

  @ManyToMany(() => User, (user) => user.cards, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinTable({ name: 'users_cards' })
  members: User[];
}
