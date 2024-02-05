import { PokemonTypes } from "./pokemon.types";

export interface Pokemon {
  readonly name: string;
  readonly type: PokemonTypes;
}
