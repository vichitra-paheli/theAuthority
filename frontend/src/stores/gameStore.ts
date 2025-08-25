import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { gameApi } from '../services/apiClient';
import type { GameStore, GameState, Email } from '../types';

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentGame: null,
      playerName: '',
      saveName: '',
      emails: [],
      selectedEmail: null,
      isLoading: false,
      error: null,
      isComposing: false,

      // Actions
      setPlayerInfo: (playerName: string, saveName: string) => {
        set({ playerName, saveName });
      },

      createNewGame: async () => {
        const { playerName, saveName } = get();
        if (!playerName || !saveName) {
          set({ error: 'Player name and save name are required' });
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await gameApi.createGame(playerName, saveName);
          
          if (response.success) {
            set({ 
              currentGame: response.gameState,
              emails: [], // Will be populated when we implement email fetching
              isLoading: false 
            });
          } else {
            set({ 
              error: response.error || 'Failed to create game',
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create game',
            isLoading: false 
          });
        }
      },

      loadGame: async () => {
        const { playerName, saveName } = get();
        if (!playerName || !saveName) {
          set({ error: 'Player name and save name are required' });
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await gameApi.loadGame(playerName, saveName);
          
          if (response.success) {
            set({ 
              currentGame: response.gameState,
              emails: [], // Will be populated when we implement email fetching
              isLoading: false 
            });
          } else {
            set({ 
              error: response.error || 'Failed to load game',
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load game',
            isLoading: false 
          });
        }
      },

      selectEmail: (email: Email | null) => {
        set({ selectedEmail: email });
        
        // Mark email as read when selected
        if (email && !email.read) {
          get().markEmailAsRead(email.id);
        }
      },

      markEmailAsRead: (emailId: string) => {
        set((state) => ({
          emails: state.emails.map((email) =>
            email.id === emailId ? { ...email, read: true } : email
          ),
        }));
      },

      setComposing: (composing: boolean) => {
        set({ isComposing: composing });
      },

      submitPolicy: async (title: string, description: string) => {
        const { playerName, saveName } = get();
        if (!playerName || !saveName) {
          set({ error: 'No active game session' });
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await gameApi.submitPolicy(playerName, saveName, title, description);
          
          if (response.success) {
            // Update game state and add new emails
            set({ 
              currentGame: response.gameState,
              emails: [...get().emails, ...response.newEmails],
              isComposing: false,
              isLoading: false 
            });
          } else {
            set({ 
              error: response.error || 'Failed to submit policy',
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to submit policy',
            isLoading: false 
          });
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'game-store',
    }
  )
);
