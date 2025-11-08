import { useEffect, useState, useRef } from 'react';
import PointCloud from "./components/PointCloud";
import Menu from "./components/Menu";
import FileDropWindow from './components/FileDropWindow';
import './App.css';


/*
App logic: 
- Fetch data from backend and use it for frontend.

Variables:
- points: Points coordinates ({x, y, z}).
- colorMode: Color scheme for rendered points.
  -- "default": all points white
  -- "colored": points colored based on height (red/orange/green)
- files: List of avaible .txt files retrieved from the backend.
- selectedFile: Name of currently selected file.
- pointCloudRef: Ref to PointCloud component, allowing parent to call child functions (ref + forwardRef + useImperativeHandle).

Notes:
- The app consists of a React frontend and FastAPI backend running separately.
- Users can select or drop files to display, switch color modes, and reset camera view.
*/
function App() {
  const [points, setPoints] = useState([]);
  const [colorMode, setColorMode] = useState("default");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const pointCloudRef = useRef(null);

  /*
  Logic for taking the data from dropped .txt file.
  - filename: Name of the dropped file.
  - fileContent: Content of dropped file.
  */
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
    setColorMode("default");

    // If no valid points found, show an error
    if (parsedPoints.length === 0) {
      alert("Invalid file content: No valid numeric coordinates found.\n\nPlease upload a .txt file with provided coordinates:\nX Y Z (one point per line).");
      console.error("Invalid file:", filename);
      return;
    }
  };

  // Fetch the list of avaible files from FastAPI after first run
  useEffect(() => {
    fetch("http://127.0.0.1:8000/files")
      .then((res) => res.json())
      .then((data) => setFiles(data.files))
      .catch((err) => console.error("Error fetching file list:", err));
  }, []);

  // Get data points from specific file 
  const handleLoadFile = (filename) => {
    fetch(`http://127.0.0.1:8000/points?filename=${filename}`)
      .then((res) => {
        if (!res.ok) throw new Error("File not found.");
        return res.json()
      })
      .then((data) => {
        setPoints(data);
        setSelectedFile(filename);
        setColorMode("default");
      })
      .catch((err) => {
        console.error("Error loading file:", err);
        alert("Failed to load file.");
      })      
  };
  // async approach
  // const handleLoadFile = async (filename) => {
  //   try {
  //     const res = await fetch(`http://127.0.0.1:8000/points?filename=${filename}`);
  //     if (!res.ok) throw new Error("File not found.");
  //     const data = await res.json();
  //     // console.log("Loaded: ", data)
  //     setPoints(data);
  //     setSelectedFile(filename);
  //     setColorMode("default");
  //   } catch (err) {
  //     console.error("Error loading file:", err);
  //     alert("Failed to load file.");
  //   }
  // };

  return (
    <div className='container'>
      <FileDropWindow handleDropFile={handleDropFile} />
      <PointCloud 
        ref={pointCloudRef} 
        points={points} 
        colorMode={colorMode} 
        filename={selectedFile}>
      </PointCloud>
      <Menu 
        files={files} 
        selectedFile={selectedFile} 
        handleLoadFile={handleLoadFile} 
        setColorMode={setColorMode} 
        colorMode={colorMode}
        hasFile={points.length > 0}
        onResetView={() => pointCloudRef.current?.resetView()}>        
      </Menu>
    </div>
  )
}

export default App
