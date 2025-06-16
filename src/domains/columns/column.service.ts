import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Columns } from './entities/column.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ColumnsService {
  constructor(@InjectRepository(Columns) private columnsRepository: Repository<Columns>) {
  }

  create(createColumnDto: CreateColumnDto, boardId: string) {
    const column = this.columnsRepository.create(
      {
        ...createColumnDto,
        board: { id: boardId },
      }
    )
    return this.columnsRepository.save(column);
  }

  async findAll( boardId: string) {
    const columns = await this.columnsRepository.find({
      where: { board: { id: boardId } },
    });

    return columns
  }

  findOne(id: number) {
    return `This action returns a #${id} column`;
  }

  async update(id: string, updateColumnDto: UpdateColumnDto) {
    const column = await this.columnsRepository.findOne({
      where: { id },
    });

    if (!column) {
      throw new Error(`Column with id ${id} not found`);
    }

    Object.assign(column, updateColumnDto);
    return this.columnsRepository.save(column);
  }

  async remove(id: string) {
    const column = await this.columnsRepository.findOne({
      where: { id },
    });

    if (!column) {
      throw new Error(`Column with id ${id} not found`);
    }

    return this.columnsRepository.remove(column);
  }
}
