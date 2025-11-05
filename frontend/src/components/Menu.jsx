import "./Menu.css"

export default function Menu({ setColorMode }) {
  return(
    <div className="menu">
      <button className="button" onClick={() => setColorMode("default")}>Default</button>
      <button className="button" onClick={() => setColorMode("colored")}>Colored</button>
    </div>
  )
}