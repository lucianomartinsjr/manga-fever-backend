import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComentariosService {
  constructor(private db: PrismaService) { }

  create(createComentarioDto: any) {
    return this.db.comentario.create({ data: createComentarioDto });
  }


  async remove(id: string) {
    const comentario = await this.db.comentario.findFirst({ where: { id: id } });
    if (!comentario) {
      throw new BadRequestException(`Comentario não encontrado`);
    }
    await this.db.comentario.delete({ where: { id: id } });
    return `Comentario removido com sucesso`;
  }
}
