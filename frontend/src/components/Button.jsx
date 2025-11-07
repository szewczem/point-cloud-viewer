import "./Button.css";


export default function Button({ text, onClick, children }) {
  return (
    <button onClick={onClick}>{text}{children}</button>
  )  
}