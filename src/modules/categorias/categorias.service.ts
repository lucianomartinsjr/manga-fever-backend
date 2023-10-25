import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriasService {
  constructor(private db: PrismaService) { }

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.db.categoria.create({ data: createCategoriaDto });
  }

  findAll() {
    return this.db.categoria.findMany();
  }

  async findOne(id: string) {
    const categoria = this.db.categoria.findUnique({ where: { id: id } });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrado');
    }
    return categoria;
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
