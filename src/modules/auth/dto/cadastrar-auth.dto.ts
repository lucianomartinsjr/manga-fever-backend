import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CadastrarAuthSchema = z.object({
    nomeUsuario: z.string(),
    email: z.string(),
    senha: z.string(),
});

export class CadastrarAuthDto extends createZodDto(CadastrarAuthSchema) {
    @ApiProperty()
    readonly nomeUsuario: string;
    @ApiProperty()
    readonly email: string;
    @ApiProperty()
    readonly senha: string;
}
