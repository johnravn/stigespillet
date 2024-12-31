import React, { useState } from "react";
import "./App.css";
import { HStack, VStack } from "@chakra-ui/react";

interface Tile {
  position: number;
  snake?: number; // Position to which the snake moves
  ladder?: number; // Position to which the ladder moves
}

interface Player {
  team: number;
  position: number;
  name: string;
  image: string; // URL of the player's token image
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    { team: 1, position: 0, name: "Team Bjørg", image: "assets/token1.png" },
    { team: 2, position: 0, name: "Team Olav", image: "assets/token2.png" },
    {
      team: 3,
      position: 0,
      name: "Team Anne Mari",
      image: "assets/token3.png",
    },
    { team: 4, position: 0, name: "Team Vidar", image: "assets/token4.png" },
    { team: 5, position: 0, name: "Team Bjarte", image: "/assets/token5.png" },
    { team: 6, position: 0, name: "Team Martin", image: "./assets/token6.png" },
    { team: 7, position: 0, name: "Team Engebret", image: "assets/token7.png" },
    { team: 8, position: 0, name: "Team Filip", image: "assets/token8.png" },
  ]);
  const [moves, setMoves] = useState<number[]>(Array(8).fill(0));

  const board: Tile[] = Array.from({ length: 64 }, (_, i) => ({ position: i }));

  // Define snakes and ladders
  board[14].ladder = 29;
  board[47].ladder = 58;
  board[7].ladder = 38;
  board[10].ladder = 43;
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

    // Reset moves to 0 after updating players
    setMoves(Array(players.length).fill(0));
  };

  const renderBoard = () => {
    return (
      <div className="board">
        {Array.from({ length: 8 }, (_, row) => {
          // Reverse the row index to start from the bottom
          const reversedRow = 7 - row;

          return (
            <div className="row" key={row}>
              {Array.from({ length: 8 }, (_, col) => {
                // Calculate position based on the reversed row and alternate directions
                const isReversed = reversedRow % 2 === 1; // Odd rows are reversed
                const position = reversedRow * 8 + (isReversed ? 7 - col : col);
                const tile = board[position];
                const playerHere = players.filter(
                  (p) => p.position === position
                );

                return (
                  <div className="tile" key={col}>
                    <div className="position">{position + 1}</div>
                    {tile.snake && (
                      <div className="snake">{tile.snake + 1}</div>
                    )}
                    {tile.ladder && (
                      <div className="ladder">{tile.ladder + 1}</div>
                    )}
                    {playerHere.length > 0 && (
                      <div className="players">
                        {playerHere.map((p, index) => (
                          <div
                            key={p.team}
                            className="player"
                            style={{
                              position: "absolute",
                              transform: `translate(${index * 18}px, ${0}px)`, // Offset each token
                              zIndex: index, // Ensure tokens stack in the correct order
                            }}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="player-token"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <VStack h={"100vh"}>
      <HStack h={"100%"} w={"100vw"} align={"center"} justify={"space-around"}>
        <VStack>
          <div className="edit-container">
            {players.map((player, index) => (
              <div key={index} className="player-container">
                <img
                  src={player.image}
                  alt={player.name}
                  className="player-token-line"
                />
                <label className="player-line">
                  {player.name}:
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
          <button onClick={movePlayers}>KJØR</button>
        </VStack>
        <VStack w={"70vw"}>{renderBoard()}</VStack>
      </HStack>
    </VStack>
  );
};

export default App;
