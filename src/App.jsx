import { useState } from "react";
import "./App.css";

function App() {
  const [grid, setGrid] = useState([]);
  const [bombCount, setBombCount] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [multiplier, setMultiplier] = useState(1);
  const [started, setStarted] = useState(false);

  // 🔹 Start or restart the game
  function generateGrid() {
    // ❗ Bug fix: prevent invalid mine count (0 or 25)
    if (bombCount < 1 || bombCount > 24) {
      setMessage("⚠️ Mines must be between 1 and 24!");
      return;
    }

    const newGrid = Array(25)
      .fill(null)
      .map(() => ({
        isBomb: false,
        revealed: false,
      }));

    // randomly place bombs
    let bombs = bombCount;
    while (bombs > 0) {
      const randomIndex = Math.floor(Math.random() * 25);
      if (!newGrid[randomIndex].isBomb) {
        newGrid[randomIndex].isBomb = true;
        bombs--;
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setMessage("");
    setMultiplier(1);
    setStarted(true);
  }

  // 🔹 Handle block click
  function handleClick(index) {
    if (gameOver || grid.length === 0) return;

    const newGrid = [...grid];
    if (newGrid[index].revealed) return; // prevent double-click

    if (newGrid[index].isBomb) {
      newGrid[index].revealed = true;
      setGrid(newGrid);
      setMessage("💣 You hit a mine! Loss!");
      setGameOver(true);
      setStarted(false);
      setMultiplier(0);
    } else {
      newGrid[index].revealed = true;
      setGrid(newGrid);

      const safeTiles = newGrid.filter((c) => c.revealed && !c.isBomb).length;

      // Increase multiplier slightly with each safe reveal
      setMultiplier((prev) => (parseFloat(prev) + 0.3).toFixed(2));

      // Check if all safe tiles cleared
      if (safeTiles === 25 - bombCount) {
        setMessage("🎉 Big Win! You cleared all safe tiles!");
        setGameOver(true);
        setStarted(false);
      } else if (safeTiles > 5) {
        setMessage("✨ Small Win! Keep going!");
      }
    }
  }

  // 🔹 Cashout before losing
  function cashout() {
    if (!started || gameOver) return;
    if (multiplier > 2) {
      setMessage("💎 Big Win! You cashed out safely!");
    } else {
      setMessage("💰 Small Win! You cashed out early!");
    }
    setGameOver(true);
    setStarted(false);
  }

  // 🔹 Reset game
  function resetGame() {
    setGrid([]);
    setMessage("");
    setGameOver(false);
    setStarted(false);
    setMultiplier(1);
  }

  return (
    <div className="container">
      <h1>💣 Mines Game</h1>
      <p>Enter number of mines (1–24) and click “Start Game”</p>

      <div className="controls">
        <input
          type="number"
          min="1"
          max="24"
          value={bombCount}
          onChange={(e) => setBombCount(Number(e.target.value))}
          className="mine-input"
        />
        <button onClick={generateGrid} className="start-btn">
          Start Game
        </button>
        <button onClick={cashout} disabled={!started} className="cashout-btn">
          💰 Cashout
        </button>
        <button onClick={resetGame} className="reset-btn">
          🔁 Reset
        </button>
      </div>

      <div className="grid">
        {grid.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell.revealed ? "revealed" : ""}`}
            onClick={() => handleClick(index)}
          >
            {cell.revealed ? (cell.isBomb ? "💣" : "💎") : "❓"}
          </div>
        ))}
      </div>

      <div className="info">
        <h2>{message}</h2>
        <h3>🔥 Multiplier: {multiplier}x</h3>
        <h3>💥 Mines: {bombCount}</h3>
      </div>
    </div>
  );
}

export default App;
