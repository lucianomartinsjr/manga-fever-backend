import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private db: PrismaService) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    if (await this.db.usuario.findUnique({ where: { email: createUsuarioDto.email } })) {
      throw new BadRequestException('Email já cadastrado');
    }

    return this.db.usuario.create({ data: createUsuarioDto });
  }

  findAll() {
    return this.db.usuario.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
