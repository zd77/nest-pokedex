import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor( 
    @InjectModel(Pokemon.name) // El nombre de la clase del modelo
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}
  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);
    const pokemonToInsert: { name: string, no: number }[] = [];
    data.results.forEach(({ name, url}) => {
      const segments = url.split('/');
      const no:number = +segments[ segments.length - 2 ];
      pokemonToInsert.push({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed Executed';
  // async executeSeed() {
  //   await this.pokemonModel.deleteMany({});
  //   const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=12`);
  //   const insertPromisesarray = [];
  //   data.results.forEach(({ name, url}) => {
  //     const segments = url.split('/');
  //     const no:number = +segments[ segments.length - 2 ];
  //     // this.pokemonService.create({name, no});
  //     insertPromisesarray.push(this.pokemonModel.create({name, no}));
  //   });
  //   await Promise.all( insertPromisesarray );
  //   return 'Seed Executed';
  }
}
