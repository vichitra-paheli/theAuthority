# Political Simulation Game - Game Design Document

## Table of Contents
1. [Game Overview](#game-overview)
2. [Core Gameplay](#core-gameplay)
3. [Technical Architecture](#technical-architecture)
4. [Development Phases](#development-phases)
5. [User Interface Design](#user-interface-design)
6. [AI Integration](#ai-integration)
7. [Modding Support](#modding-support)
8. [Performance Considerations](#performance-considerations)

---

## Game Overview

### Vision Statement
A single-player political simulation web game where players assume the role of a young politician managing a local town through an immersive email-based interface. The game combines dynamic AI-driven demographic responses with complex causal simulation systems to create realistic political consequences.

### Core Concept
- **Platform**: Web-based (HTML5/JavaScript) with Windows binary distribution
- **Target Audience**: PC users interested in political simulation and strategy games
- **Art Style**: Realistic email client and office software interface
- **Unique Selling Points**: 
  - Structured policy decision system with meaningful choices
  - Realistic email-based interface with issue-focused gameplay
  - Dynamic demographic responses via Large Language Models
  - Complex causal loop simulation system
  - Extensive modding support

### Game Pillars
1. **Authenticity**: Realistic political processes and consequences
2. **Meaningful Choice**: Structured policy decisions with clear trade-offs
3. **Complexity**: Interconnected systems with meaningful feedback loops
4. **Accessibility**: Intuitive email-based interface familiar to all users

### Policy Decision System
Each turn, players face **3-5 structured policy dilemmas** across different categories:

#### Policy Categories
- **Economic**: Budget allocation, taxation, business regulations
- **Social**: Education, healthcare, housing, welfare programs  
- **Legal**: Law enforcement, civil rights, judicial reforms
- **Environmental**: Conservation, pollution control, sustainability
- **Infrastructure**: Transportation, utilities, public works
- **Technology**: Digital services, innovation, privacy regulations

#### Decision Format
Each policy issue presents:
- **Context**: Brief background explaining the situation
- **Stakeholders**: Which demographics are most affected
- **Options**: 2-4 predefined policy choices with clear descriptions
- **Custom Option**: Player can write a brief alternative (50-100 words max)
- **Consequences Preview**: Hints at potential demographic reactions

#### Example Policy Issue
**Category**: Economic  
**Issue**: "Local Business Tax Reform"  
**Context**: "Small businesses are struggling with current tax rates, but the city needs revenue for infrastructure projects."  
**Options**:
1. **Reduce Business Taxes (-15%)** - Lower revenue but support local economy
2. **Maintain Current Rates** - Status quo with balanced impact  
3. **Increase Taxes (+10%) with Incentives** - Higher revenue with targeted business support programs
4. **Custom Policy**: [Player writes alternative approach]

---

## Core Gameplay

### Player Role
The player is a newly elected local politician responsible for managing a town's affairs. Success is measured by maintaining demographic satisfaction while balancing budgets and responding to crises.

### Core Demographics (Initial 4)
1. **Youth (18-30)**: Priority on education, employment, technology, social programs
2. **Seniors (65+)**: Focus on healthcare, pensions, safety, traditional values
3. **Business Owners**: Emphasis on taxes, regulations, economic growth, infrastructure
4. **Environmentalists**: Concern for sustainability, green policies, conservation

### Gameplay Loop
1. **Email Review Phase**: Player reads incoming emails about issues, events, and previous policy results
2. **Issue Presentation Phase**: Game presents 3-5 structured policy dilemmas across different categories (Economy, Laws, Environment, etc.)
3. **Decision Phase**: For each issue, player chooses from 2-4 predefined policy options OR writes a brief custom response
4. **AI Processing Phase**: Each demographic's AI agent evaluates the selected policies
5. **Simulation Update**: Causal loop system processes all effects and updates world state
6. **Feedback Phase**: New emails arrive showing policy outcomes and emerging issues
7. **Turn Advancement**: Game progresses to next time period (monthly/quarterly)

### Victory Conditions
- **Primary**: Maintain overall approval rating above threshold
- **Secondary**: Successfully complete major initiatives
- **Failure**: Approval drops too low, budget crisis, or vote of no confidence

---

## Technical Architecture

### Web Technology Stack

#### Frontend
- **Framework**: React.js or Vue.js for component-based UI
- **Styling**: CSS3 with preprocessor (SCSS/Less) for realistic email client styling
- **State Management**: Redux/Vuex for complex game state
- **Charts/Graphs**: D3.js or Chart.js for data visualization
- **Build Tool**: Webpack or Vite for optimization

#### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: 
  - PostgreSQL for structured game data (demographics, policies, save states)
  - Redis for session management and caching
- **AI Integration**: 
  - Local LLM via Ollama or similar (ChatGPT-OSS 20B model)
  - REST API endpoints for AI demographic responses
- **File System**: JSON/CSV data files for modding support

#### Infrastructure
- **Containerization**: Docker for consistent deployment
- **Process Management**: PM2 for Node.js process management
- **Reverse Proxy**: Nginx for static file serving and load balancing
- **Development**: Hot-reload development server

### System Architecture

#### Core Systems

**1. Game State Manager**
```javascript
class GameStateManager {
  constructor() {
    this.currentTurn = 1;
    this.worldState = new Map(); // Economic, social, environmental variables
    this.demographics = new Map(); // Each demographic's current sentiment
    this.activeEvents = []; // Ongoing situations and their effects
    this.policyHistory = []; // Record of all enacted policies
  }
}
```

**2. Simulation Engine**
```javascript
class SimulationEngine {
  constructor() {
    this.variables = new Map(); // All simulation variables (GDP, happiness, etc.)
    this.effectGraph = new DirectedGraph(); // Causal relationships
    this.modifiers = []; // Temporary effects from events
  }
  
  processturn(policyEffects, eventEffects) {
    // Update all variables based on causal relationships
    // Apply decay to temporary modifiers
    // Calculate new equilibrium state
  }
}
```

**3. AI Demographic System**
```javascript
class DemographicAgent {
  constructor(name, persona, currentState) {
    this.name = name;
    this.persona = persona; // LLM prompt template
    this.currentState = currentState; // Happiness, concerns, etc.
    this.memory = []; // Recent policy reactions for context
  }
  
  async evaluatePolicy(policyText, worldContext) {
    const prompt = this.buildPrompt(policyText, worldContext);
    const response = await this.queryLLM(prompt);
    return this.parseResponse(response);
  }
}
```

**4. Event Manager**
```javascript
class EventManager {
  constructor() {
    this.eventDefinitions = []; // Loaded from data files
    this.activeEvents = new Map();
    this.eventProbabilities = new Map();
  }
  
  evaluateEvents(currentState) {
    // Calculate probabilities based on current conditions
    // Trigger events that exceed threshold
    // Update ongoing event effects
  }
}
```

### Data Architecture

#### Database Schema
```sql
-- Game saves
CREATE TABLE game_saves (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(100),
  turn_number INTEGER,
  world_state JSONB,
  demographics_state JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Policy templates for AI training
CREATE TABLE policy_templates (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50),
  template_text TEXT,
  expected_effects JSONB
);

-- Event definitions
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  trigger_conditions JSONB,
  effects JSONB,
  duration INTEGER
);
```

#### Configuration Files Structure
```
/data/
├── demographics/
│   ├── youth.json
│   ├── seniors.json
│   ├── business.json
│   └── environmentalists.json
├── simulation/
│   ├── variables.json
│   ├── relationships.json
│   └── formulas.json
├── events/
│   ├── economic_events.json
│   ├── social_events.json
│   └── environmental_events.json
└── policies/
    ├── categories.json
    └── templates.json
```

---

## Development Phases

### Phase 1: Foundation & Planning (Weeks 1-2)

**Design Finalization**
- Complete demographic profiles with detailed AI personas
- Map causal relationships between all simulation variables
- Design email templates and UI mockups
- Research and select optimal LLM integration approach

**Technical Setup**
- Initialize project repository with chosen tech stack
- Set up development environment with hot-reload
- Configure database schema and initial data
- Implement basic project structure and build pipeline

**LLM Integration Research**
- Test local LLM deployment options (Ollama, LM Studio)
- Benchmark ChatGPT-OSS 20B performance on target hardware
- Design prompt templates for consistent demographic responses
- Implement JSON response parsing and validation

### Phase 2: Core Systems Development (Weeks 3-6)

**Simulation Engine**
- Implement variable system with causal relationships
- Create effect calculation algorithms
- Build turn processing pipeline
- Add temporal effects and decay systems

**AI Demographic System**
- Integrate chosen LLM solution
- Implement demographic agent classes
- Create prompt engineering system
- Build response parsing and validation

**Basic Game Loop**
- Implement turn management system
- Create policy input processing
- Build state persistence layer
- Add basic error handling and logging

**Minimal UI**
- Create basic email interface layout
- Implement policy composition form
- Add simple data visualization
- Build turn progression controls

### Phase 3: Content & Polish (Weeks 7-10)

**Email System**
- Design realistic email templates
- Implement dynamic email generation
- Create sender personas and avatars
- Add email sorting and filtering

**Event System**
- Implement event probability calculations
- Create event effect application
- Build ongoing situation tracking
- Add crisis and opportunity events

**UI Enhancement**
- Style interface to match professional email clients
- Add desktop environment simulation
- Implement responsive design
- Create data visualization dashboards

**Balance & Testing**
- Tune demographic AI responses
- Balance simulation variable relationships
- Test edge cases and extreme policies
- Optimize performance bottlenecks

### Phase 4: Advanced Features (Weeks 11-14)

**Modding Support**
- Implement data file loading system
- Create mod validation and error handling
- Build mod selection interface
- Document modding API and file formats

**Save/Load System**
- Implement game state serialization
- Create save file management interface
- Add auto-save functionality
- Build save file migration system

**Audio & Polish**
- Add notification sounds and ambient audio
- Implement visual feedback systems
- Create loading screens and transitions
- Add accessibility features

**Performance Optimization**
- Profile and optimize LLM inference
- Implement caching for repeated calculations
- Optimize database queries
- Add progressive loading for large datasets

### Phase 5: Testing & Deployment (Weeks 15-16)

**Quality Assurance**
- Comprehensive gameplay testing
- AI response quality validation
- Performance testing on target hardware
- Cross-browser compatibility testing

**Deployment Preparation**
- Set up production infrastructure
- Configure monitoring and logging
- Create deployment scripts
- Prepare documentation

**Launch Readiness**
- Final bug fixes and polish
- Create player onboarding experience
- Prepare support documentation
- Set up analytics and feedback collection

### Phase 6: Windows Binary Distribution (Weeks 17-18)

**Desktop Application Packaging**
- Package web application using Electron or Tauri
- Create Windows installer with proper dependencies
- Bundle LLM models and required runtime components
- Implement auto-update mechanism

**Distribution Setup**
- Create Windows executable with embedded web server
- Configure offline mode with local model inference
- Set up code signing for Windows security
- Prepare distribution channels (Steam, itch.io, direct download)

**Platform Optimization**
- Optimize startup time and memory usage
- Implement native system integration (notifications, file associations)
- Add Windows-specific features (taskbar integration, system tray)
- Test on various Windows versions (10, 11)

---

## User Interface Design

### Email Client Interface

**Layout Structure**
```
┌─────────────────────────────────────────────────────────┐
│ [Menu] [File] [Edit] [View] [Tools] [Help]             │
├─────────────────┬───────────────────────────────────────┤
│ Inbox (23)      │ From: Mayor Johnson                   │
│ Sent            │ Subject: Budget Meeting Tomorrow      │
│ Drafts          │ Date: March 15, 2024 - 9:30 AM      │
│ Important       │                                       │
│ ───────────────│ The quarterly budget review is       │
│ Budget Reports  │ scheduled for tomorrow. Please        │
│ Demographics    │ prepare your proposals...             │
│ Policy Archive  │                                       │
│ ───────────────│ [Reply] [Forward] [Archive]          │
│ New Message     │                                       │
└─────────────────┴───────────────────────────────────────┘
```

**Key Interface Elements**
- **Inbox**: Categorized email list with unread indicators
- **Reading Pane**: Full email content with rich formatting
- **Policy Decision Panel**: Structured issue presentation with multiple choice options
- **Custom Policy Composer**: Brief text input for alternative solutions
- **Progress Dashboard**: Overall status tracking with trend indicators
- **Causal Loop Visualization**: Interactive diagram showing system relationships
- **Sidebar Tools**: Quick access to reports and analytics
- **Status Bar**: Turn indicator, approval rating, budget summary
- **Animation System**: Loading states, transitions, and feedback animations

### Policy Decision Interface

**Issue Presentation Layout**
```
┌─────────────────────────────────────────────────────────┐
│ 📊 ECONOMIC ISSUE: Local Business Tax Reform           │
├─────────────────────────────────────────────────────────┤
│ Context: Small businesses struggling with current tax   │
│ rates, but city needs revenue for infrastructure.       │
│                                                         │
│ Affected Demographics: 🏢 Business Owners, 👥 Youth    │
│                                                         │
│ ○ Reduce Business Taxes (-15%)                         │
│   Lower revenue but support local economy               │
│                                                         │
│ ○ Maintain Current Rates                               │
│   Status quo with balanced impact                       │
│                                                         │
│ ○ Increase Taxes (+10%) with Incentives               │
│   Higher revenue with targeted support programs         │
│                                                         │
│ ○ Custom Policy: [Text Input Box]                     │
│   Write your alternative (50-100 words)                │
│                                                         │
│ [Preview Reactions] [Submit Decision] [Skip Issue]     │
└─────────────────────────────────────────────────────────┘
```

### Dashboard Components

**Progress Overview Dashboard**
```html
<div class="progress-dashboard">
  <div class="overall-status">
    <h2>Town Status Overview</h2>
    <div class="status-grid">
      <div class="status-card approval">
        <div class="metric-header">
          <h3>Overall Approval</h3>
          <div class="trend-indicator up">↗️ +3%</div>
        </div>
        <div class="metric-value">72%</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 72%"></div>
        </div>
        <div class="status-description">Stable - Citizens generally satisfied</div>
      </div>
      
      <div class="status-card budget">
        <div class="metric-header">
          <h3>Budget Health</h3>
          <div class="trend-indicator down">↘️ -2%</div>
        </div>
        <div class="metric-value">$200K Surplus</div>
        <div class="progress-bar">
          <div class="progress-fill positive" style="width: 60%"></div>
        </div>
        <div class="status-description">Healthy surplus, room for investment</div>
      </div>
      
      <div class="status-card demographics">
        <div class="metric-header">
          <h3>Demographic Harmony</h3>
          <div class="trend-indicator stable">→ 0%</div>
        </div>
        <div class="metric-value">Moderate</div>
        <div class="demographic-mini-bars">
          <div class="mini-bar youth" title="Youth: 85%"></div>
          <div class="mini-bar business" title="Business: 78%"></div>
          <div class="mini-bar seniors" title="Seniors: 45%"></div>
          <div class="mini-bar environment" title="Environment: 80%"></div>
        </div>
        <div class="status-description">Mixed reactions, focus needed on seniors</div>
      </div>
    </div>
  </div>
</div>
```

**Causal Loop Visualization System**
```html
<div class="causal-loop-container">
  <div class="loop-header">
    <h3>System Relationships</h3>
    <div class="visibility-level">Level 2: Municipal Operations</div>
  </div>
  
  <svg class="causal-diagram" viewBox="0 0 800 600">
    <!-- Nodes (Variables) -->
    <g class="nodes">
      <circle class="node controlled" cx="200" cy="150" r="30" data-variable="budget"/>
      <text x="200" y="155">Budget</text>
      
      <circle class="node controlled" cx="400" cy="150" r="30" data-variable="policies"/>
      <text x="400" y="155">Policies</text>
      
      <circle class="node revealed" cx="600" cy="150" r="30" data-variable="approval"/>
      <text x="600" y="155">Approval</text>
      
      <circle class="node hidden" cx="300" cy="300" r="30" data-variable="economic_health"/>
      <text x="300" y="305">Economy</text>
    </g>
    
    <!-- Relationships (Edges) -->
    <g class="relationships">
      <path class="relationship positive" d="M230,150 Q315,100 370,150" 
            data-strength="0.7" data-delay="1"/>
      <path class="relationship negative" d="M430,150 Q515,100 570,150" 
            data-strength="-0.5" data-delay="2"/>
    </g>
    
    <!-- Animations for active relationships -->
    <g class="flow-particles">
      <circle class="particle" r="3">
        <animateMotion dur="2s" repeatCount="indefinite">
          <mpath href="#relationship-1"/>
        </animateMotion>
      </circle>
    </g>
  </svg>
  
  <div class="loop-legend">
    <div class="legend-item">
      <span class="legend-dot controlled"></span> Under Your Control
    </div>
    <div class="legend-item">
      <span class="legend-dot revealed"></span> Recently Discovered
    </div>
    <div class="legend-item">
      <span class="legend-dot hidden"></span> Hidden Relationships
    </div>
  </div>
</div>
```

**Animation and Loading System**
```html
<div class="animation-system">
  <!-- Policy Processing Animation -->
  <div class="policy-processing-overlay" id="processingOverlay">
    <div class="processing-content">
      <div class="spinner-container">
        <div class="policy-spinner">
          <div class="spinner-segment demographics"></div>
          <div class="spinner-segment simulation"></div>
          <div class="spinner-segment ai"></div>
          <div class="spinner-segment results"></div>
        </div>
      </div>
      <div class="processing-text">
        <h3>Processing Policy Decisions...</h3>
        <div class="processing-steps">
          <div class="step active">📊 Analyzing demographic impact</div>
          <div class="step">🤖 Consulting AI advisors</div>
          <div class="step">⚙️ Running simulation</div>
          <div class="step">📧 Generating responses</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Turn Transition Animation -->
  <div class="turn-transition" id="turnTransition">
    <div class="transition-content">
      <div class="turn-counter">
        <span class="old-turn">Turn 3</span>
        <span class="arrow">→</span>
        <span class="new-turn">Turn 4</span>
      </div>
      <div class="transition-effects">
        <div class="effect budget-change">Budget: +$50K</div>
        <div class="effect approval-change">Approval: +2%</div>
        <div class="effect new-issues">3 New Issues</div>
      </div>
    </div>
  </div>
</div>
```

### Responsive Design Considerations
- **Desktop First**: Optimized for 1920x1080 and 2560x1440 displays
- **Minimum Resolution**: 1366x768 support
- **Scaling Options**: UI scale settings for high-DPI displays
- **Accessibility**: Keyboard navigation and screen reader support

---

## Progressive Complexity & Discovery System

### Causal Loop Revelation Mechanics

**Progressive Unlock System**
The game starts with players controlling only basic municipal functions, gradually revealing more complex system relationships as they demonstrate competency and advance in responsibility.

**Visibility Levels**
1. **Level 1: Basic Operations** (Turns 1-5)
   - Direct control: Budget allocation, basic policies
   - Visible relationships: Policy → Demographic happiness, Budget → Services
   - Hidden: Economic multipliers, inter-demographic influences

2. **Level 2: Municipal Management** (Turns 6-15)
   - Revealed: Economic health impacts, service quality effects
   - New controls: Infrastructure projects, regulatory policies
   - Hidden: Regional economic factors, long-term demographic shifts

3. **Level 3: Regional Influence** (Turns 16-30)
   - Revealed: Inter-city relationships, economic competition
   - New controls: Regional partnerships, economic development
   - Hidden: State-level policy impacts, macro-economic trends

4. **Level 4: Strategic Leadership** (Turns 31+)
   - Revealed: Full causal loop diagram with all relationships
   - New controls: Long-term strategic planning, crisis management
   - Master-level complexity with all system interactions visible

**Discovery Triggers**
- **Performance-Based**: Unlock new areas by maintaining high approval ratings
- **Crisis-Driven**: Emergency situations reveal hidden system relationships
- **Exploration-Based**: Experimenting with policies uncovers new connections
- **Time-Based**: Some relationships only become apparent over multiple turns

### Progress Tracking System

**Overall Progress Metrics**
```javascript
interface ProgressMetrics {
  overallApproval: {
    current: number;
    trend: 'up' | 'down' | 'stable';
    history: number[]; // Last 10 turns
    milestone: string; // "Stable Leadership", "Crisis Mode", etc.
  };
  
  budgetHealth: {
    current: number;
    trend: 'improving' | 'declining' | 'stable';
    debtLevel: number;
    sustainabilityScore: number;
  };
  
  demographicHarmony: {
    overallBalance: number; // 0-100
    mostSatisfied: string;
    mostConcerned: string;
    polarization: number; // How divided demographics are
  };
  
  systemMastery: {
    visibilityLevel: number; // 1-4
    relationshipsDiscovered: number;
    totalRelationships: number;
    masteryPercentage: number;
  };
  
  achievements: Achievement[];
}
```

**Achievement System**
- **"Steady Hand"**: Maintain >70% approval for 5 consecutive turns
- **"Budget Master"**: Achieve budget surplus for 3 consecutive turns
- **"Consensus Builder"**: Get all demographics above 60% happiness simultaneously
- **"Crisis Manager"**: Successfully handle 3 major crisis events
- **"System Architect"**: Discover 50% of all causal relationships
- **"Master Politician"**: Reach maximum visibility level (Level 4)

### Animation and Feedback System

**Loading and Processing States**
- **Policy Processing**: Multi-stage animation showing AI consultation, simulation, and result generation
- **Turn Transitions**: Smooth animations showing metric changes and new developments
- **Discovery Moments**: Special animations when new causal relationships are revealed
- **Achievement Unlocks**: Celebration animations for milestones and achievements

**Visual Feedback Elements**
- **Trend Indicators**: Animated arrows showing metric improvements/declines
- **Progress Bars**: Smooth transitions for all percentage-based metrics
- **Particle Effects**: Subtle animations showing system interactions in causal loop
- **Notification System**: Toast notifications for important events and discoveries

**Micro-Interactions**
- **Button Hover Effects**: Subtle animations on interactive elements
- **Card Transitions**: Smooth expand/collapse for detailed information
- **Chart Animations**: Animated data visualization updates
- **Email Notifications**: Subtle pulse effects for new messages

---

## AI Integration

### LLM Architecture

**Model Selection**
- **Primary**: ChatGPT-OSS 20B via Ollama
- **Fallback**: Smaller models (7B/13B) for lower-end hardware
- **API Alternative**: OpenAI API for users preferring cloud processing

**Deployment Strategy**
```javascript
class LLMService {
  constructor() {
    this.modelPath = './models/chatgpt-oss-20b.gguf';
    this.isLoaded = false;
    this.requestQueue = [];
  }
  
  async initialize() {
    // Load model with appropriate quantization
    // Configure generation parameters
    // Set up request batching for efficiency
  }
  
  async generateResponse(prompt, demographic) {
    // Add request to queue for batch processing
    // Apply demographic-specific parameters
    // Parse and validate JSON response
  }
}
```

### Prompt Engineering

**Demographic Persona Template**
```javascript
const youthPersona = {
  systemPrompt: `You are representing the Youth demographic (ages 18-30) in a local town. 
  You are tech-savvy, environmentally conscious, and concerned about employment opportunities.
  Current sentiment: ${currentHappiness}/100
  Recent concerns: ${recentIssues.join(', ')}
  
  Respond to policy proposals with realistic reactions including:
  - Happiness change (-50 to +50)
  - Economic impact assessment (-25 to +25)
  - Support likelihood (0-100)
  - Brief explanation (max 100 words)
  
  Format response as JSON:
  {
    "happiness_change": number,
    "economic_impact": number,
    "support_likelihood": number,
    "explanation": "string"
  }`,
  
  temperature: 0.3, // Lower for consistent responses
  maxTokens: 200,
  stopSequences: ['}']
};
```

**Policy Evaluation Workflow**
1. **Context Building**: Compile current world state and demographic status
2. **Prompt Construction**: Insert policy text into demographic-specific template
3. **LLM Query**: Send prompt to model with appropriate parameters
4. **Response Parsing**: Extract JSON data and validate ranges
5. **Fallback Handling**: Use default responses if parsing fails
6. **State Integration**: Apply changes to simulation engine

### Response Quality Assurance

**Validation Pipeline**
```javascript
function validateDemographicResponse(response, demographic) {
  const parsed = JSON.parse(response);
  
  // Range validation
  if (parsed.happiness_change < -50 || parsed.happiness_change > 50) {
    throw new ValidationError('Happiness change out of range');
  }
  
  // Consistency checks
  if (demographic.name === 'environmentalists' && 
      policy.includes('coal plant') && 
      parsed.happiness_change > 0) {
    console.warn('Unexpected positive response from environmentalists to coal policy');
  }
  
  return parsed;
}
```

**Quality Metrics**
- **Response Time**: Target <3 seconds per demographic
- **Consistency**: Similar policies should yield similar responses
- **Realism**: Responses should align with demographic values
- **Variety**: Avoid repetitive phrasing in explanations

---

## Modding Support

### Data-Driven Architecture

**Mod Structure**
```
/mods/expanded_demographics/
├── mod.json                 # Mod metadata
├── demographics/
│   ├── students.json        # New demographic
│   └── retirees.json        # Modified existing demographic
├── events/
│   └── university_events.json
├── simulation/
│   └── education_variables.json
└── localization/
    └── en.json
```

**Mod Configuration Format**
```json
{
  "name": "Expanded Demographics",
  "version": "1.0.0",
  "author": "ModderName",
  "description": "Adds student and retiree demographics",
  "gameVersion": "1.0.0",
  "dependencies": [],
  "files": {
    "demographics": ["students.json", "retirees.json"],
    "events": ["university_events.json"],
    "simulation": ["education_variables.json"]
  }
}
```

### Modding API

**Demographic Definition**
```json
{
  "id": "students",
  "name": "Students",
  "description": "University and college students",
  "population_percentage": 15,
  "base_happiness": 60,
  "priorities": ["education", "employment", "housing"],
  "ai_persona": {
    "system_prompt": "You represent university students...",
    "temperature": 0.4,
    "response_format": "standard_demographic"
  },
  "initial_concerns": ["tuition costs", "job market"],
  "color_theme": "#4A90E2"
}
```

**Event Definition**
```json
{
  "id": "university_funding_crisis",
  "name": "University Funding Crisis",
  "description": "The local university faces budget cuts",
  "triggers": [
    {
      "condition": "budget_education < 0.3",
      "weight": 0.7
    },
    {
      "condition": "random",
      "weight": 0.1
    }
  ],
  "effects": {
    "students_happiness": -30,
    "education_quality": -20,
    "youth_happiness": -10
  },
  "duration": 3,
  "email_template": "university_crisis_email.html"
}
```

### Mod Loading System

**ModManager Class**
```javascript
class ModManager {
  constructor() {
    this.activeMods = [];
    this.modData = new Map();
  }
  
  async loadMod(modPath) {
    const modConfig = await this.loadModConfig(modPath);
    const modData = await this.loadModData(modPath, modConfig);
    
    this.validateMod(modData);
    this.integrateModData(modData);
    
    this.activeMods.push(modConfig);
  }
  
  validateMod(modData) {
    // Check for conflicts with existing data
    // Validate JSON schemas
    // Ensure AI prompts are properly formatted
  }
}
```

### Mod Distribution

**Steam Workshop Integration** (Future)
- Automated mod packaging and distribution
- Rating and review system
- Automatic updates and dependency management
- Mod conflict detection and resolution

**Manual Installation**
- Drag-and-drop mod folder installation
- In-game mod browser and activation
- Mod validation and error reporting
- Backup and restore functionality

---

## Performance Considerations

### LLM Optimization

**Model Quantization**
- **4-bit Quantization**: Reduce memory usage by 75%
- **8-bit Quantization**: Balance between speed and quality
- **Dynamic Loading**: Load/unload models based on usage

**Inference Optimization**
```javascript
class OptimizedLLMService {
  constructor() {
    this.batchSize = 4; // Process all demographics together
    this.cacheSize = 100; // Cache recent responses
    this.responseCache = new LRUCache(this.cacheSize);
  }
  
  async processDemographicsBatch(policy, demographics) {
    const cacheKey = this.generateCacheKey(policy, demographics);
    if (this.responseCache.has(cacheKey)) {
      return this.responseCache.get(cacheKey);
    }
    
    // Batch process all demographic responses
    const responses = await this.batchInference(policy, demographics);
    this.responseCache.set(cacheKey, responses);
    
    return responses;
  }
}
```

### Frontend Optimization

**Code Splitting**
```javascript
// Lazy load heavy components
const Dashboard = lazy(() => import('./components/Dashboard'));
const EmailComposer = lazy(() => import('./components/EmailComposer'));
const ModManager = lazy(() => import('./components/ModManager'));
```

**State Management**
```javascript
// Efficient state updates with immutability
const gameStateReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_DEMOGRAPHIC':
      return {
        ...state,
        demographics: {
          ...state.demographics,
          [action.id]: { ...state.demographics[action.id], ...action.data }
        }
      };
  }
};
```

### Backend Optimization

**Database Performance**
```sql
-- Indexes for frequent queries
CREATE INDEX idx_game_saves_player ON game_saves(player_name);
CREATE INDEX idx_events_triggers ON events USING GIN(trigger_conditions);

-- Materialized views for complex calculations
CREATE MATERIALIZED VIEW demographic_trends AS
SELECT 
  demographic_id,
  AVG(happiness) as avg_happiness,
  COUNT(*) as policy_count
FROM policy_responses 
GROUP BY demographic_id;
```

**Caching Strategy**
- **Redis**: Session data and frequently accessed game states
- **Memory Cache**: LLM responses and simulation calculations
- **CDN**: Static assets and common data files

### System Requirements

**Minimum Requirements**
- **CPU**: 4-core processor (Intel i5-8400 / AMD Ryzen 5 2600)
- **RAM**: 8GB (4GB for OS, 4GB for LLM)
- **Storage**: 10GB available space
- **Network**: Broadband connection for initial download

**Recommended Requirements**
- **CPU**: 8-core processor (Intel i7-10700K / AMD Ryzen 7 3700X)
- **RAM**: 16GB (8GB for LLM operations)
- **GPU**: Dedicated GPU for accelerated inference (optional)
- **Storage**: SSD with 20GB available space

**Performance Targets**
- **Turn Processing**: <30 seconds for all demographics
- **UI Responsiveness**: <100ms for interface interactions
- **Memory Usage**: <6GB total application memory
- **Startup Time**: <60 seconds including model loading

---

## Conclusion

This Game Design Document outlines a comprehensive web-based political simulation game that leverages modern web technologies and AI to create an engaging, realistic political experience. The modular architecture ensures scalability and extensive modding support, while the email-based interface provides an intuitive and immersive user experience.

The development approach prioritizes building robust core systems before expanding content, ensuring a solid foundation for future growth. The integration of local LLM technology provides dynamic, personalized responses while maintaining player privacy and reducing operational costs.

Through careful attention to performance optimization and user experience design, this game will deliver a unique political simulation experience that combines the depth of traditional strategy games with the innovation of AI-driven gameplay mechanics.

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*  
*Author: Development Team*
