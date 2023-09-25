import { Module } from '@nestjs/common';
import { MangasService } from './mangas.service';
import { MangasController } from './mangas.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MangasController],
  providers: [MangasService, PrismaService],
})
export class MangasModule { }
