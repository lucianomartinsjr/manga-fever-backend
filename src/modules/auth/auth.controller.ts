import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EntrarAuthDto } from './dto/entrar-auth.dto';
import { CadastrarAuthDto } from './dto/cadastrar-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('entrar')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Usuário autenticado com sucesso.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Credênciais informadas inválidas.',
    })
    entrar(@Body() EntrarAuthDto: EntrarAuthDto) {
        return this.authService.entrar(EntrarAuthDto);
    }

    @Post('cadastrar')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Usuário criado com sucesso.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description:
            'Nome de usuário inválido.\t\n Nome de usuário já utilizado.\t\n Email do usuário já utilizado.',
        isArray: true,
    })
    cadastrar(@Body() cadastrarAuthDto: CadastrarAuthDto) {
        return this.authService.cadastrar(cadastrarAuthDto);
    }
}