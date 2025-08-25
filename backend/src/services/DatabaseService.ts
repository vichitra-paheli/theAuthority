import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';
import { GameState, DemographicState, Email, Policy, Event } from '../types/GameTypes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DatabaseService {
  private db: Database.Database;
  private dbPath: string;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || process.env.DB_PATH || path.join(__dirname, '../../data/game.db');
    
    // Ensure data directory exists
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(this.dbPath);
    this.initialize();
    
    logger.info('Database service initialized', { dbPath: this.dbPath });
  }

  /**
   * Initialize database schema
   */
  private initialize(): void {
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
    
    // Create tables
    this.createTables();
    
    logger.info('Database schema initialized');
  }

  /**
   * Create database tables
   */
  private createTables(): void {
    // Game saves table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS game_saves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT NOT NULL,
        save_name TEXT NOT NULL,
        turn_number INTEGER NOT NULL,
        game_state TEXT NOT NULL, -- JSON
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player_name, save_name)
      )
    `);

    // Demographics table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS demographics (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        persona TEXT NOT NULL,
        population_percentage REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Demographic states table (per game save)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS demographic_states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_save_id INTEGER NOT NULL,
        demographic_id TEXT NOT NULL,
        happiness REAL NOT NULL,
        support_level REAL NOT NULL,
        concerns TEXT NOT NULL, -- JSON array
        last_policy_reaction TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_save_id) REFERENCES game_saves (id) ON DELETE CASCADE,
        FOREIGN KEY (demographic_id) REFERENCES demographics (id),
        UNIQUE(game_save_id, demographic_id)
      )
    `);

    // Emails table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS emails (
        id TEXT PRIMARY KEY,
        game_save_id INTEGER NOT NULL,
        from_address TEXT NOT NULL,
        from_name TEXT NOT NULL,
        to_address TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        timestamp DATETIME NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('issue', 'result', 'event', 'notification')),
        requires_response BOOLEAN NOT NULL DEFAULT 0,
        read BOOLEAN NOT NULL DEFAULT 0,
        archived BOOLEAN NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_save_id) REFERENCES game_saves (id) ON DELETE CASCADE
      )
    `);

    // Policies table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS policies (
        id TEXT PRIMARY KEY,
        game_save_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        proposed_at DATETIME NOT NULL,
        enacted_at DATETIME,
        status TEXT NOT NULL CHECK (status IN ('proposed', 'enacted', 'rejected')),
        effects TEXT NOT NULL, -- JSON
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_save_id) REFERENCES game_saves (id) ON DELETE CASCADE
      )
    `);

    // Events table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        game_save_id INTEGER,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('economic', 'social', 'environmental', 'political')),
        probability REAL NOT NULL,
        trigger_conditions TEXT NOT NULL, -- JSON
        effects TEXT NOT NULL, -- JSON
        duration INTEGER,
        start_turn INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_save_id) REFERENCES game_saves (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_game_saves_player ON game_saves (player_name);
      CREATE INDEX IF NOT EXISTS idx_demographic_states_game ON demographic_states (game_save_id);
      CREATE INDEX IF NOT EXISTS idx_emails_game ON emails (game_save_id);
      CREATE INDEX IF NOT EXISTS idx_emails_unread ON emails (game_save_id, read);
      CREATE INDEX IF NOT EXISTS idx_policies_game ON policies (game_save_id);
      CREATE INDEX IF NOT EXISTS idx_events_game ON events (game_save_id);
    `);
  }

  /**
   * Create a new game save
   */
  createGameSave(playerName: string, saveName: string, initialGameState: GameState): number {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO game_saves (player_name, save_name, turn_number, game_state, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    const result = stmt.run(
      playerName,
      saveName,
      initialGameState.turnNumber,
      JSON.stringify(initialGameState)
    );
    
    const gameSaveId = result.lastInsertRowid as number;
    
    logger.info('Game save created', { gameSaveId, playerName, saveName });
    return gameSaveId;
  }

  /**
   * Load a game save
   */
  loadGameSave(playerName: string, saveName: string): GameState | null {
    const stmt = this.db.prepare(`
      SELECT game_state FROM game_saves 
      WHERE player_name = ? AND save_name = ?
    `);
    
    const row = stmt.get(playerName, saveName) as { game_state: string } | undefined;
    
    if (!row) {
      return null;
    }
    
    try {
      return JSON.parse(row.game_state) as GameState;
    } catch (error) {
      logger.error('Failed to parse game state', { playerName, saveName, error });
      return null;
    }
  }

  /**
   * Update game save
   */
  updateGameSave(playerName: string, saveName: string, gameState: GameState): boolean {
    const stmt = this.db.prepare(`
      UPDATE game_saves 
      SET turn_number = ?, game_state = ?, updated_at = CURRENT_TIMESTAMP
      WHERE player_name = ? AND save_name = ?
    `);
    
    const result = stmt.run(
      gameState.turnNumber,
      JSON.stringify(gameState),
      playerName,
      saveName
    );
    
    return result.changes > 0;
  }

  /**
   * Get all save files for a player
   */
  getPlayerSaves(playerName: string): Array<{ saveName: string; turnNumber: number; updatedAt: string }> {
    const stmt = this.db.prepare(`
      SELECT save_name, turn_number, updated_at
      FROM game_saves 
      WHERE player_name = ?
      ORDER BY updated_at DESC
    `);
    
    return stmt.all(playerName) as Array<{ saveName: string; turnNumber: number; updatedAt: string }>;
  }

  /**
   * Add email to game
   */
  addEmail(gameSaveId: number, email: Omit<Email, 'id'>): string {
    const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const stmt = this.db.prepare(`
      INSERT INTO emails (
        id, game_save_id, from_address, from_name, to_address, subject, body,
        timestamp, type, requires_response, read, archived
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      emailId,
      gameSaveId,
      email.from,
      email.fromName,
      email.to,
      email.subject,
      email.body,
      email.timestamp.toISOString(),
      email.type,
      email.requiresResponse ? 1 : 0,
      email.read ? 1 : 0,
      email.archived ? 1 : 0
    );
    
    return emailId;
  }

  /**
   * Get emails for a game
   */
  getEmails(gameSaveId: number, limit: number = 50): Email[] {
    const stmt = this.db.prepare(`
      SELECT * FROM emails 
      WHERE game_save_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    
    const rows = stmt.all(gameSaveId, limit) as any[];
    
    return rows.map(row => ({
      id: row.id,
      from: row.from_address,
      fromName: row.from_name,
      to: row.to_address,
      subject: row.subject,
      body: row.body,
      timestamp: new Date(row.timestamp),
      type: row.type,
      requiresResponse: Boolean(row.requires_response),
      read: Boolean(row.read),
      archived: Boolean(row.archived),
    }));
  }

  /**
   * Mark email as read
   */
  markEmailAsRead(emailId: string): boolean {
    const stmt = this.db.prepare('UPDATE emails SET read = 1 WHERE id = ?');
    const result = stmt.run(emailId);
    return result.changes > 0;
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
    logger.info('Database connection closed');
  }

  /**
   * Get database health status
   */
  healthCheck(): { status: 'ok' | 'error'; message: string } {
    try {
      const result = this.db.prepare('SELECT 1 as test').get() as { test: number };
      return result.test === 1 
        ? { status: 'ok', message: 'Database connection healthy' }
        : { status: 'error', message: 'Database query failed' };
    } catch (error) {
      return { 
        status: 'error', 
        message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
