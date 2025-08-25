import { z } from 'zod';

// Game State Schemas
export const GameStateSchema = z.object({
  turnNumber: z.number().min(1),
  budget: z.number(),
  approvalRating: z.number().min(0).max(100),
  economicHealth: z.number().min(0).max(100),
  demographics: z.record(z.string(), z.any()),
  activeEvents: z.array(z.any()),
  policyHistory: z.array(z.any()),
});

export type GameState = z.infer<typeof GameStateSchema>;

// Demographic State Schema
export const DemographicStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  happiness: z.number().min(0).max(100),
  supportLevel: z.number().min(0).max(100),
  populationPercentage: z.number().min(0).max(100),
  concerns: z.array(z.string()),
  lastPolicyReaction: z.string().optional(),
  persona: z.string(),
});

export type DemographicState = z.infer<typeof DemographicStateSchema>;

// Policy Schema
export const PolicySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  proposedAt: z.date(),
  enactedAt: z.date().optional(),
  status: z.enum(['proposed', 'enacted', 'rejected']),
  effects: z.record(z.string(), z.number()),
});

export type Policy = z.infer<typeof PolicySchema>;

// Email Schema
export const EmailSchema = z.object({
  id: z.string(),
  from: z.string(),
  fromName: z.string(),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  timestamp: z.date(),
  type: z.enum(['issue', 'result', 'event', 'notification']),
  requiresResponse: z.boolean(),
  read: z.boolean().default(false),
  archived: z.boolean().default(false),
});

export type Email = z.infer<typeof EmailSchema>;

// Event Schema
export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['economic', 'social', 'environmental', 'political']),
  probability: z.number().min(0).max(1),
  triggerConditions: z.record(z.string(), z.any()),
  effects: z.record(z.string(), z.number()),
  duration: z.number().optional(), // turns
  startTurn: z.number().optional(),
});

export type Event = z.infer<typeof EventSchema>;

// API Request/Response Schemas
export const PolicyProposalRequestSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
});

export type PolicyProposalRequest = z.infer<typeof PolicyProposalRequestSchema>;

export const TurnAdvanceResponseSchema = z.object({
  success: z.boolean(),
  newTurnNumber: z.number(),
  demographicResponses: z.record(z.string(), z.any()),
  gameState: GameStateSchema,
  newEmails: z.array(EmailSchema),
});

export type TurnAdvanceResponse = z.infer<typeof TurnAdvanceResponseSchema>;
