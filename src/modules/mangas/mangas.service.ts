import { Injectable } from '@nestjs/common';
import { CreateMangasDto } from './dto/create-mangas.dto';
import { UpdateMangasDto } from './dto/update-mangas.dto';

@Injectable()
export class MangasService {
  create(createMangasDto: CreateMangasDto) {
    return 'This action adds a new mangas';
  }

  findAll() {
    return `This action returns all mangas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mangas`;
  }

  update(id: number, updateMangasDto: UpdateMangasDto) {
    return `This action updates a #${id} mangas`;
  }

  remove(id: number) {
    return `This action removes a #${id} mangas`;
  }
}
