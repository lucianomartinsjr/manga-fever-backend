import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PrismaService } from './modules/prisma/prisma.service';

@Module({
  imports: [UsuariosModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
