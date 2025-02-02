import React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { PokemonsDetails, getRandomPokemons } from "../utils/helpers"
import { usePokemon } from "./pokemonContext"

interface CurrentBattle {
  pokemon1: PokemonsDetails
  pokemon2: PokemonsDetails
}

interface TournamentResult {
  finished: boolean
}

interface TournamentContextType {
  currentBattle: { pokemon1: PokemonsDetails; pokemon2: PokemonsDetails } | null
  arenaVisible: boolean
  tournamentResults: TournamentResult
  choosePokemon: (winner: PokemonsDetails) => void
  resetTournament: () => void
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined)

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBattle, setCurrentBattle] = useState<CurrentBattle | null>(null)
  const [arenaVisible, setArenaVisible] = useState(false)
  const [tournamentResults, setTournamentResults] = useState<TournamentResult>({
    finished: false
  })

  const { updateChosenPokemons, currentPokemons, chosenPokemons, resetCurrentPokemons, resetChosenPokemons, decreaseCurrentPokemons } = usePokemon()
  const startTournament = useCallback(() => {
    if (currentPokemons.pokemons && currentPokemons.pokemons.length < 2) {
      console.log(`No valid Pokemon found for type choosen`)
      setArenaVisible(false)
      return
    }
    setArenaVisible(true)
    showNextBattle()
  },
    [currentPokemons],
  )

  const showNextBattle = useCallback(() => {
    if (currentPokemons.pokemons && currentPokemons.pokemons.length === 0) {
      showResults()
      return
    }
    const [pokemon1, pokemon2] = getRandomPokemons<PokemonsDetails>(currentPokemons.pokemons)

    if (!pokemon1 || !pokemon2) {
      showResults()
      return
    }

    setCurrentBattle({ pokemon1, pokemon2 })
  },
    [currentPokemons],
  )

  const excludeNotChosen = useCallback((chosen: PokemonsDetails) => {
    if (currentBattle) {
      Object.entries(currentBattle).forEach(([key, pokemon]) => {
      const loser: PokemonsDetails = pokemon.name !== chosen.name && pokemon
      decreaseCurrentPokemons(loser)
      })
    }
  }, [currentBattle, decreaseCurrentPokemons])

  const choosePokemon = useCallback((chosen: PokemonsDetails) => {
    updateChosenPokemons(chosen)
    excludeNotChosen(chosen)
    showNextBattle()
  },
    [updateChosenPokemons, showNextBattle],
  )

  const showResults = () => {
    setTournamentResults({
      finished: true,
    })
    setCurrentBattle(null)
    setArenaVisible(false)
    resetCurrentPokemons()
  }

  const resetTournament = useCallback(() => {
    resetChosenPokemons()
  },
    [startTournament],
  )

  useEffect(() => {
    if (currentPokemons.pokemons && currentPokemons.pokemons.length > 0
      && chosenPokemons.length === 0
    ) {
      startTournament()
    }
  }, [currentPokemons])

  return (
    <TournamentContext.Provider
      value={{
        tournamentResults,
        currentBattle,
        arenaVisible,
        choosePokemon,
        resetTournament,
      }}
    >
      {children}
    </TournamentContext.Provider>
  )
}

export const useTournament = () => {
  const context = useContext(TournamentContext)
  if (context === undefined) {
    throw new Error("useTournament must be used within a TournamentProvider")
  }
  return context
}
