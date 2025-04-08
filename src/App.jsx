import { TimetableWrap } from "./components/TimetableWrap";
import './App.css'

function App() {

  return (
    <>
      <main className="flex flex-col lg:pt-16 pb-4">
        <TimetableWrap stationCode1="CFH" destCode1="FST" stationCode2="EUS" destCode2="WFJ" title="inbound"/>
        <TimetableWrap stationCode1="WFJ" destCode1="EUS" stationCode2="FST" destCode2="CFH" title="outbound"/>
      </main>
    </>
  )
}

export default App
