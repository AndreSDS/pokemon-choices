import type React from "react"
import { useTournament } from "../contexts/tournamentContext"
import { EvolutionLine } from "./evolutionLine"
import { usePokemon } from "../contexts/pokemonContext"

export const Arena: React.FC = () => {
  const { currentBattle, choosePokemon, arenaVisible } = useTournament()
  const {currentPokemons } = usePokemon()

  if (!arenaVisible || !currentBattle) return null

  return (
    <div className="arena">
      <h2 id="type-title">Torneio: {currentPokemons.type}</h2>
      <div className="pokemon-choice">
        {Object.entries(currentBattle).map(([key, pokemon]) => {
          return (
          <div key={key} className="evolution-line">
            <EvolutionLine key={key} evolutionLine={pokemon.evolutionLine} largeImage={true} currentPokemonName={pokemon.name} />
            <button onClick={() => choosePokemon(pokemon)}>Escolher</button>
          </div>
        )})}
      </div>
    </div>
  )
}