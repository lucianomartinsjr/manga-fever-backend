import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import { PrismaService } from '../modules/prisma/prisma.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Injectable()
export class AdminGuard extends JwtGuard implements CanActivate {

  constructor(private db: PrismaService) { super() }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.user)
    const user = await this.db.usuario.findUnique({ where: { id: request.user.id! } })
    if (!user.isAdmin) {
      throw new UnauthorizedException("O usuário deve ser admin")
    }
    return true;
  }
}
