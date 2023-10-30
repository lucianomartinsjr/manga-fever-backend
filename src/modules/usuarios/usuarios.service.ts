import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Usuario } from '@prisma/client';

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

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    // Verifique se o usuário com o ID fornecido existe
    const usuario = await this.db.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }
    // Atualize as propriedades do usuário com os valores do DTO
    const updatedUsuario = await this.db.usuario.update({
      where: { id },
      data: {
        nomeUsuario: updateUsuarioDto.nomeUsuario,
      },
    });

    return updatedUsuario;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
