import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '@prisma/client';
import { omitObjectFields as deleteObjectFields } from 'src/helpers/object.helper';
import { encriptPassword, verifyPassword } from 'src/helpers/senha.helper';
import { validateusuarioname } from 'src/helpers/validators.helper';
import { PrismaService } from '../prisma/prisma.service';
import { EntrarAuthDto } from './dto/entrar-auth.dto';
import { CadastrarAuthDto } from './dto/cadastrar-auth.dto';

@Injectable()
export class AuthService {
    constructor(private db: PrismaService, private jwtService: JwtService) { }

    async validarCredencialUsuarios(
        email: string,
        senha: string,
    ): Promise<Usuario | null> {
        const usuario = await this.db.usuario.findFirst({ where: { email } });
        if (!usuario) {
            return null;
        }
        if (!(await verifyPassword(senha, usuario.hashedPassword))) {
            return null;
        }
        return usuario;
    }

    async entrar(entrarAuthDto: EntrarAuthDto) {
        const usuario = await this.validarCredencialUsuarios(
            entrarAuthDto.email,
            entrarAuthDto.senha,
        );
        if (!usuario) {
            throw new UnauthorizedException('Nome de usuário ou senha está inválida.');
        }
        return {
            token: this.jwtService.sign(usuario),
        };
    }

    async cadastrar(cadastrarAuthDto: CadastrarAuthDto) {
        const validacaoUsuario = validateusuarioname(cadastrarAuthDto.nomeUsuario);
        if (validacaoUsuario) {
            throw new BadRequestException(validacaoUsuario);
        }
        if (
            await this.db.usuario.findUnique({
                where: { nomeUsuario: cadastrarAuthDto.nomeUsuario },
            })
        ) {
            throw new BadRequestException('Este nome de usuário já está sendo utilizado.');
        }
        if (
            await this.db.usuario.findUnique({
                where: { email: cadastrarAuthDto.email },
            })
        ) {
            throw new BadRequestException('Email já cadastrado no sistema');
        }
        const hashedPassword = await encriptPassword(cadastrarAuthDto.senha);
        const usuarioCreateData = deleteObjectFields(cadastrarAuthDto, ['senha']);
        const usuario = await this.db.usuario.create({
            data: {
                email: usuarioCreateData.email,
                nomeUsuario: usuarioCreateData.nomeUsuario,
                hashedPassword,
            },
        });
        return { token: this.jwtService.sign(usuario) };
    }
}
