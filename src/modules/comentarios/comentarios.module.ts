import { Module } from '@nestjs/common';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';

@Module({
  controllers: [ComentariosController],
  providers: [ComentariosService]
})
export class ComentariosModule {}
