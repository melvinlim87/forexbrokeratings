import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local (project root) and then .env as fallback
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config()

// Configuration via environment variables
// Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Optional: TABLES_TO_BACKUP (comma-separated list). If absent, script will exit with an error.
// Optional: BACKUP_DIR (default: ./backups)
// Optional: BATCH_SIZE (default: 1000)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const TABLES_ENV = process.env.TABLES_TO_BACKUP || ''
const BACKUP_DIR = process.env.BACKUP_DIR || path.resolve(__dirname, '../backups')
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 1000)

if (!supabaseUrl || !supabaseKey) {
  console.error('[backup-supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

async function fetchAllRows(table) {
  // First get count
  const { count, error: countError } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })

  if (countError) {
    throw new Error(`Failed to count rows for ${table}: ${countError.message}`)
  }

  const total = count || 0
  const results = []

  for (let from = 0; from < total; from += BATCH_SIZE) {
    const to = Math.min(from + BATCH_SIZE - 1, total - 1)
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(from, to)

    if (error) {
      throw new Error(`Failed to fetch rows for ${table} [${from}-${to}]: ${error.message}`)
    }

    if (data && data.length) {
      results.push(...data)
    }
  }

  return results
}

export async function backupSupabase() {
  const today = new Date()
  const todayName = formatDate(today)
  const backupFile = path.join(BACKUP_DIR, `${todayName}.json`)

  // Ensure backup directory exists
  fs.mkdirSync(BACKUP_DIR, { recursive: true })

  // Determine tables to backup
  const tables = TABLES_ENV
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  if (!tables.length) {
    throw new Error('No tables specified. Set TABLES_TO_BACKUP to a comma-separated list of table names.')
  }

  console.log(`[backup-supabase] Backup dir: ${BACKUP_DIR}`)
  console.log(`[backup-supabase] Tables: ${tables.join(', ')}`)

  const payload = {
    _meta: {
      generatedAt: new Date().toISOString(),
      tables,
      batchSize: BATCH_SIZE,
    },
    data: {},
  }

  // Export each table
  for (const table of tables) {
    // eslint-disable-next-line no-console
    console.log(`[backup-supabase] Exporting table: ${table}`)
    const rows = await fetchAllRows(table)
    payload.data[table] = rows
  }

  // Write backup file
  fs.writeFileSync(backupFile, JSON.stringify(payload, null, 2), 'utf-8')
  // eslint-disable-next-line no-console
  console.log(`[backup-supabase] Wrote backup: ${backupFile}`)

  // Delete backup from 7 days ago
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 3)
  const oldName = formatDate(sevenDaysAgo)
  const oldFile = path.join(BACKUP_DIR, `${oldName}.json`)

  if (fs.existsSync(oldFile)) {
    fs.unlinkSync(oldFile)
    // eslint-disable-next-line no-console
    console.log(`[backup-supabase] Deleted old backup: ${oldFile}`)
  } else {
    // eslint-disable-next-line no-console
    console.log(`[backup-supabase] No old backup to delete for: ${oldName}.json`)
  }
}

// Allow running directly from Node
if (import.meta.url === `file://${__filename}`) {
  backupSupabase()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('[backup-supabase] Backup completed successfully.')
      process.exit(0)
    })
    .catch((err) => {
      console.error('[backup-supabase] Backup failed:', err)
      process.exit(1)
    })
} else {
  console.log('not running backupSupabase function')
  backupSupabase()
}
