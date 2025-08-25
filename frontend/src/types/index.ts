// Game State Types
export interface GameState {
  turnNumber: number;
  budget: number;
  approvalRating: number;
  economicHealth: number;
  demographics: Record<string, DemographicState>;
  activeEvents: GameEvent[];
  policyHistory: Policy[];
}

export interface DemographicState {
  id: string;
  name: string;
  happiness: number;
  supportLevel: number;
  populationPercentage: number;
  concerns: string[];
  lastPolicyReaction?: string;
  persona: string;
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  proposedAt: Date;
  enactedAt?: Date;
  status: 'proposed' | 'enacted' | 'rejected';
  effects: Record<string, number>;
}

export interface Email {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  type: 'issue' | 'result' | 'event' | 'notification';
  requiresResponse: boolean;
  read: boolean;
  archived: boolean;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'economic' | 'social' | 'environmental' | 'political';
  probability: number;
  triggerConditions: Record<string, any>;
  effects: Record<string, number>;
  duration?: number;
  startTurn?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DemographicResponse {
  happiness_change: number;
  economic_impact: number;
  support_likelihood: number;
  explanation: string;
}

// UI State Types
export interface GameStore {
  // Game state
  currentGame: GameState | null;
  playerName: string;
  saveName: string;
  emails: Email[];
  selectedEmail: Email | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  isComposing: boolean;
  
  // Actions
  setPlayerInfo: (playerName: string, saveName: string) => void;
  createNewGame: () => Promise<void>;
  loadGame: () => Promise<void>;
  selectEmail: (email: Email | null) => void;
  markEmailAsRead: (emailId: string) => void;
  setComposing: (composing: boolean) => void;
  submitPolicy: (title: string, description: string) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}
