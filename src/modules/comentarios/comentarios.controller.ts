import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { JwtGuard } from 'src/guards/jwt.guard';


@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) { }

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createComentarioDto: CreateComentarioDto) {
    // return this.comentariosService.create(createComentarioDto);
  }

}
