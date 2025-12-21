import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DungeonView from "./components/DungeonView";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Dungeon Lab</h1>
      <DungeonView />
    </div>
  )
}

export default App
