import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMangasDto } from './dto/create-mangas.dto';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateMangasDto } from './dto/update-mangas.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MangasService {
  constructor(private db: PrismaService) { }

  async create(createMangasDto: CreateMangasDto) {

    if (!Array.isArray(createMangasDto.categorias)) {
      throw new BadRequestException('Categorias deve ser um array.');
    }

    const manga = await this.db.manga.create({
      data: {
        titulo: createMangasDto.titulo,
        descricao: createMangasDto.descricao,
        imagem: createMangasDto.imagem,
      }
    })
    for (const idCategoria of createMangasDto.categorias) {
      await this.db.categoriaManga.create({ data: { idCategoria, idManga: manga.id } })
    }

    return manga;
  }

  // findAll() {
  //   return this.db.manga.findMany();
  // }

  async findAll(){
     const mangas = await this.db.manga.findMany({
    include: {
    categorias: true,
    avaliacoes: true
    }
    });

    // Criando uma lista vazia para armazenar os mangás formatados
    const mangasFormatados = [];

    // Percorrendo cada mangá da lista
    for (const manga of mangas) {
    // Criando uma lista vazia para armazenar as avaliações do mangá
    const avaliacoes = [];

    // Percorrendo cada avaliação do mangá
    for (const avaliacao of manga.avaliacoes) {
    // Adicionando a avaliação à lista
    avaliacoes.push(avaliacao);
    }

    // Calculando a média das avaliações do mangá
    const media = avaliacoes.length > 0 ? avaliacoes.reduce((total, avaliacao) => total + avaliacao.classificacao, 0) / avaliacoes.length : null;

    // Criando um objeto com os dados do mangá formatados
    const mangaFormatado = {
    id: manga.id,
    titulo: manga.titulo,
    imagem: manga.imagem,
    categorias: manga.categorias,
    nota: media
    };

    // Adicionando o mangá formatado à lista
    mangasFormatados.push(mangaFormatado);
    }

    // Retornando a lista de mangás formatados
    return mangasFormatados;
  }


  // async findOne(id: string) {
  //   const manga = await this.db.manga.findUnique({
  //     where: { id: id }, include: {
  //       categorias: true,
  //       avaliacoes: true,
  //     }
  //   });
  
  //   if (!manga) {
  //     throw new NotFoundException('Manga não encontrado');
  //   }

  //   const avaliacoes = [];

  //   for (const avaliacao of manga.avaliacoes) {
  //     avaliacoes.push(avaliacao);
  //   }

  //   console.log(avaliacoes)
  
  //   const media = avaliacoes.length > 0 ? avaliacoes.reduce((total, avaliacao) => total + avaliacao.classificacao, 0) / avaliacoes.length : null;
  
  //   return {
  //     id: manga.id,
  //     titulo: manga.titulo,
  //     descricao: manga.descricao,
  //     imagem: manga.imagem,
  //     categorias: manga.categorias,
  //     nota: media,
  //   };
  // }
  
  async findOne(id: string) {
    const manga = await this.db.manga.findUnique({
      where: { id: id },
      include: {
        categorias: true,
        avaliacoes: true,
      },
    });
  
    if (!manga) {
      throw new NotFoundException('Manga não encontrado');
    }
  
    const avaliacoes = manga.avaliacoes || [];
  
    const media =
      avaliacoes.length > 0
        ? avaliacoes.reduce((total, avaliacao) => total + avaliacao.classificacao, 0) / avaliacoes.length
        : null;
  
    // Extrai os IDs das categorias do relacionamento CategoriaManga
    const idsCategorias = manga.categorias.map((categoriaManga) => categoriaManga.idCategoria);
  
    // Consulta as categorias pelo ID para obter os nomes
    const categorias = await this.db.categoria.findMany({
      where: {
        id: {
          in: idsCategorias,
        },
      },
    });
  
    // Mapeia as categorias para retornar apenas os campos desejados (id e descricao)
    const categoriasFormatadas = categorias.map((categoria) => {
      return {
        id: categoria.id,
        descricao: categoria.descricao,
      };
    });
  
    return {
      id: manga.id,
      titulo: manga.titulo,
      descricao: manga.descricao,
      imagem: manga.imagem,
      categorias: categoriasFormatadas,
      nota: media,
    };
  }
  


  async createAvaliacao(CreateAvaliacaoDto: CreateAvaliacaoDto) {
    const manga = await this.db.manga.findUnique({ where: { id: CreateAvaliacaoDto.idManga } });
    const usuario = await this.db.usuario.findUnique({ where: { id: CreateAvaliacaoDto.idUsuario } });
    if (!manga || !usuario) {
      throw new NotFoundException('Manga ou usuário não encontrado');
    }
    
     if (isNaN(CreateAvaliacaoDto.classificacao) ||CreateAvaliacaoDto.classificacao < 1 || CreateAvaliacaoDto.classificacao > 5) {
      throw new BadRequestException('Classificação deve ser um número entre 1 e 5.');
     }
    const avaliacao = await this.db.avaliacao.create({
      data: {
        idManga: CreateAvaliacaoDto.idManga,
        idUsuario: CreateAvaliacaoDto.idUsuario,
        classificacao: CreateAvaliacaoDto.classificacao
      }
    });
    return avaliacao;
  }

  update(id: number, updateMangasDto: UpdateMangasDto) {
    return `This action updates a #${id} mangas`;
  }

  remove(id: number) {
    return `This action removes a #${id} mangas`;
  }

}
