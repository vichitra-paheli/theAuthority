import React from 'react';
import { useGameStore } from '../../stores/gameStore';

const GameDashboard: React.FC = () => {
  const { currentGame } = useGameStore();

  if (!currentGame) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getApprovalColor = (rating: number) => {
    if (rating >= 80) return 'text-green-600 bg-green-100';
    if (rating >= 60) return 'text-blue-600 bg-blue-100';
    if (rating >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 60) return 'text-blue-600';
    if (health >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDemographicColor = (happiness: number) => {
    if (happiness >= 80) return 'bg-green-500';
    if (happiness >= 60) return 'bg-blue-500';
    if (happiness >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border-l border-gray-200 w-80 p-4 space-y-6">
      {/* Turn Info */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">Town Administration</h2>
        <p className="text-sm text-gray-600">Turn {currentGame.turnNumber}</p>
      </div>

      {/* Overall Approval */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Overall Approval</h3>
        <div className="flex items-center justify-between">
          <div className={`px-3 py-2 rounded-full text-lg font-bold ${getApprovalColor(currentGame.approvalRating)}`}>
            {currentGame.approvalRating}%
          </div>
          <div className="flex-1 ml-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  currentGame.approvalRating >= 80 ? 'bg-green-500' :
                  currentGame.approvalRating >= 60 ? 'bg-blue-500' :
                  currentGame.approvalRating >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${currentGame.approvalRating}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Municipal Budget</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Available Funds</span>
            <span className={`font-semibold ${currentGame.budget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(currentGame.budget)}
            </span>
          </div>
          {currentGame.budget < 0 && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              ⚠️ Budget deficit - consider revenue-generating policies
            </div>
          )}
        </div>
      </div>

      {/* Economic Health */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Economic Health</h3>
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold ${getHealthColor(currentGame.economicHealth)}`}>
            {currentGame.economicHealth}%
          </span>
          <div className="flex-1 ml-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  currentGame.economicHealth >= 80 ? 'bg-green-500' :
                  currentGame.economicHealth >= 60 ? 'bg-blue-500' :
                  currentGame.economicHealth >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${currentGame.economicHealth}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Demographic Happiness</h3>
        <div className="space-y-3">
          {Object.entries(currentGame.demographics).map(([key, demographic]: [string, any]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{demographic.name}</span>
                <span className="text-gray-600">{demographic.happiness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getDemographicColor(demographic.happiness)}`}
                  style={{ width: `${demographic.happiness}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{demographic.populationPercentage}% of population</span>
                <span>Support: {demographic.supportLevel}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Concerns */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Top Concerns</h3>
        <div className="space-y-2">
          {Object.values(currentGame.demographics).map((demographic: any) => 
            demographic.concerns.slice(0, 2).map((concern: string, index: number) => (
              <div key={`${demographic.id}-${index}`} className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-gray-600">{concern}</span>
                <span className="text-gray-400">({demographic.name})</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <button className="w-full btn-primary text-sm">
          📊 View Detailed Reports
        </button>
        <button className="w-full btn-secondary text-sm">
          ⚙️ Town Settings
        </button>
      </div>

      {/* Game Status */}
      <div className="text-center text-xs text-gray-500 border-t pt-4">
        <p>Game Status: Active</p>
        <p>Last Updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default GameDashboard;
