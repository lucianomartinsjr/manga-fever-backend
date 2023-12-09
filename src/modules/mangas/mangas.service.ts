import { 
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { CreateMangasDto } from './dto/create-mangas.dto';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
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


  async findAllLogged(currentUser) {

    const mangas = await this.db.manga.findMany({
      include: {
        categorias: true,
        avaliacoes: true,
      },
    });
  
    // Criando uma lista vazia para armazenar os mangás formatados
    const mangasFormatados = [];
  
    for (const manga of mangas) {
      const avaliacoes = [];
  
      // Percorrendo cada avaliação do mangá
      for (const avaliacao of manga.avaliacoes) {
        // Adicionando a avaliação à lista
        avaliacoes.push(avaliacao);
      }
  
      // Calculando a média das avaliações do mangá
      const media =
        avaliacoes.length > 0
          ? avaliacoes.reduce(
              (total, avaliacao) => total + avaliacao.classificacao,
              0
            ) / avaliacoes.length
          : null;
            
      // Verificando se o mangá é favorito para o usuário
      const favorito = await this.db.favorito.findUnique({
        where: {
          idUsuario_idManga: {
            idUsuario: currentUser.user.id,
            idManga: manga.id,
          },
        },
      });
  
      // Criando um objeto com os dados do mangá formatados
      const mangaFormatado = {
        id: manga.id,
        titulo: manga.titulo,
        imagem: manga.imagem,
        categorias: manga.categorias,
        nota: media,
        userFavorite: favorito !== null, // Indica se o mangá é favorito para o usuário
      };
  
      // Adicionando o mangá formatado à lista
      mangasFormatados.push(mangaFormatado);
    }
  
    // Retornando a lista de mangás formatados
    return mangasFormatados;
  }
  

  async findAll(){
     const mangas = await this.db.manga.findMany({
    include: {
    categorias: true,
    avaliacoes: true,
    }
    });

    // Criando uma lista vazia para armazenar os mangás formatados
    const mangasFormatados = [];

    for (const manga of mangas) {
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
    nota: media,
    userFavorite: false 
    };

    // Adicionando o mangá formatado à lista
    mangasFormatados.push(mangaFormatado);
    }

    // Retornando a lista de mangás formatados
    return mangasFormatados;
  }

  
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
  


  async createAvaliacao(CreateAvaliacaoDto, CurrentUser, id: string) {
    const manga = await this.db.manga.findUnique({ where: { id } });
    const usuario = await this.db.usuario.findUnique({ where: { id: CurrentUser.user.id } });
  
    if (!manga || !usuario) {
      throw new NotFoundException('Manga ou usuário não encontrado');
    }
  
    if (isNaN(CreateAvaliacaoDto.classificacao) || CreateAvaliacaoDto.classificacao < 1 || CreateAvaliacaoDto.classificacao > 5) {
      throw new BadRequestException('Classificação deve ser um número entre 1 e 5.');
    }
  
    return this.db.$transaction(async (prisma) => {
      // Check if the user has already rated the manga
      const existingAvaliacao = await prisma.avaliacao.findFirst({
        where: {
          idManga: id,
          idUsuario: CurrentUser.user.id,
        },
      });
  
      if (existingAvaliacao) {
        // If an existing rating is found, delete it
        await prisma.avaliacao.delete({
          where: {
            id: existingAvaliacao.id,
          },
        });
      }
  
      // Create the new evaluation
      const newAvaliacao = await prisma.avaliacao.create({
        data: {
          idManga: id,
          idUsuario: CurrentUser.user.id,
          classificacao: CreateAvaliacaoDto.classificacao,
        },
      });
  
      return { message: 'Avaliação criada ou atualizada com sucesso.', novaAvaliacao: newAvaliacao };
    });
  }
  


  async favoritarManga(currentUser, id: string) {
    const manga = await this.db.manga.findUnique({ where: { id } });
  
    if (!manga) {
      throw new NotFoundException('Mangá não encontrado.');
    }
  
    const favoritoExistente = await this.checkFavoritoExistence(currentUser.user.id, id);
  
    return this.db.$transaction(async (prisma) => {
      if (favoritoExistente) {
        await this.desfavoritarManga(prisma, currentUser.user.id, id);
        return { message: 'Mangá removido dos favoritos com sucesso.' };
      } else {
        await this.criarfavoritoManga(prisma, currentUser.user.id, id);
        return { message: 'Mangá favoritado com sucesso.' };
      }
    });
  }
  
  private async checkFavoritoExistence(userId: string, mangaId: string): Promise<boolean> {
    const favoritoExistente = await this.db.favorito.findFirst({
      where: {
        AND: [
          { idUsuario: userId },
          { idManga: mangaId },
        ],
      },
    });
    return Boolean(favoritoExistente);
  }
  
  private async desfavoritarManga(prisma, userId: string, mangaId: string): Promise<void> {
    await prisma.favorito.deleteMany({
      where: {
        AND: [
          { idUsuario: userId },
          { idManga: mangaId },
        ],
      },
    });
  }
  
  private async criarfavoritoManga(prisma, userId: string, mangaId: string): Promise<void> {
    await prisma.favorito.create({
      data: {
        idUsuario: userId,
        idManga: mangaId,
      },
    });
  }
}
