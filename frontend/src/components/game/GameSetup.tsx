import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';

const GameSetup: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [saveName, setSaveName] = useState('');
  const { setPlayerInfo } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && saveName.trim()) {
      setPlayerInfo(playerName.trim(), saveName.trim());
    }
  };

  const quickStart = () => {
    const defaultPlayerName = 'Mayor Smith';
    const defaultSaveName = `Game_${Date.now()}`;
    setPlayerName(defaultPlayerName);
    setSaveName(defaultSaveName);
    setPlayerInfo(defaultPlayerName, defaultSaveName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Political Simulation Game
          </h1>
          <p className="text-gray-600">
            Take on the role of a local town administrator and make decisions that affect your community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="form-input"
              placeholder="Enter your name (e.g., Mayor Smith)"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label htmlFor="saveName" className="block text-sm font-medium text-gray-700 mb-1">
              Game Name
            </label>
            <input
              type="text"
              id="saveName"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="form-input"
              placeholder="Name your game (e.g., Riverside Town)"
              maxLength={50}
              required
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full btn-primary"
              disabled={!playerName.trim() || !saveName.trim()}
            >
              🚀 Start New Game
            </button>
            
            <button
              type="button"
              onClick={quickStart}
              className="w-full btn-secondary"
            >
              ⚡ Quick Start (Demo)
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">What to Expect:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start space-x-2">
              <span>📧</span>
              <span>Receive emails about town issues and concerns</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🎯</span>
              <span>Make policy decisions that affect different demographics</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🤖</span>
              <span>Get realistic AI-powered responses from your constituents</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>📊</span>
              <span>Track your approval rating and budget over time</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
