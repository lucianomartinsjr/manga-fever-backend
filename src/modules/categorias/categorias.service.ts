import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from '../prisma/prisma.service';
import { async } from 'rxjs';
import { string } from 'zod';

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

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    // Use o Prisma Client para encontrar a categoria pelo ID
    const categoria = await this.db.categoria.findUnique({ where: { id:id } });

    if (!categoria) {
      throw new Error(`Categoria #${id} não encontrada`);
    }

    // Use o Prisma Client para atualizar os campos da categoria
    const categoriaAtualizada = await this.db.categoria.update({
      where: { id:id },
      data: updateCategoriaDto,
    });

    return categoriaAtualizada;
  }

  async remove(id: string) {

    const categoria = await this.db.categoria.findUnique({ where: { id:id } });
    if (!categoria) {
      throw new Error(`Categoria #${id} não encontrada`);
    }
    await this.db.categoria.delete({ where: { id:id } });
    return `Categoria #${id} removida com sucesso`;
  }
}
