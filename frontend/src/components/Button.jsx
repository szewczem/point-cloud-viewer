import "./Button.css";


export default function Button({ text, onClick, children, className = "", disabled = false }) {
  return (
    <button className={`button ${className}`} onClick={onClick} disabled={disabled}>{text}{children}</button>
  )  
}