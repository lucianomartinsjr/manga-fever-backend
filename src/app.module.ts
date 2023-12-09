import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { MangasModule } from './modules/mangas/mangas.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ComentariosModule } from './modules/comentarios/comentarios.module';

@Module({
  imports: [
    UsuariosModule,
    MangasModule,
    CategoriasModule,
    AuthModule,
    ComentariosModule
  ],
  controllers: [],
  providers: [
      AppService, 
      PrismaService,
      {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    }
  ],
})
export class AppModule { }
