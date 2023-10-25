import { IsNotEmpty } from "class-validator";
import { isStringObject } from "util/types";

export class CreateMangasDto {
  @IsNotEmpty()
  titulo: string;
  descricao: string;
  imagem: string;
  categorias: string[];
}
