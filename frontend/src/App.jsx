import { useEffect, useState } from 'react';
import PointCloud from "./components/PointCloud";
import Menu from "./components/Menu";
import FileDropWindow from './components/FileDropWindow';
import './App.css';

function App() {
  const [points, setPoints] = useState([]);
  const [colorMode, setColorMode] = useState("default");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");

  const handleDropFile = (filename, fileContent) => {
    console.log("Dropped file: ", filename);
    const txtPointsToArray = fileContent.trim().split("\n")
    // console.log(txtPointsToArray)
    // const numberPointsToArray = txtPointsToArray.map(line => line.trim().split(/\s+/).map(Number))
    // console.log(numberPointsToArray);
    const parsedPoints = txtPointsToArray.map(line => {
      const coordinates = line.trim().split(/\s+/).map(Number);
      if (coordinates.length !== 3 || coordinates.some(isNaN)) {
        return null;
      }
      const [x, y, z] = coordinates;
      return { x: x, y: z, z: y };
    }).filter(Boolean);
    // console.log(parsedPoints);
    setPoints(parsedPoints);
    setSelectedFile(filename);

    // If no valid points found, show an error
    if (parsedPoints.length === 0) {
      alert("Invalid file content: No valid numeric coordinates found.\n\nPlease upload a .txt file with provided coordinates:\nX Y Z (one point per line).");
      console.error("Invalid file:", filename);
      return;
    }
  }

  // Points from FastAPI
  useEffect(() => {
    fetch("http://127.0.0.1:8000/files")
      .then((res) => res.json())
      .then((data) => setFiles(data.files))
      .catch((err) => console.error("Error fetching file list:", err));
  }, []);

  const handleLoadFile = async (filename) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/points?filename=${filename}`);
      if (!res.ok) throw new Error("File not found.");
      const data = await res.json();
      // console.log("Loaded: ", data)
      setPoints(data);
      setSelectedFile(filename);
    } catch (err) {
      console.error("Error loading file:", err);
      alert("Failed to load file.");
    }
  };

  return (
    <div className='container'>
      <FileDropWindow handleDropFile={handleDropFile} />
      <PointCloud points={points} colorMode={colorMode} filename={selectedFile}></PointCloud>
      <Menu 
        files={files} 
        selectedFile={selectedFile} 
        handleLoadFile={handleLoadFile} 
        setColorMode={setColorMode} 
        colorMode={colorMode}
        hasFile={points.length > 0}> 
      </Menu>
    </div>
  )
}

export default App
