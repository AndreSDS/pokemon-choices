import React from "react"
import { EvolutionProps } from "../utils/helpers"

interface EvolutionLineProps {
  evolutionLine: EvolutionProps[]
  largeImage?: boolean
  currentPokemonName?: string
}

export const EvolutionLine: React.FC<EvolutionLineProps> = ({ evolutionLine, largeImage = false, currentPokemonName }) => {
  /* const getImageUrl = (speciesId: number) => {
    if (largeImage) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`
  } */

  return (
    <div className="evolution-line">
      {evolutionLine.map(({ name, imageUrl, speciesId }) => {
        /* if (!imageUrl && !speciesId) return null

        if (!imageUrl && speciesId) {
          imageUrl = getImageUrl(speciesId)
        } */

        return (
          <div
            key={name}
            className={`evolution-item ${name === currentPokemonName ? "highlight" : ""}`}
          >
            <img
              src={imageUrl}
              alt={name}
              className={`evolution-image ${largeImage ? "large" : ""}`}
            />
            <p>{name}</p>
          </div>
        )
      })}
    </div>
  )
}
