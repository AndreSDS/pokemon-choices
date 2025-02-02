import type React from "react"
import { useTournament } from "../contexts/tournamentContext"
import { usePokemon } from "../contexts/pokemonContext"

export const Results: React.FC = () => {
  const { tournamentResults, resetTournament } = useTournament()
  const {chosenPokemons} = usePokemon()

  const {
    finished,
  } = tournamentResults

  const title = finished ? "Resultado Final" : "Resultado Parcial"

  return (
    <div className="results">
      {chosenPokemons.length > 0 && <h2>{title}</h2>}
      <div className="card-container">
        {chosenPokemons.map((chosenPokemon) => {
          const { pokemon: {
            name,
            imageUrl,
          } } = chosenPokemon

          return (
            <div key={name} className="card">
              <div className="card-image">
                <img src={imageUrl} alt={name} width="100px" />
              </div>
              <div className="card-content">
                <span>{name}</span>
              </div>
            </div>
          )
        })}
      </div>
      {finished && <div className="reset-button-container">
        <button className="reset-button" onClick={() => resetTournament()}>
          Reiniciar escolhas de pokemons
        </button>
      </div>}
    </div>
  )
}