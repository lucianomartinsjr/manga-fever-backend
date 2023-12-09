import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MangasService } from './mangas.service';
import { CreateMangasDto } from './dto/create-mangas.dto';
import { UpdateMangasDto } from './dto/update-mangas.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Usuario } from '@prisma/client';

@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) { }

  @Post("create")
  @UseGuards(JwtGuard,AdminGuard)
  create(@Body() createMangasDto: CreateMangasDto) {
    return this.mangasService.create(createMangasDto);
  }

  @Get()
  findAll() {
    return this.mangasService.findAll();
  }

  @Get('user')
  @UseGuards(JwtGuard)
  findAllLogged(@CurrentUser() currentUser ) {
    return this.mangasService.findAllLogged(currentUser);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Busca postagem pelo ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Postagem não encontrada.',
  })
  findOne(@Param('id') id: string) {
    return this.mangasService.findOne(id);
  }

  // @Patch(':id')
  // @UseGuards(JwtGuard)
  // update(@Param('id') id: string, @Body() updateMangasDto: UpdateMangasDto) {
  //   return this.mangasService.update(+id, updateMangasDto);
  // }

  // @Delete(':id')
  // @UseGuards(JwtGuard)
  // remove(@Param('id') id: string) {
  //   return this.mangasService.remove(+id);
  // }

  @Post('avaliar')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Avaliado com Sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "Classificação deve ser um número entre 1 e 5."
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
        "Manga ou usuário não encontrado"
  })
  async avaliarManga(@Body() CreateAvaliacaoDto: CreateAvaliacaoDto,){
    return this.mangasService.createAvaliacao(CreateAvaliacaoDto);
  }

  @Post('/favoritar/:id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mangá favoritado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Mangá não encontrado.',
  })
  async favoritarManga(@CurrentUser() currentUser: Usuario, @Param('id') id: string) {
    return this.mangasService.favoritarManga(currentUser,id);
  }
  
}
