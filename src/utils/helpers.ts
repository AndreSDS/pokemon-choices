export type PokemonsDetails = {
    id: number
    name: string
    url: string
    speciesUrl: string
    imageUrl: string
    evolutionLine: EvolutionProps[]
    type: string
  }
  
  export type EvolutionProps = {
    name: string
    imageUrl: string
    speciesId?: number
  }
  
  export async function fetchPokemonByType(type: string): Promise<PokemonsDetails[]> {
    const baseUrl = "https://pokeapi.co/api/v2/type/"
    try {
      const response = await fetch(`${baseUrl}${type}`)
      const data = await response.json()
  
      const pokemonByType: PokemonsDetails[] = await Promise.all(
        data.pokemon.map(async ({ pokemon }: { pokemon: { url: string } }) => {
          return await fetchPokemonDetails(pokemon.url, type)
        }),
      )
  
      return pokemonByType.filter((pokemon: PokemonsDetails) => pokemon !== null)
    } catch (error) {
      console.error(`Erro ao buscar Pokémon do tipo ${type}:`, error)
      return []
    }
  }
  
  async function fetchPokemonDetails(url: string, type: string): Promise<PokemonsDetails | null> {
    try {
      const response = await fetch(url)
      if (!response.ok) return null
  
      const data = await response.json()

      //console.log(data)
  
      if (/(kanto|johto|hoenn|sinnoh|unova|kalos|hisui|alola|galar|paldea|mega|gmax)/i.test(data.name)) {
        return null
      }
  
      const evolutionLine = await getEvolutionLine(data.species.url)
      if (evolutionLine.length < 1) return null
  
      return {
        id: data.id,
        name: data.name,
        url: data.url,
        speciesUrl: data.species.url,
        imageUrl: data.sprites.front_default,
        evolutionLine,
        type, // Add the type to the returned object
      } as PokemonsDetails
    } catch (error) {
      console.error(`Erro ao buscar detalhes do Pokémon: ${url}`, error)
      return null
    }
  }
  
  export async function getEvolutionLine(speciesUrl: string): Promise<EvolutionProps[]> {
    try {
      const speciesResponse = await fetch(speciesUrl)
      const speciesData = await speciesResponse.json()
  
      if (!speciesData.evolution_chain) return []
  
      const evolutionResponse = await fetch(speciesData.evolution_chain.url)
      const evolutionData = await evolutionResponse.json()
  
      const extractEvolutions = async (chain: any) => {
        const evolutions: EvolutionProps[] = []
  
        const imageUrl = await getPokemonImage(chain.species.name)
  
        if (imageUrl) {
          const currentPokemon = {
            name: chain.species.name,
            imageUrl,
          }
  
          if (chain.evolves_to.length > 0) {
            for (const evolution of chain.evolves_to) {
              const childEvolutions = await extractEvolutions(evolution)
              evolutions.push(...childEvolutions)
            }
          }
  
          evolutions.push(currentPokemon)
        }
  
        return evolutions
      }
  
      return await extractEvolutions(evolutionData.chain)
    } catch (error) {
      console.error("Erro ao buscar linha evolutiva:", error)
      return []
    }
  }
  
  async function getPokemonImage(name: string): Promise<string | undefined> {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      if (!response.ok) {
        console.warn(`Falha ao buscar dados para: ${name}. Status: ${response.status}`)
        return ""
      }
  
      const data = await response.json()
      const sprites = data.sprites
  
      const imageUrl: string =
        sprites.other?.["official-artwork"]?.front_default ||
        sprites.other?.home?.front_default ||
        sprites.front_default ||
        sprites.other?.showdown?.front_default ||
        sprites.back_default ||
        undefined
  
      if (!imageUrl) {
        console.warn(`Nenhuma imagem encontrada para ${name}`)
      }
  
      return imageUrl
    } catch (error) {
      console.error(`Erro ao buscar imagem para ${name}:`, error)
      return "path/to/placeholder-image.png"
    }
  }
  
  export function getRandomPokemons<T>(pokemons: T[]) {
    if (!pokemons || pokemons.length < 2) return [null, null]
  
    const shuffled = pokemons.sort(() => 0.5 - Math.random())
    return [shuffled[0], shuffled[1]]
  }
  