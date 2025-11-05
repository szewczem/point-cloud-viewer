import { useEffect, useState } from 'react';
import PointCloud from "./components/PointCloud";
import Menu from "./components/Menu";
import './App.css';

function App() {
  const [points, setPoints] = useState([]);
  const [colorMode, setColorMode] = useState("default");

  // Points from FastAPI
  useEffect(() => {
    fetch("http://127.0.0.1:8000/points")
    .then((res) => res.json())
    .then((data) => setPoints(data))
    .catch((err) => console.error("Error loading points: ", err));
  }, []);

  return (
    <div className='container'>
      <PointCloud points={points} colorMode={colorMode}></PointCloud>
      <Menu setColorMode={setColorMode}></Menu>
    </div>
  )
}

export default App
