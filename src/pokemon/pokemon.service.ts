import { Pokemon } from './types/pokemon.interface';
import { PokemonTypes } from './types/pokemon.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PokemonService {
  private pokemons: Pokemon[] = [
    { name: 'Picachu', type: PokemonTypes.ELECTRIC },
    { name: 'Volpix', type: PokemonTypes.FIRE },
    { name: 'Flabebe', type: PokemonTypes.FAIRY },
  ];

  listAllPokemons(): Pokemon[] {
    return this.pokemons;
  }
}
