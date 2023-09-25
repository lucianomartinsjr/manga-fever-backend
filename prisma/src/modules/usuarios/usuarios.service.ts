import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    if (await this.db.usuario.findUnique({ where: { nomeUsuario: createUsuarioDto.nomeUsuario } })) {
      throw new BadRequestException('Nome de usuário já cadastrado');
    }

    return this.db.usuario.create({ data: createUsuarioDto });
  }

  findAll() {
    return this.db.usuario.findMany();
  }

  async findOne(id: string) {
    const usuario = await this.db.usuario.findUnique({ where: { id: id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
