import { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa6";
import Button from "./Button";
import "./Menu.css";


/*
Menu logic: 
- Provides a user interface for selecting files, switching point color modes, and resetting the camera view.

Variables:
- files: List of avaible files to display in the menu.
- hasFile: Boolean indicating whether a valid file has been selected.
- colorMode: Color scheme for rendered points.
  -- "default": all points white
  -- "colored": points colored based on height (red/orange/green)
- setColorMode: Function to update the colorMode state.
- handleLoadFile: Function to load point data from a selected file.
- onResetView: Function to reset the camera view (passed from App via ref to PointCloud).

Notes:
- The active color mode button highlights the current color scheme.
*/
export default function Menu({ files, hasFile, colorMode, setColorMode, handleLoadFile, onResetView }) {
  const [isOpen, setIsOpen] = useState(false);
 
  useEffect(() => {
    if (!hasFile) {
      setIsOpen(false);
    }
  }, [hasFile]);

  const handleSelect = (file) => {
    handleLoadFile(file);
    setIsOpen(false);
  };

  const openFileMenu = () => {
    setIsOpen((prev) => !prev)
  }

  return(
    <div className="menu">
      <Button onClick={openFileMenu} text={"Select File"}>
        <FaCaretDown className={`facaretdown ${isOpen ? "open" : ""}`} />
      </Button>
      <div className="file-list-container">
        {files.length > 0 && (
        <ul className={`file-list ${isOpen ? "visible" : "hidden"}`}>
          {files.length === 0 ? (
            <li className="disabled">No files found</li>
          ) : (
            files.map((file) => (
              <li key={file} onClick={() => handleSelect(file)}>
                <p>{file}</p>
              </li>
            ))
          )}
        </ul>
      )}
      </div>      
      <Button 
        className={colorMode === "default" ? "active" : ""} 
        onClick={() => hasFile && setColorMode("default")} 
        text={"Default View"}
        disabled={!hasFile}>        
      </Button>
      <Button 
        className={colorMode === "colored" ? "active" : ""} 
        onClick={() => hasFile && setColorMode("colored")} 
        text={"Color View"}
        disabled={!hasFile}>        
      </Button>
      <Button 
        onClick={() => onResetView()} 
        text={"Reset Camera"}
        disabled={!hasFile}>        
      </Button>
    </div>
  )
}