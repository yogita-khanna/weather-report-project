import './App.css';
import InfiniteScroll from './components/InfiniteScroll'
import WeatherPage from "./components/WeatherPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
        <Route path="/" element={<InfiniteScroll/>} />
        <Route path="/weatherPage" element={<WeatherPage/>} />
    </Routes>
  );
}

export default App;