import { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa6";
import Button from "./Button";
import "./Menu.css";

export default function Menu({ files, hasFile, setColorMode, colorMode, handleLoadFile }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
 
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
    </div>
  )
}