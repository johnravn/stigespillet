// Import necessary React and TypeScript modules
import React, { useState } from "react";
import "./App.css";

interface Tile {
  position: number;
  snake?: number; // Position to which the snake moves
  ladder?: number; // Position to which the ladder moves
}

interface Player {
  team: number;
  position: number;
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 8 }, (_, i) => ({ team: i + 1, position: 0 }))
  );
  const [moves, setMoves] = useState<number[]>(Array(8).fill(0));

  const board: Tile[] = Array.from({ length: 64 }, (_, i) => ({ position: i }));

  // Define snakes and ladders
  board[14].ladder = 29;
  board[47].ladder = 58;
  board[51].snake = 32;
  board[62].snake = 19;

  const movePlayers = () => {
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player, index) => {
        let newPosition = player.position + moves[index];

        // Handle overshooting
        if (newPosition >= board.length) {
          newPosition = board.length - 1;
        }

        // Check for snake or ladder
        const snake = board[newPosition].snake;
        const ladder = board[newPosition].ladder;
        if (snake !== undefined) {
          newPosition = snake;
        } else if (ladder !== undefined) {
          newPosition = ladder;
        }

        return { ...player, position: newPosition };
      });
    });
  };

  const renderBoard = () => {
    return (
      <div className="board">
        {Array.from({ length: 8 }, (_, row) => (
          <div className="row" key={row}>
            {Array.from({ length: 8 }, (_, col) => {
              const position = row * 8 + col;
              const tile = board[position];
              const playerHere = players.filter((p) => p.position === position);

              return (
                <div className="tile" key={col}>
                  <div className="position">{position + 1}</div>
                  {tile.snake && (
                    <div className="snake">🐍 {tile.snake + 1}</div>
                  )}
                  {tile.ladder && (
                    <div className="ladder">🪜 {tile.ladder + 1}</div>
                  )}
                  {playerHere.length > 0 && (
                    <div className="players">
                      {playerHere.map((p) => (
                        <span key={p.team} className="player">
                          Team {p.team}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Snakes and Ladders</h1>
      <div>
        {players.map((player, index) => (
          <div key={index}>
            <label>
              Team {player.team} Move:
              <input
                type="number"
                value={moves[index]}
                onChange={(e) => {
                  const newMoves = [...moves];
                  newMoves[index] = parseInt(e.target.value) || 0;
                  setMoves(newMoves);
                }}
              />
            </label>
          </div>
        ))}
      </div>
      <button onClick={movePlayers}>Run</button>
      {renderBoard()}
    </div>
  );
};

export default App;
