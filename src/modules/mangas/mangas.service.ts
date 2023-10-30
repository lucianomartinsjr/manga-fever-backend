import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMangasDto } from './dto/create-mangas.dto';
import { UpdateMangasDto } from './dto/update-mangas.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MangasService {
  constructor(private db: PrismaService) { }

  async create(createMangasDto: CreateMangasDto) {

    if (!Array.isArray(createMangasDto.categorias)) {
      throw new BadRequestException('Categorias deve ser um array.');
    }

    const manga = await this.db.manga.create({
      data: {
        titulo: createMangasDto.titulo,
        descricao: createMangasDto.descricao,
        imagem: createMangasDto.imagem,
      }
    })
    for (const idCategoria of createMangasDto.categorias) {
      await this.db.categoriaManga.create({ data: { idCategoria, idManga: manga.id } })
    }
    return manga;
  }

  findAll() {
    return this.db.manga.findMany();
  }

  async findOne(id: string) {

    const manga = await this.db.manga.findUnique({ where: { id: id }, include: { categorias: true } });

    if (!manga) {

      throw new NotFoundException('Manga não encontrado');
    }
    return manga;

  }

  update(id: number, updateMangasDto: UpdateMangasDto) {
    return `This action updates a #${id} mangas`;
  }

  remove(id: number) {
    return `This action removes a #${id} mangas`;
  }
}
