import { Ollama } from 'ollama';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

// Zod schema for demographic response validation
export const DemographicResponseSchema = z.object({
  happiness_change: z.number().min(-50).max(50),
  economic_impact: z.number().min(-25).max(25),
  support_likelihood: z.number().min(0).max(100),
  explanation: z.string().max(200),
});

export type DemographicResponse = z.infer<typeof DemographicResponseSchema>;

export interface LLMConfig {
  model: string;
  baseUrl: string;
  timeout: number;
  maxTokens: number;
  temperature: number;
}

export class LLMService {
  private ollama: Ollama;
  private config: LLMConfig;

  constructor(config?: Partial<LLMConfig>) {
    this.config = {
      model: config?.model || process.env.LLM_MODEL || 'llama3.2:3b',
      baseUrl: config?.baseUrl || process.env.LLM_API_URL || 'http://localhost:11434',
      timeout: config?.timeout || parseInt(process.env.LLM_TIMEOUT || '30000'),
      maxTokens: config?.maxTokens || parseInt(process.env.LLM_MAX_TOKENS || '500'),
      temperature: config?.temperature || parseFloat(process.env.LLM_TEMPERATURE || '0.3'),
    };

    this.ollama = new Ollama({
      host: this.config.baseUrl,
    });

    logger.info('LLM Service initialized', {
      model: this.config.model,
      baseUrl: this.config.baseUrl,
    });
  }

  /**
   * Test if the LLM service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.ollama.chat({
        model: this.config.model,
        messages: [{ role: 'user', content: 'Hello' }],
        options: {
          num_predict: 10,
          temperature: 0.1,
        },
      });
      
      logger.info('LLM health check passed');
      return true;
    } catch (error) {
      logger.error('LLM health check failed', { error: error instanceof Error ? error.message : error });
      return false;
    }
  }

  /**
   * Generate a demographic response to a policy proposal
   */
  async generateDemographicResponse(
    demographicName: string,
    demographicPersona: string,
    currentState: Record<string, any>,
    policyProposal: string
  ): Promise<DemographicResponse> {
    const prompt = this.buildDemographicPrompt(
      demographicName,
      demographicPersona,
      currentState,
      policyProposal
    );

    try {
      logger.info('Generating demographic response', {
        demographic: demographicName,
        policyLength: policyProposal.length,
      });

      const response = await this.ollama.chat({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens,
        },
      });

      const content = response.message.content;
      logger.debug('Raw LLM response', { content });

      // Parse and validate the JSON response
      const parsedResponse = this.parseJsonResponse(content);
      const validatedResponse = DemographicResponseSchema.parse(parsedResponse);

      logger.info('Demographic response generated successfully', {
        demographic: demographicName,
        happinessChange: validatedResponse.happiness_change,
        supportLikelihood: validatedResponse.support_likelihood,
      });

      return validatedResponse;
    } catch (error) {
      logger.error('Failed to generate demographic response', {
        demographic: demographicName,
        error: error instanceof Error ? error.message : error,
      });

      // Return a neutral fallback response
      return this.getFallbackResponse();
    }
  }

  /**
   * Build the prompt for demographic evaluation
   */
  private buildDemographicPrompt(
    demographicName: string,
    persona: string,
    currentState: Record<string, any>,
    policyProposal: string
  ): string {
    return `You are representing the ${demographicName} demographic in a local town political simulation.

PERSONA: ${persona}

CURRENT STATE:
- Happiness: ${currentState.happiness || 50}/100
- Recent concerns: ${currentState.concerns?.join(', ') || 'None'}
- Support level: ${currentState.supportLevel || 50}/100

POLICY PROPOSAL: "${policyProposal}"

Evaluate this policy proposal and respond with ONLY a JSON object in this exact format:
{
  "happiness_change": <number between -50 and 50>,
  "economic_impact": <number between -25 and 25>,
  "support_likelihood": <number between 0 and 100>,
  "explanation": "<brief explanation in under 200 characters>"
}

Consider how this policy would realistically affect your demographic. Be consistent with your persona and current state.`;
  }

  /**
   * Parse JSON response from LLM, handling common formatting issues
   */
  private parseJsonResponse(content: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, try parsing the entire content
      return JSON.parse(content.trim());
    } catch (error) {
      logger.warn('Failed to parse JSON response', { content, error });
      throw new Error(`Invalid JSON response: ${content}`);
    }
  }

  /**
   * Get a neutral fallback response when LLM fails
   */
  private getFallbackResponse(): DemographicResponse {
    return {
      happiness_change: 0,
      economic_impact: 0,
      support_likelihood: 50,
      explanation: 'Unable to evaluate policy at this time.',
    };
  }

  /**
   * Get available models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.ollama.list();
      return models.models.map(model => model.name);
    } catch (error) {
      logger.error('Failed to get available models', { error });
      return [];
    }
  }
}

// Export singleton instance
export const llmService = new LLMService();
