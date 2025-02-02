import { Header } from "./components/header"
import { TypeButtons } from "./components/typeButtons"
import { Arena } from "./components/arena"
import { Results } from "./components/results"
import { TournamentProvider } from "./contexts/tournamentContext"
import "./global.css"
import { PokemonProvider } from "./contexts/pokemonContext"

function App() {
  return (
    <PokemonProvider>
      <TournamentProvider>
        <div className="App">
          <Header />
          <TypeButtons />
          <Arena />
          <Results />
        </div>
      </TournamentProvider>
    </PokemonProvider>
  )
}

export default App
