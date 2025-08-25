import { DemographicState } from '../types/GameTypes.js';

export const INITIAL_DEMOGRAPHICS: Record<string, DemographicState> = {
  youth: {
    id: 'youth',
    name: 'Youth (18-30)',
    happiness: 65,
    supportLevel: 55,
    populationPercentage: 25,
    concerns: ['employment', 'housing costs', 'student debt', 'climate change'],
    persona: `You represent young adults aged 18-30 in this town. You are:
- Tech-savvy and environmentally conscious
- Concerned about employment opportunities and career prospects
- Struggling with housing affordability and student debt
- Supportive of progressive social policies and climate action
- Interested in education, innovation, and digital infrastructure
- Generally optimistic but frustrated with economic barriers
- Value diversity, inclusion, and social justice
- Prefer policies that invest in the future rather than maintain status quo`,
  },
  
  business: {
    id: 'business',
    name: 'Business Owners',
    happiness: 70,
    supportLevel: 60,
    populationPercentage: 15,
    concerns: ['taxes', 'regulations', 'economic growth', 'infrastructure'],
    persona: `You represent local business owners and entrepreneurs. You are:
- Focused on economic growth and business-friendly policies
- Concerned about tax burden and regulatory compliance costs
- Support infrastructure improvements that benefit commerce
- Interested in policies that attract customers and workers
- Pragmatic about spending - support investments that boost economy
- Worried about competition from larger cities and online businesses
- Value stability and predictability in local government
- Support education and skills training that creates qualified workforce
- Generally conservative on fiscal issues but flexible on social issues`,
  },
};

export const DEMOGRAPHIC_PRIORITIES = {
  youth: {
    primary: ['employment', 'housing', 'education', 'environment'],
    secondary: ['technology', 'social_programs', 'transportation'],
    negative: ['excessive_spending', 'conservative_social_policies'],
  },
  business: {
    primary: ['economic_growth', 'infrastructure', 'tax_policy'],
    secondary: ['education', 'public_safety', 'zoning'],
    negative: ['high_taxes', 'excessive_regulation', 'anti_business_policies'],
  },
};

/**
 * Get initial demographic state for a new game
 */
export function getInitialDemographics(): Record<string, DemographicState> {
  return structuredClone(INITIAL_DEMOGRAPHICS);
}

/**
 * Get demographic by ID
 */
export function getDemographic(id: string): DemographicState | undefined {
  return INITIAL_DEMOGRAPHICS[id] ? structuredClone(INITIAL_DEMOGRAPHICS[id]) : undefined;
}

/**
 * Get all demographic IDs
 */
export function getDemographicIds(): string[] {
  return Object.keys(INITIAL_DEMOGRAPHICS);
}
