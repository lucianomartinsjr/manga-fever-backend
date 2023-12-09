import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateAvaliacaoDto {
  @IsNotEmpty()
  classificacao: number;
}
