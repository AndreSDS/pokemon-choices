import type React from "react"
import { usePokemon } from "../contexts/pokemonContext"

export const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "grass",
  "flying",
  "fighting",
  "poison",
  "electric",
  "ground",
  "rock",
  "psychic",
  "ice",
  "bug",
  "ghost",
  "steel",
  "dragon",
  "dark",
  "fairy",
] as const

export const TypeButtons: React.FC = () => {
  const { getPokemonForType } = usePokemon()
  
  return (
    <div className="type-buttons">
      {pokemonTypes.map((type) => (
        <button key={type} className="type-button" onClick={() => getPokemonForType(type)}>
          {type}
        </button>
      ))}
    </div>
  )
}