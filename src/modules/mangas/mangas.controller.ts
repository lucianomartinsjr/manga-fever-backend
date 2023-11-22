import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MangasService } from './mangas.service';
import { CreateMangasDto } from './dto/create-mangas.dto';
import { UpdateMangasDto } from './dto/update-mangas.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { AdminGuard } from '../../guards/admin.guard';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) { }

  @Post("create")
  @UseGuards(JwtGuard, AdminGuard)
  create(@Body() createMangasDto: CreateMangasDto) {
    return this.mangasService.create(createMangasDto);
  }

  @Get()
  findAll() {
    return this.mangasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mangasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateMangasDto: UpdateMangasDto) {
    return this.mangasService.update(+id, updateMangasDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.mangasService.remove(+id);
  }

  @Post('avaliar')
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
  
 
}
