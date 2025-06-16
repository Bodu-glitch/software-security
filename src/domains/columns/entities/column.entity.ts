import { Entity, OneToMany, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Board } from '../../board/entities/board.entity';
import { Card } from '../../card/entities/card.entity';

@Entity()
export class Columns {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(()=> Board, board => board.columns, {
    onDelete: 'CASCADE',
  })
  board: Board

  @OneToMany(()=> Card, card => card.columns,{
    onDelete: 'CASCADE',
    cascade: true,
  })
  cards: Card[];
}

