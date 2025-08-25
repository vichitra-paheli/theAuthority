# Vertical Slice Development Plan
## Political Simulation Game

### Overview
This document outlines a focused vertical slice development approach for the political simulation game. A vertical slice represents a narrow but complete implementation of core gameplay mechanics, providing a playable prototype that demonstrates the full game loop with minimal content.

---

## Vertical Slice Scope

### Core Features to Implement
1. **Single Turn Gameplay Loop**
   - One complete turn cycle from email reading to structured policy decisions
   - Immediate feedback and state changes
   - Basic turn advancement

2. **Structured Policy Decision System**
   - 3-5 predefined policy issues per turn across different categories
   - Multiple choice options (2-4) for each issue
   - Custom policy text input as alternative option
   - Clear context and stakeholder information for each decision

3. **Minimal Viable Demographics (2 instead of 4)**
   - **Youth Demographic**: Tech-savvy, employment-focused
   - **Business Owners**: Economy and tax-focused
   - Simplified AI personas with consistent JSON responses

4. **Essential Simulation Variables**
   - Budget (income/expenses)
   - Overall Approval Rating
   - Economic Health
   - Youth Happiness
   - Business Satisfaction

5. **Enhanced Email Interface**
   - Email inbox with issue notifications and results
   - Policy decision panel with structured choices
   - Turn results display with demographic reactions

6. **Minimal AI Integration**
   - Local LLM setup with basic prompts
   - Two demographic agents evaluating both predefined and custom policies
   - Simple response parsing with fallback for predefined options

---

## Development Phases

### Phase 1: Foundation (Week 1)
**Goal**: Set up development environment and basic project structure

#### Day 1-2: Project Setup ✅ COMPLETED
- [x] Initialize Node.js project with package.json
- [x] Set up React frontend with Vite
- [x] Configure ESLint, Prettier, and TypeScript
- [x] Create basic folder structure
- [x] Set up Git repository with initial commit
- [x] Fix Tailwind CSS v4 configuration
- [x] Set up PM2 process management for development
- [x] Create comprehensive development scripts

#### Day 3-4: Database & Backend Setup ✅ COMPLETED
- [x] Install and configure SQLite for development
- [x] Create comprehensive database schema for game state
- [x] Implement database connection and migration system
- [x] Set up REST API endpoints structure with Express routes
- [x] Configure environment variables for database
- [x] Create TypeScript interfaces and Zod schemas for data models
- [x] Test database operations with game save/load functionality

#### Day 5-7: LLM Integration Research ✅ COMPLETED
- [x] Install and test Ollama locally with GPU support
- [x] Download and test Llama3.2:3b model for development
- [x] Create comprehensive LLM service wrapper with error handling
- [x] Test prompt engineering for Youth and Business demographics
- [x] Implement JSON response parsing with Zod validation
- [x] Create detailed demographic personas and prompt templates
- [x] Test response consistency and realistic policy evaluations

**Deliverable**: ✅ Working development environment with database and LLM integration

### Phase 2: Core Systems (Week 2)
**Goal**: Implement fundamental game mechanics

#### Day 8-10: Game State Management
- [ ] Create GameState class with essential variables
- [ ] Implement turn management system
- [ ] Build basic simulation engine
- [ ] Create demographic state tracking
- [ ] Add simple causal relationships

#### Day 11-12: Policy Decision System
- [ ] Create PolicyIssue data structure with multiple choice options
- [ ] Implement issue generation system with predefined scenarios
- [ ] Build policy evaluation logic for both predefined and custom options
- [ ] Create issue categorization system (Economic, Social, Legal, etc.)
- [ ] Test policy decision workflow

#### Day 13-14: Enhanced AI Integration
- [ ] Update DemographicAgent class for structured decisions
- [ ] Create prompt templates for evaluating predefined policy options
- [ ] Implement fallback responses for predefined choices
- [ ] Build custom policy evaluation with full LLM processing
- [ ] Test response consistency across both decision types

**Deliverable**: Working backend with AI demographics and email system

### Phase 3: User Interface (Week 3) 🔄 IN PROGRESS
**Goal**: Create playable frontend interface

#### Day 15-17: Email Interface ✅ COMPLETED
- [x] Design and implement inbox component with professional styling
- [x] Create email reading pane with full email display
- [x] Build policy composition form with templates and suggestions
- [x] Add professional email client styling and layout
- [x] Implement responsive design basics

