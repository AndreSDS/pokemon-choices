import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { PokemonsDetails, fetchPokemonByType } from "../utils/helpers"

interface PokemonsBytType {
    type: string
    pokemons: PokemonsDetails[]
}

export interface ChosenPokemon {
    score: number
    pokemon: PokemonsDetails
}

interface PokemonContextType {
    loading: boolean
    currentPokemons: PokemonsBytType
    chosenPokemons: ChosenPokemon[]
    resetCurrentPokemons: () => void
    resetChosenPokemons: () => void
    getPokemonForType: (type: string) => Promise<void>
    updateChosenPokemons: (winner: PokemonsDetails) => void
    decreaseCurrentPokemons: (pokemonToExclude: PokemonsDetails) => void
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined)

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [currentPokemons, setCurrentPokemons] = useState<PokemonsBytType>({} as PokemonsBytType)
    const [chosenPokemons, setChosenPokemons] = useState<ChosenPokemon[]>([])

    const getPokemonForType = useCallback(
        async (type: string) => {
            setLoading(true)

            if (currentPokemons.type) {
                return
            }

            const fetchedPokemon = await fetchPokemonByType(type)
            setCurrentPokemons({
                type,
                pokemons: fetchedPokemon,
            })

            setLoading(false)
        },
        [currentPokemons],
    )

    const resetCurrentPokemons = () => {
        setCurrentPokemons({} as PokemonsBytType)
    }

    const resetChosenPokemons = () => {
        setChosenPokemons([])
    }

    const checkIfPokemonInChosen = useCallback((pokemon: PokemonsDetails): ChosenPokemon | undefined => {
        const pokemonAlreadyexists = chosenPokemons.find((p) => {
            return p.pokemon.id === pokemon.id
        })

        return pokemonAlreadyexists
    }, [chosenPokemons])

    const updatePokemonScore = (pokemon: PokemonsDetails): ChosenPokemon => {
        const pokemonInChosen = checkIfPokemonInChosen(pokemon)

        if (pokemonInChosen) {
            pokemonInChosen.score = pokemonInChosen.score + 1
            return pokemonInChosen
        }

        const newPokemon: ChosenPokemon = {
            score: 1,
            pokemon,
        }

        return newPokemon
    }

    const updateChosenPokemons = useCallback((winner: PokemonsDetails) => {
        const pokemonScoreUpdated = updatePokemonScore(winner)
        
        const indexWinner = chosenPokemons.findIndex((p) => {
            return p.pokemon.id === pokemonScoreUpdated.pokemon.id
        })

        if (indexWinner !== -1) {
            setChosenPokemons((prev) => {
                const newChosenPokemons = [...prev]
                newChosenPokemons[indexWinner] = pokemonScoreUpdated
                return newChosenPokemons
            })
        } else {
            setChosenPokemons((prev) => [...prev, pokemonScoreUpdated])
        }
    }, [chosenPokemons])

    const decreaseCurrentPokemons = useCallback((pokemonToExclude: PokemonsDetails) => {
        setCurrentPokemons((prev) => {
            const pokemons = prev.pokemons.filter((currentPokemon) => currentPokemon.name !== pokemonToExclude.name)
            return { ...prev, pokemons }
        })
    }, [])

    const winnersPokemon = chosenPokemons.sort((a, b) => a.score > b.score ? -1 : 1).slice(0, 3)

    return (
        <PokemonContext.Provider value={{ loading, currentPokemons, chosenPokemons: winnersPokemon, getPokemonForType, updateChosenPokemons, resetCurrentPokemons, resetChosenPokemons, decreaseCurrentPokemons }}>
            {children}
        </PokemonContext.Provider>
    )
}

export const usePokemon = () => {
    const context = useContext(PokemonContext)
    if (context === undefined) {
        throw new Error("usePokemon must be used within a PokemonProvider")
    }
    return context
}