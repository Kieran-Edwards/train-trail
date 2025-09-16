import { TrainData } from "./components/TrainData"
import './App.css'

function App() {

  return (
    <>
      <main className="flex lg:flex-row flex-col lg:pt-16 pb-4 mt-8">
        <TrainData stationCode="CFH" destCode="FST" />
        <TrainData stationCode="FST" destCode="CFH" />
      </main>
    </>
  )
}

export default App
