import { useEffect } from "react";


/*
FileDropWindow logic:
- Handles drag-and-drop of files onto the browser window.
- Only accepts .txt files and reads their content.

Variables:
- handleDropFile: Function passed from parent (App) to process the dropped file.
  -- Receives two arguments: filename and fileContent as a string.

Notes:
- Listens for dragover events to allow dropping.
- On drop:
  -- Checks if the dropped file is a .txt.
  -- Reads the file content using FileReader.
  -- Calls handleDropFile with the filename (file.name) and fileContent (reader.result).
  -- Alerts the user if not .txt file is dropped.
- Cleans up event listeners when component unmounts.
*/
export default function FileDropWindow({ handleDropFile }) {
  useEffect(() => {
    const handleDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (event) => {
      event.preventDefault();

      const file = event.dataTransfer.files[0];
      if (file && file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = () => {
          handleDropFile(file.name, reader.result);
        };
        reader.readAsText(file);
      } else {
        alert("Please drop a .txt file.");
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    }
  }, [handleDropFile])

  return null;
}