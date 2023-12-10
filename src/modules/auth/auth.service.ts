import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '@prisma/client';
import { omitObjectFields as deleteObjectFields } from '../../helpers/object.helper';
import { encriptPassword, verifyPassword } from '../../helpers/password.helper';
import { validateUsername } from '../../helpers/validators.helper';
import { PrismaService } from '../prisma/prisma.service';
import { EntrarAuthDto } from './dto/entrar-auth.dto';
import { CadastrarAuthDto } from './dto/cadastrar-auth.dto';
import { LoginResponseDto } from './dto/login-response-dto';


@Injectable()
export class AuthService {
    constructor(
        private db: PrismaService,
         private jwtService: JwtService,
    ){}

    async validarCredencialUsuarios(
        nomeUsuario: string,
        senha: string,
    ): Promise<Usuario | null> {
        const usuario = await this.db.usuario.findFirst({ where: { nomeUsuario } });
        if (!usuario) {
            return null;
        }
        if (!(await verifyPassword(senha, usuario.senha))) {
            return null;
        }
        return usuario;
    }

    // async entrar(entrarAuthDto: EntrarAuthDto) {
    //     const usuario = await this.validarCredencialUsuarios(
    //         entrarAuthDto.nomeUsuario,
    //         entrarAuthDto.senha,
    //     );
    //     if (!usuario) {
    //         throw new UnauthorizedException('Nome de usuário ou senha está inválida.');
    //     }
    //     return {
    //         token: this.jwtService.sign(usuario),
    //     };
    // }
    
    async entrar(entrarAuthDto: EntrarAuthDto): Promise<LoginResponseDto> {
        const usuario = await this.validarCredencialUsuarios(
            entrarAuthDto.nomeUsuario,
            entrarAuthDto.senha,
        );
        
        if (!usuario) {
            throw new UnauthorizedException('Nome de usuário ou senha está inválida.');
        }
    
        return {
            token:this.jwtService.sign(usuario),
            isAdmin: usuario.isAdmin
        };
    }

    async cadastrar(cadastrarAuthDto: CadastrarAuthDto) {
        const validacaoUsuario = validateUsername(cadastrarAuthDto.nomeUsuario);
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
        const user = await this.db.usuario.create({
            data: {
                nomeUsuario: usuarioCreateData.nomeUsuario,
                email: usuarioCreateData.email,
                senha: hashedPassword
            },
        });
        return { token: this.jwtService.sign(user) };
    }
}
