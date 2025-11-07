import { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa6";
import Button from "./Button";
import "./Menu.css";

export default function Menu({ files, selectedFile, setColorMode, handleLoadFile }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
      <>
        {isOpen && (
        <ul className="file-list">
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
      </>      
      <Button onClick={() => setColorMode("default")} text={"Default"}></Button>
      <Button onClick={() => setColorMode("colored")} text={"Color"}></Button>
    </div>
  )
}