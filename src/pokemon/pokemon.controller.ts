import { PokemonService } from './pokemon.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Pokemon } from './types';
import { AuthGuard } from '@nestjs/passport';

@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  listAllPokemons(): Array<Pokemon> {
    return this.pokemonService.listAllPokemons();
  }
}
