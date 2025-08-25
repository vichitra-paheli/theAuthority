# Vertical Slice Development Plan
## Political Simulation Game

### Overview
This document outlines a focused vertical slice development approach for the political simulation game. A vertical slice represents a narrow but complete implementation of core gameplay mechanics, providing a playable prototype that demonstrates the full game loop with minimal content.

---

## Vertical Slice Scope

### Core Features to Implement
1. **Single Turn Gameplay Loop**
   - One complete turn cycle from email reading to policy implementation
   - Immediate feedback and state changes
   - Basic turn advancement

2. **Minimal Viable Demographics (2 instead of 4)**
   - **Youth Demographic**: Tech-savvy, employment-focused
   - **Business Owners**: Economy and tax-focused
   - Simplified AI personas with consistent JSON responses

3. **Essential Simulation Variables**
   - Budget (income/expenses)
   - Overall Approval Rating
   - Economic Health
   - Youth Happiness
   - Business Satisfaction

4. **Basic Email Interface**
   - Simple inbox with 3-5 pre-written emails
   - Policy composition form
   - Turn results display

5. **Minimal AI Integration**
   - Local LLM setup with basic prompts
   - Two demographic agents
   - Simple response parsing

---

## Development Phases

### Phase 1: Foundation (Week 1)
**Goal**: Set up development environment and basic project structure

#### Day 1-2: Project Setup
- [ ] Initialize Node.js project with package.json
- [ ] Set up React frontend with Vite
- [ ] Configure ESLint, Prettier, and TypeScript
- [ ] Create basic folder structure
- [ ] Set up Git repository with initial commit

#### Day 3-4: Database & Backend Setup
- [ ] Install and configure PostgreSQL
- [ ] Create basic Express.js server
- [ ] Implement database schema for game state
- [ ] Set up basic REST API endpoints
- [ ] Configure environment variables

#### Day 5-7: LLM Integration Research
- [ ] Install and test Ollama locally
- [ ] Download and test ChatGPT-OSS 20B model
- [ ] Create basic LLM service wrapper
- [ ] Test prompt engineering for demographics
- [ ] Implement JSON response parsing

**Deliverable**: Working development environment with LLM integration

### Phase 2: Core Systems (Week 2)
**Goal**: Implement fundamental game mechanics

#### Day 8-10: Game State Management
- [ ] Create GameState class with essential variables
- [ ] Implement turn management system
- [ ] Build basic simulation engine
- [ ] Create demographic state tracking
- [ ] Add simple causal relationships

#### Day 11-12: AI Demographic System
- [ ] Implement DemographicAgent class
- [ ] Create Youth demographic persona
- [ ] Create Business demographic persona
- [ ] Build prompt templates with context injection
- [ ] Test response consistency and parsing

#### Day 13-14: Basic Email System
- [ ] Create email data structure
- [ ] Implement email templates
- [ ] Build email generation system
- [ ] Create policy parsing logic
- [ ] Test end-to-end email flow

**Deliverable**: Working backend with AI demographics and email system

### Phase 3: User Interface (Week 3)
**Goal**: Create playable frontend interface

#### Day 15-17: Email Interface
- [ ] Design and implement inbox component
- [ ] Create email reading pane
- [ ] Build policy composition form
- [ ] Add basic styling (email client look)
- [ ] Implement responsive design basics

#### Day 18-19: Game Dashboard
- [ ] Create approval rating display
- [ ] Build budget overview component
- [ ] Add demographic happiness indicators
- [ ] Implement basic charts/graphs
- [ ] Create turn advancement controls

#### Day 20-21: Integration & Testing
- [ ] Connect frontend to backend APIs
- [ ] Implement state management (Redux/Zustand)
- [ ] Add loading states and error handling
- [ ] Test complete gameplay loop
- [ ] Fix integration issues

**Deliverable**: Playable vertical slice with basic UI

### Phase 4: Polish & Validation (Week 4)
**Goal**: Refine the vertical slice for demonstration

#### Day 22-24: Content Creation
- [ ] Write 5 engaging starter emails
- [ ] Create 3 sample policy scenarios
- [ ] Design realistic email templates
- [ ] Add appropriate sender personas
- [ ] Test narrative flow and engagement

#### Day 25-26: Balance & Tuning
- [ ] Tune AI response consistency
- [ ] Balance simulation variable relationships
- [ ] Adjust demographic sensitivity
- [ ] Test edge cases and extreme inputs
- [ ] Optimize response times

#### Day 27-28: Final Polish
- [ ] Add sound effects and notifications
- [ ] Improve visual feedback
- [ ] Implement basic animations
- [ ] Add keyboard shortcuts
- [ ] Create onboarding tutorial

