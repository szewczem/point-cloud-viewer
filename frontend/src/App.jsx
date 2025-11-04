import { useEffect, useState } from 'react'
import PointCloud from "./components/PointCloud";
import './App.css'

function App() {
  const [points, setPoints] = useState([]);

  // Points from FastAPI
  useEffect(() => {
    fetch("http://127.0.0.1:8000/points")
    .then((res) => res.json())
    .then((data) => setPoints(data))
    .catch((err) => console.error("Error loading points: ", err));
  }, []);

  return (
    <div className='container'>
      <PointCloud points={points}></PointCloud>
    </div>
  )
}

export default App
