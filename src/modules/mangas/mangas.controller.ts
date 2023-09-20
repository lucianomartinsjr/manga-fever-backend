import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MangasService } from './mangas.service';
import { CreateMangasDto } from './dto/create-mangas.dto';
import { UpdateMangasDto } from './dto/update-mangas.dto';

@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}

  @Post()
  create(@Body() createMangasDto: CreateMangasDto) {
    return this.mangasService.create(createMangasDto);
  }

  @Get()
  findAll() {
    return this.mangasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mangasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMangasDto: UpdateMangasDto) {
    return this.mangasService.update(+id, updateMangasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mangasService.remove(+id);
  }
}
