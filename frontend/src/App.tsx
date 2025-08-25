import React from 'react';
import { useGameStore } from './stores/gameStore';
import GameSetup from './components/game/GameSetup';
import GameInterface from './components/game/GameInterface';

function App() {
  const { playerName, saveName } = useGameStore();

  // Show setup screen if no player info
  if (!playerName || !saveName) {
    return <GameSetup />;
  }

  // Show main game interface
  return <GameInterface />;
}

export default App;
