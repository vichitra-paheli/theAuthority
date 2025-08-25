# Development Guide
## Political Simulation Game

### Quick Start

#### Option 1: Interactive Development (Recommended)
Run both services in the same terminal with colored output:
```bash
npm run dev
```
This will start both frontend (http://localhost:5173) and backend (http://localhost:3001) with auto-reload.

#### Option 2: Background Development with PM2
Start both services in the background:
```bash
npm run dev:bg
# or
npm run dev:pm2
```

Monitor the services:
```bash
npm run status    # Check service status
npm run logs      # View all logs
npm run monitor   # Interactive monitoring dashboard
```

Stop the services:
```bash
npm run stop      # Stop all services
npm run restart   # Restart all services
npm run delete    # Delete PM2 processes completely
```

#### Option 3: Individual Services
Run services separately:
```bash
npm run dev:frontend    # Frontend only
npm run dev:backend     # Backend only
```

### Service URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Backend Health**: http://localhost:3001/health

### Development Workflow

1. **Start Development**:
   ```bash
   npm run dev
   ```

2. **Make Changes**: 
   - Both services have hot-reload enabled
   - Frontend changes reflect immediately
   - Backend restarts automatically on file changes

3. **View Logs** (if using PM2):
   ```bash
   npm run logs              # All logs
   npm run logs:frontend     # Frontend logs only
   npm run logs:backend      # Backend logs only
   ```

4. **Monitor Performance**:
   ```bash
   npm run monitor           # PM2 monitoring dashboard
   npm run status            # Quick status check
   ```

### Available Commands

#### Development
- `npm run dev` - Start both services interactively
- `npm run dev:bg` - Start both services in background
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only

#### Process Management (PM2)
- `npm run dev:pm2` - Start with PM2
- `npm run stop` - Stop all services
- `npm run restart` - Restart all services
- `npm run delete` - Delete PM2 processes
- `npm run status` - Show service status
- `npm run monitor` - Interactive monitoring

#### Logging
- `npm run logs` - View all logs
- `npm run logs:frontend` - View frontend logs
- `npm run logs:backend` - View backend logs

#### Maintenance
- `npm run setup` - Install all dependencies
- `npm run clean` - Clean all node_modules and build files
- `npm run build` - Build both services for production
- `npm run test` - Run all tests
- `npm run lint` - Run linting on both services

### Troubleshooting

#### Port Already in Use
If you get port conflicts:
```bash
# Check what's using the ports
lsof -i :5173  # Frontend
lsof -i :3001  # Backend

# Kill processes if needed
npm run stop
```

#### Services Won't Start
```bash
# Clean and reinstall
npm run clean
npm run setup

# Try starting individually to isolate issues
npm run dev:frontend
npm run dev:backend
```

#### PM2 Issues
```bash
# Reset PM2 completely
npm run delete
pm2 kill
pm2 start ecosystem.config.js
```

### File Structure
```
theAuthority/
├── frontend/           # React + Vite frontend
├── backend/            # Express.js backend  
├── logs/              # Development logs
├── docs/              # Documentation
├── ecosystem.config.js # PM2 configuration
└── package.json       # Root package with dev scripts
```

### Environment Configuration

#### Backend (.env)
```bash
cd backend
cp env.example .env
# Edit .env with your settings
```

#### Frontend
No additional environment setup needed for development.

### Next Steps
After getting the development environment running:
1. Review the [Game Design Document](game_design_document.md)
2. Follow the [Vertical Slice Development Plan](vertical_slice_development_plan.md)
3. Check the [Development Todos](development_todos.md) for current tasks

---

*For more detailed information, see the individual documentation files in the `/docs` folder.*
