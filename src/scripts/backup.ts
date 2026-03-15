import { execSync } from 'child_process';
import fs from 'fs';
import { mkdir, readdir, stat, unlink } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Constants
const ROOT_DIR = process.cwd();
const BACKUP_ROOT = path.resolve(ROOT_DIR, 'backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const DB_BACKUP_FILE = path.join(BACKUP_ROOT, `db-backup-${TIMESTAMP}.sql`);
const MAX_BACKUPS = 10;

/**
 * Log with styling
 */
function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const colors = {
    reset: '\x1b[0m',
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warn: '\x1b[33m',    // Yellow
  };
  console.log(`${colors[type]}[${type.toUpperCase()}]${colors.reset} ${message}`);
}

async function runBackup() {
  try {
    log('Starting database backup process...', 'info');

    // 1. Ensure backup root exists
    if (!fs.existsSync(BACKUP_ROOT)) {
      await mkdir(BACKUP_ROOT, { recursive: true });
    }

    // 2. Backup Database
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not defined in .env');
    }

    log('Dumping database...', 'info');
    
    try {
      // Use pg_dump directly to the .sql file
      // We wrap the dump in gzip to keep it small, but still manageable
      // Command: pg_dump "url" | gzip > "file.sql.gz"
      const gzBackupFile = `${DB_BACKUP_FILE}.gz`;
      execSync(`pg_dump "${dbUrl}" | gzip > "${gzBackupFile}"`, { stdio: 'inherit' });
      log(`Database dump completed: ${path.basename(gzBackupFile)}`, 'success');
    } catch (err) {
      log('Failed to dump database. Ensure pg_dump and gzip are installed.', 'error');
      throw err;
    }

    // 3. Housekeeping: Remove old backups
    await cleanupOldBackups();

    log('Backup process completed successfully!', 'success');
  } catch (error) {
    log(`Backup failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

async function cleanupOldBackups() {
  const dirContents = await readdir(BACKUP_ROOT);
  const backupFiles = [];

  for (const file of dirContents) {
    if (file.endsWith('.sql.gz')) {
      const filePath = path.join(BACKUP_ROOT, file);
      const stats = await stat(filePath);
      backupFiles.push({
        name: file,
        path: filePath,
        time: stats.mtime.getTime()
      });
    }
  }

  backupFiles.sort((a, b) => b.time - a.time); // Newest first

  if (backupFiles.length > MAX_BACKUPS) {
    log(`Cleaning up ${String(backupFiles.length - MAX_BACKUPS)} old backups...`, 'info');
    const toDelete = backupFiles.slice(MAX_BACKUPS);
    for (const file of toDelete) {
      await unlink(file.path);
      log(`Deleted old backup: ${file.name}`, 'info');
    }
  }
}

// Start the backup process
void runBackup();
