import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { MangasModule } from './modules/mangas/mangas.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UsuariosModule, MangasModule, CategoriasModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }