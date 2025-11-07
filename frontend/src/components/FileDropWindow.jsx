import { useEffect } from "react";


export default function FileDropWindow({ handleDropFile}) {
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