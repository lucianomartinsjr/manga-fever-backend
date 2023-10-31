import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const EntrarAuthSchema = z.object({
    nomeUsuario: z.string(),
    senha: z.string(),
});

export class EntrarAuthDto extends createZodDto(EntrarAuthSchema) {
    @ApiProperty()
    readonly email: string;
    @ApiProperty()
    readonly senha: string;
}
