import { Module } from '@nestjs/common';
import { MangasService } from './mangas.service';
import { MangasController } from './mangas.controller';

@Module({
  controllers: [MangasController],
  providers: [MangasService],
})
export class MangasModule {}