**Deliverable**: Polished vertical slice ready for testing

---

## Technical Implementation Details

### Minimal Tech Stack
```json
{
  "frontend": {
    "framework": "React 18 + TypeScript",
    "build": "Vite",
    "styling": "Tailwind CSS",
    "state": "Zustand",
    "routing": "React Router"
  },
  "backend": {
    "runtime": "Node.js 18+",
    "framework": "Express.js + TypeScript",
    "database": "SQLite (for simplicity)",
    "ai": "Ollama + ChatGPT-OSS 7B",
    "validation": "Zod"
  },
  "development": {
    "containerization": "Docker Compose",
    "testing": "Vitest + React Testing Library",
    "linting": "ESLint + Prettier"
  }
}
```

### Core Data Structures
```typescript
interface GameState {
  turnNumber: number;
  budget: number;
  approvalRating: number;
  economicHealth: number;
  demographics: {
    youth: DemographicState;
    business: DemographicState;
  };
  activeEvents: Event[];
  policyHistory: Policy[];
}

interface DemographicState {
  happiness: number; // 0-100
  concerns: string[];
  lastPolicyReaction: string;
  supportLevel: number; // 0-100
}

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: Date;
  type: 'issue' | 'result' | 'event';
  requiresResponse: boolean;
}
```

### Simplified AI Prompts
```typescript
const YOUTH_PERSONA = `
You represent young adults (18-30) in a local town government simulation.
Current happiness: {happiness}/100
Recent concerns: {concerns}

Evaluate this policy proposal: "{policy}"

Respond with JSON only:
{
  "happiness_change": number (-20 to +20),
  "support_level": number (0 to 100),
  "reaction": "brief explanation (max 50 words)"
}
`;

const BUSINESS_PERSONA = `
You represent local business owners in a town government simulation.
Current satisfaction: {satisfaction}/100
Economic concerns: {concerns}

Evaluate this policy proposal: "{policy}"

Respond with JSON only:
{
  "satisfaction_change": number (-20 to +20),
  "economic_impact": number (-10 to +10),
  "reaction": "brief explanation (max 50 words)"
}
`;
```

---

## Success Metrics

### Functional Requirements
- [ ] Complete turn cycle in under 60 seconds
- [ ] AI responses generate within 10 seconds
- [ ] All UI interactions work smoothly
- [ ] Game state persists between sessions
- [ ] No critical bugs or crashes

### Quality Requirements
- [ ] AI responses are contextually appropriate
- [ ] Simulation produces logical cause-effect relationships
- [ ] Interface feels like a real email client
- [ ] Performance is acceptable on target hardware
- [ ] Code is well-structured and documented

### User Experience Requirements
- [ ] New players understand the game within 5 minutes
- [ ] Policy creation feels intuitive and creative
- [ ] Feedback clearly shows consequences of actions
- [ ] Interface is visually appealing and professional
- [ ] Game loop is engaging for at least 10 turns

---

## Risk Mitigation

### Technical Risks
1. **LLM Performance Issues**
   - Mitigation: Test with smaller models (7B) as fallback
   - Backup: Pre-written response templates

2. **AI Response Inconsistency**
   - Mitigation: Extensive prompt engineering and testing
   - Backup: Response validation and sanitization

3. **Integration Complexity**
   - Mitigation: Build incrementally with frequent testing
   - Backup: Simplify features if needed

### Scope Risks
1. **Feature Creep**
   - Mitigation: Strict adherence to vertical slice scope
   - Solution: Document additional features for future phases

2. **Timeline Overrun**
   - Mitigation: Daily progress tracking and adjustment
   - Solution: Cut non-essential features to meet deadline

---

## Post-Vertical Slice Roadmap

### Immediate Extensions (Phase 5)
- Add remaining 2 demographics (Seniors, Environmentalists)
- Implement event system with random occurrences
- Expand email content and variety
- Add more simulation variables and relationships

### Medium-term Goals (Phase 6-8)
- Save/load functionality
- Basic modding support
- Performance optimization
- Extended content library

### Long-term Vision (Phase 9+)
- Full modding ecosystem
- Multiplayer considerations
- Advanced AI features
- Commercial release preparation

---

## Conclusion

This vertical slice approach ensures rapid development of a playable prototype that demonstrates the core value proposition of the political simulation game. By focusing on essential features and limiting scope, we can validate the concept, test technical feasibility, and gather feedback before committing to full development.

The 4-week timeline provides a realistic path to a demonstrable product while maintaining flexibility for iteration and improvement based on testing results.

---

*Document Version: 1.0*  
*Created: [Current Date]*  
*Estimated Completion: 4 weeks*
