import { TrainData } from "./components/TrainData"
import './App.css'

function App() {

  const now = new Date();
  const hour = now.getHours();

  const isMorning = hour < 12;

  return (
    <>
      <main className={`flex ${isMorning ? "flex-col lg:flex-row" : "flex-col-reverse lg:flex-row-reverse"} lg:pt-16 pb-4 mt-8`}>
        <TrainData stationCode="CFH" destCode="FST" />
        <TrainData stationCode="FST" destCode="CFH" />
      </main>
    </>
  )
}

export default App
