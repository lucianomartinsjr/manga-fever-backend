import { PartialType } from '@nestjs/mapped-types';
import { CreateMangasDto } from './create-mangas.dto';

export class UpdateMangasDto extends PartialType(CreateMangasDto) {}
