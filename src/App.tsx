import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import MapPage from './pages/MapPage';

type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED";
type MemberType = "NORMAL" | "VIP";
type BotStatus = "IDLE" | "BUSY";

type OrderType = {
  id: number,
  type: MemberType,
  status: OrderStatus
}

type BotType = {
  id: number,
  status: BotStatus,
  processId?: number,
  timeout?: NodeJS.Timeout
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<HomePage/>}/>
        <Route path = "/test" element={<TestPage/>}/>
        <Route path = "/map" element={<MapPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
