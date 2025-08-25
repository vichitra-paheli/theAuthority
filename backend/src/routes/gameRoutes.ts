import express from 'express';
import { z } from 'zod';
import { llmService } from '../services/LLMService.js';
import { databaseService } from '../services/DatabaseService.js';
import { getInitialDemographics } from '../data/demographics.js';
import { GameState } from '../types/GameTypes.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Validation schemas
const CreateGameSchema = z.object({
  playerName: z.string().min(1).max(50),
  saveName: z.string().min(1).max(50),
});

const PolicyProposalSchema = z.object({
  playerName: z.string().min(1).max(50),
  saveName: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
});

/**
 * Create a new game
 */
router.post('/create', async (req, res) => {
  try {
    const { playerName, saveName } = CreateGameSchema.parse(req.body);
    
    // Create initial game state
    const initialGameState: GameState = {
      turnNumber: 1,
      budget: 1000000, // $1M starting budget
      approvalRating: 60,
      economicHealth: 70,
      demographics: getInitialDemographics(),
      activeEvents: [],
      policyHistory: [],
    };
    
    // Save to database
    const gameSaveId = databaseService.createGameSave(playerName, saveName, initialGameState);
    
    // Add welcome email
    const welcomeEmail = {
      from: 'mayor@townhall.gov',
      fromName: 'Mayor Johnson',
      to: 'player@townhall.gov',
      subject: 'Welcome to Office!',
      body: `Congratulations on your election! As the new town administrator, you'll be making important decisions that affect our community of ${Object.values(initialGameState.demographics).reduce((sum, demo) => sum + demo.populationPercentage, 0)}% of engaged citizens.

Your starting situation:
- Budget: $${initialGameState.budget.toLocaleString()}
- Overall Approval: ${initialGameState.approvalRating}%
- Economic Health: ${initialGameState.economicHealth}%

The town is counting on you to make wise decisions. You'll receive emails about various issues that need your attention. Good luck!

- Mayor Johnson`,
      timestamp: new Date(),
      type: 'notification' as const,
      requiresResponse: false,
      read: false,
      archived: false,
    };
    
    databaseService.addEmail(gameSaveId, welcomeEmail);
    
    logger.info('New game created', { playerName, saveName, gameSaveId });
    
    res.json({
      success: true,
      message: 'Game created successfully',
      gameSaveId,
      gameState: initialGameState,
    });
    
  } catch (error) {
    logger.error('Failed to create game', { error });
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
});

/**
 * Load an existing game
 */
router.get('/load/:playerName/:saveName', async (req, res) => {
  try {
    const { playerName, saveName } = req.params;
    
    const gameState = databaseService.loadGameSave(playerName, saveName);
    
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Game save not found',
      });
    }
    
    res.json({
      success: true,
      gameState,
    });
    
  } catch (error) {
    logger.error('Failed to load game', { error, params: req.params });
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * Get player's save files
 */
router.get('/saves/:playerName', async (req, res) => {
  try {
    const { playerName } = req.params;
    
    const saves = databaseService.getPlayerSaves(playerName);
    
    res.json({
      success: true,
      saves,
    });
    
  } catch (error) {
    logger.error('Failed to get saves', { error, playerName: req.params.playerName });
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * Test LLM demographic response
 */
router.post('/test-llm', async (req, res) => {
  try {
    const { demographic, policy } = req.body;
    
    if (!demographic || !policy) {
      return res.status(400).json({
        success: false,
        error: 'demographic and policy are required',
      });
    }
    
    const demographics = getInitialDemographics();
    const demo = demographics[demographic];
    
    if (!demo) {
      return res.status(400).json({
        success: false,
        error: 'Invalid demographic',
        availableDemographics: Object.keys(demographics),
      });
    }
    
    const response = await llmService.generateDemographicResponse(
      demo.name,
      demo.persona,
      { 
        happiness: demo.happiness,
        concerns: demo.concerns,
        supportLevel: demo.supportLevel,
      },
      policy
    );
    
    res.json({
      success: true,
      demographic: demo.name,
      policy,
      response,
    });
    
  } catch (error) {
    logger.error('LLM test failed', { error });
    res.status(500).json({
      success: false,
      error: 'LLM test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Health check for game services
 */
router.get('/health', async (req, res) => {
  try {
    const dbHealth = databaseService.healthCheck();
    const llmHealth = await llmService.healthCheck();
    
    const overallHealth = dbHealth.status === 'ok' && llmHealth;
    
    res.json({
      success: true,
      status: overallHealth ? 'healthy' : 'degraded',
      services: {
        database: dbHealth,
        llm: {
          status: llmHealth ? 'ok' : 'error',
          message: llmHealth ? 'LLM service available' : 'LLM service unavailable',
        },
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(500).json({
      success: false,
      error: 'Health check failed',
    });
  }
});

export default router;
