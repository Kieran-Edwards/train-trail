import { TimetableWrap } from "./components/TimetableWrap";
import './App.css'

function App() {

  return (
    <>
      <main className="flex lg:flex-row flex-col lg:pt-16 pb-4">
        <TimetableWrap stationCode="CFH" destCode="FST" title="Chafford to Fenchurch"/>
        <TimetableWrap stationCode="FST" destCode="CFH" title="Fenchurch to Chafford"/>
        <TimetableWrap stationCode="EUS" destCode="WFJ" title="Euston to Watford"/>
        <TimetableWrap stationCode="WFJ" destCode="EUS" title="Watford to Euston"/>
      </main>
    </>
  )
}

export default App