#### Day 17.5: Policy Decision Interface (NEXT UPDATE NEEDED)
- [ ] Design and implement structured policy decision panel
- [ ] Create multiple choice option selection interface
- [ ] Build custom policy text input with character limits
- [ ] Add issue categorization and context display
- [ ] Implement demographic impact previews

#### Day 18-19: Game Dashboard ✅ COMPLETED
- [x] Create approval rating display with color-coded indicators
- [x] Build budget overview component with currency formatting
- [x] Add demographic happiness indicators with progress bars
- [x] Implement basic charts/graphs for demographic data
- [x] Create comprehensive dashboard with all key metrics

#### Day 20-21: Integration & Testing ✅ COMPLETED
- [x] Connect frontend to backend APIs with Axios client
- [x] Implement state management with Zustand
- [x] Add loading states and comprehensive error handling
- [x] Test complete gameplay loop with mock data
- [x] Create game setup flow and main interface

**Deliverable**: ✅ Playable vertical slice with professional UI

### Phase 4: Polish & Validation (Week 4)
**Goal**: Refine the vertical slice for demonstration

#### Day 22-24: Content Creation
- [ ] Create 15-20 structured policy issues across all categories
- [ ] Write engaging multiple choice options for each issue
- [ ] Design realistic email templates for issue notifications
- [ ] Create demographic impact previews for predefined options
- [ ] Test policy decision flow and narrative engagement

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

interface PolicyIssue {
  id: string;
  category: 'economic' | 'social' | 'legal' | 'environmental' | 'infrastructure' | 'technology';
  title: string;
  context: string;
  affectedDemographics: string[];
  options: PolicyOption[];
  customOptionAllowed: boolean;
}

interface PolicyOption {
  id: string;
  title: string;
  description: string;
  previewEffects: {
    budget: number;
    demographics: Record<string, number>;
  };
}

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: Date;
  type: 'issue_notification' | 'policy_result' | 'event' | 'general';
  relatedIssue?: string;
}
```

### Enhanced AI Prompts for Structured Decisions
```typescript
const YOUTH_PERSONA_PREDEFINED = `
You represent young adults (18-30) evaluating a predefined policy option.
Current happiness: {happiness}/100
Recent concerns: {concerns}

Policy Category: {category}
Policy Option: "{optionTitle}" - {optionDescription}
Context: {issueContext}

Rate this specific policy option with JSON:
{
  "happiness_change": number (-15 to +15),
  "support_level": number (0 to 100),
  "reaction": "brief explanation (max 30 words)"
}
`;

const YOUTH_PERSONA_CUSTOM = `
You represent young adults (18-30) evaluating a custom policy proposal.
Current happiness: {happiness}/100
Recent concerns: {concerns}

Policy Category: {category}
Custom Policy: "{customPolicy}"
Context: {issueContext}

Evaluate this custom policy with JSON:
{
  "happiness_change": number (-25 to +25),
  "support_level": number (0 to 100),
  "reaction": "brief explanation (max 50 words)"
}
`;

// Similar structure for BUSINESS_PERSONA_PREDEFINED and BUSINESS_PERSONA_CUSTOM
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

### Phase 7: Windows Binary Distribution (Weeks 5-6)
**Goal**: Package the web application as a standalone Windows executable

#### Week 5: Desktop Application Setup
- [ ] Research and select packaging solution (Electron vs Tauri vs Neutralino)
- [ ] Set up desktop application project structure
- [ ] Configure embedded web server for offline functionality
- [ ] Bundle LLM models and dependencies into executable
- [ ] Test basic desktop application functionality

#### Week 6: Distribution and Polish
- [ ] Create Windows installer with proper dependencies
- [ ] Implement auto-update mechanism for future releases
- [ ] Add native Windows integration (system notifications, taskbar)
- [ ] Set up code signing for Windows security compliance
- [ ] Test on multiple Windows versions (Windows 10, 11)
- [ ] Prepare distribution channels (Steam, itch.io, direct download)

**Deliverable**: Standalone Windows executable ready for distribution

---

## Conclusion

This vertical slice approach ensures rapid development of a playable prototype that demonstrates the core value proposition of the political simulation game. By focusing on essential features and limiting scope, we can validate the concept, test technical feasibility, and gather feedback before committing to full development.

The 4-week timeline provides a realistic path to a demonstrable product while maintaining flexibility for iteration and improvement based on testing results.

---

*Document Version: 1.0*  
*Created: [Current Date]*  
*Estimated Completion: 4 weeks*
