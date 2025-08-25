import React, { useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import EmailInbox from '../email/EmailInbox';
import EmailReader from '../email/EmailReader';
import PolicyComposer from '../email/PolicyComposer';
import GameDashboard from './GameDashboard';

const GameInterface: React.FC = () => {
  const { 
    currentGame, 
    isComposing, 
    isLoading, 
    error, 
    playerName, 
    saveName,
    createNewGame,
    clearError 
  } = useGameStore();

  // Initialize game if we have player info but no current game
  useEffect(() => {
    if (playerName && saveName && !currentGame && !isLoading) {
      createNewGame();
    }
  }, [playerName, saveName, currentGame, isLoading, createNewGame]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={clearError}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !currentGame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏛️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isLoading ? 'Setting up your administration...' : 'Loading game...'}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="animate-spin text-2xl">⏳</div>
            <span>Please wait</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              🏛️ Town Administration
            </h1>
            <div className="text-sm text-gray-600">
              {playerName} • {saveName} • Turn {currentGame.turnNumber}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Budget:</span>
              <span className={`font-semibold ${currentGame.budget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${currentGame.budget.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Approval:</span>
              <span className="font-semibold text-blue-600">{currentGame.approvalRating}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Email Interface */}
        <div className="flex-1 flex">
          {/* Inbox */}
          <div className="w-80">
            <EmailInbox />
          </div>
          
          {/* Email Reader */}
          <div className="flex-1">
            <EmailReader />
          </div>
        </div>

        {/* Game Dashboard */}
        <GameDashboard />
      </div>

      {/* Policy Composer Modal */}
      {isComposing && <PolicyComposer />}
    </div>
  );
};

export default GameInterface;
