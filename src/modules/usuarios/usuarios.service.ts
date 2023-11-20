import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private db: PrismaService) { }


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
    return this.db.usuario.update({
      where: { id: String(id) },
      data: {
        isAdmin: true,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
