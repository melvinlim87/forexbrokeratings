/**
 * enrich-fullreview.mjs
 *
 * Backfills `fullReview` in every brokers-rich JSON with the full verbatim
 * content from C:\OpenclawAISE\Forex Brokers\deep-dive\
 *
 * And backfills `fullReview` in every prop-firms-rich JSON from
 * C:\OpenclawAISE\Forex Brokers\Prop Firms\data\
 *
 * Rules:
 *  - Never truncate / summarise — always use the source file in full.
 *  - If an extensive (-extensive.md) and a standard version both exist,
 *    prefer extensive, but also append standard if it adds unique content.
 *  - Only update a file when the new content is longer than what is stored.
 *  - Print a match/miss report at the end.
 *
 * Usage:
 *   node scripts/enrich-fullreview.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/* ------------------------------------------------------------------ */
/* Paths                                                                */
/* ------------------------------------------------------------------ */
const BROKER_RICH_DIR   = path.join(ROOT, 'app/preview-hero/_data/generated/brokers-rich');
const PROP_RICH_DIR     = path.join(ROOT, 'app/preview-hero/_data/generated/prop-firms-rich');
const DEEP_DIVE_DIR     = path.resolve('C:/OpenclawAISE/Forex Brokers/deep-dive');
const PROP_DATA_DIR     = path.resolve('C:/OpenclawAISE/Forex Brokers/Prop Firms/data');

/* ------------------------------------------------------------------ */
/* Slug helpers                                                         */
/* ------------------------------------------------------------------ */

/** Convert any filename/string to a normalised kebab slug. */
function toSlug(s) {
  return s
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Strip known trailing noise words to find a shorter slug candidate. */
function stripNoise(slug) {
  return slug
    .replace(/-extensive$/, '')
    .replace(/-deep-extensive$/, '')
    .replace(/-deep$/, '')
    .replace(/-detailed$/, '')
    .replace(/-review$/, '')
    .replace(/-deep-dive$/, '')
    .replace(/-au$/, '')
    .replace(/-uk$/, '')
    .replace(/-eu$/, '')
    .replace(/-us$/, '')
    .replace(/-cy$/, '');
}

/**
 * Known mismatches: source file slug (after noise-strip) → rich JSON slug.
 * Add entries here whenever the filename doesn't derive to the right slug.
 */
const MANUAL_MAP = {
  'ig-group'            : 'ig',
  'interactive-brokers' : 'interactive-brokers',
  'etrade-forex'        : 'etrade',
  'fxpro-cyprus'        : 'fxpro',
  'saxo-bank-detailed'  : 'saxo-bank',
  'saxo-bank-deep'      : 'saxo-bank',
  'acy-securities'      : 'acy-securities',
  'pepperstone-deep'    : 'pepperstone',
  'pepperstone-au'      : 'pepperstone',
  'pepperstone-uk'      : 'pepperstone',
  'xm-group'            : 'xm',
  'oanda-deep'          : 'oanda',
  'aafx-trading'        : 'aaafx',
  'admiral-markets-review': 'admiral-markets',
  'vantage-fx'          : 'vantage',
  'tickmill-uk'         : 'tickmill',
  'pu-prime'            : 'pu-prime',
  'cmc-markets'         : 'cmc-markets',
  'citytradersimperium' : 'city-traders-imperium',
  'audacitycapital'     : 'audacity-capital',
  'blueguardian'        : 'blue-guardian',
  'blueberryfunded'     : 'blueberry-funded',
  'brightfunded'        : 'bright-funded',
};

/* ------------------------------------------------------------------ */
/* Build source file index                                              */
/* ------------------------------------------------------------------ */

/**
 * Returns a Map<slug, { extensive: string|null, standard: string|null }>
 * where values are absolute file paths.
 */
function buildSourceIndex(dir, pattern = /\.md$/i) {
  const index = new Map(); // slug → { extensive, standard }

  if (!fs.existsSync(dir)) {
    console.warn(`[WARN] Source dir not found: ${dir}`);
    return index;
  }

  for (const file of fs.readdirSync(dir)) {
    if (!pattern.test(file)) continue;

    const base = file.replace(/\.md$/i, '');
    const isExtensive = base.endsWith('-extensive') ||
                        base.endsWith('-deep-extensive') ||
                        base.includes('-deep-dive-extensive');

    // Derive a normalised slug for this file
    let slug = toSlug(stripNoise(base));

    // Apply manual map if exists
    slug = MANUAL_MAP[slug] ?? slug;

    const fullPath = path.join(dir, file);

    if (!index.has(slug)) index.set(slug, { extensive: null, standard: null });
    const entry = index.get(slug);

    if (isExtensive) {
      // Keep the largest extensive file if multiple
      if (!entry.extensive || fs.statSync(fullPath).size > fs.statSync(entry.extensive).size) {
        entry.extensive = fullPath;
      }
    } else {
      if (!entry.standard || fs.statSync(fullPath).size > fs.statSync(entry.standard).size) {
        entry.standard = fullPath;
      }
    }
  }

  return index;
}

/** Read and merge: extensive first, append standard only if it adds unique paragraphs. */
function readBestContent(entry) {
  const parts = [];

  if (entry.extensive) {
    parts.push(fs.readFileSync(entry.extensive, 'utf8').trim());
  }

  if (entry.standard) {
    const std = fs.readFileSync(entry.standard, 'utf8').trim();
    // Only add the standard content if it's not already subsumed by extensive.
    // Quick heuristic: if std is substantially different in its first 300 chars, append.
    if (!entry.extensive) {
      parts.push(std);
    } else {
      const extStart = parts[0].slice(0, 300);
      const stdStart = std.slice(0, 300);
      if (extStart !== stdStart && std.length > 500) {
        // Append standard as a supplementary section
        parts.push('\n\n---\n\n' + std);
      }
    }
  }

  return parts.join('\n\n').trim();
}

/* ------------------------------------------------------------------ */
/* Process brokers                                                      */
/* ------------------------------------------------------------------ */

function enrichBrokers() {
  console.log('\n═══ BROKERS ═══');
  const sourceIndex = buildSourceIndex(DEEP_DIVE_DIR);
  console.log(`  Source index: ${sourceIndex.size} unique slugs from ${DEEP_DIVE_DIR}`);

  const richFiles = fs.readdirSync(BROKER_RICH_DIR).filter(f => f.endsWith('.json'));
  console.log(`  Rich JSONs:   ${richFiles.length} brokers\n`);

  let updated = 0, skipped = 0, noMatch = 0;
  const unmatched = [];

  for (const file of richFiles) {
    const filePath = path.join(BROKER_RICH_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const slug = data.slug || file.replace('.json', '');

    // Find matching source
    let entry = sourceIndex.get(slug);

    // Try progressively stripped slugs
    if (!entry) {
      const stripped = stripNoise(slug);
      entry = sourceIndex.get(stripped);
    }

    if (!entry) {
      noMatch++;
      unmatched.push(slug);
      continue;
    }

    const newContent = readBestContent(entry);
    const existing = data.fullReview || '';

    if (newContent.length > existing.length) {
      data.fullReview = newContent;
      // Derive better pros/cons if they are placeholder-only
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      updated++;
      console.log(`  [UPDATE] ${slug.padEnd(40)} ${existing.length.toString().padStart(6)} → ${newContent.length.toString().padStart(6)} chars  (+${newContent.length - existing.length})`);
    } else {
      skipped++;
    }
  }

  console.log(`\n  Done: ${updated} updated · ${skipped} already optimal · ${noMatch} no source match`);
  if (unmatched.length > 0) {
    console.log(`\n  Unmatched slugs (first 30):`);
    unmatched.slice(0, 30).forEach(s => console.log(`    - ${s}`));
  }
}

/* ------------------------------------------------------------------ */
/* Process prop firms                                                   */
/* ------------------------------------------------------------------ */

function enrichPropFirms() {
  console.log('\n═══ PROP FIRMS ═══');

  // Build index from Prop Firms/data/ — only the *-deep-dive-extensive.md files
  const mdIndex = buildSourceIndex(PROP_DATA_DIR, /-deep-dive-extensive\.md$/i);
  console.log(`  Source index: ${mdIndex.size} unique slugs from ${PROP_DATA_DIR}`);

  const richFiles = fs.readdirSync(PROP_RICH_DIR).filter(f => f.endsWith('.json'));
  console.log(`  Rich JSONs:   ${richFiles.length} prop firms\n`);

  let updated = 0, skipped = 0, noMatch = 0;
  const unmatched = [];

  for (const file of richFiles) {
    const filePath = path.join(PROP_RICH_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const slug = data.slug || file.replace('.json', '');

    let entry = mdIndex.get(slug);

    if (!entry) {
      const stripped = stripNoise(slug);
      entry = mdIndex.get(stripped);
    }

    if (!entry) {
      // Also try checking the Prop Firms/data/ JSON files for review_content
      const srcJson = path.join(PROP_DATA_DIR, `${slug}.json`);
      if (fs.existsSync(srcJson)) {
        try {
          const srcData = JSON.parse(fs.readFileSync(srcJson, 'utf8'));
          const srcContent = srcData.review_content || srcData.fullReview || '';
          const existing = data.fullReview || data.review_content || '';
          if (srcContent.length > existing.length) {
            // Merge all structured fields too
            Object.keys(srcData).forEach(k => {
              if (!['slug', 'id', '_provenance', '_mergeLog'].includes(k)) {
                if (srcData[k] !== undefined && srcData[k] !== null) {
                  // Prefer longer arrays/strings
                  if (typeof srcData[k] === 'string' && typeof data[k] === 'string') {
                    if (srcData[k].length > data[k].length) data[k] = srcData[k];
                  } else if (Array.isArray(srcData[k]) && Array.isArray(data[k])) {
                    if (srcData[k].length > data[k].length) data[k] = srcData[k];
                  } else if (data[k] === undefined || data[k] === null) {
                    data[k] = srcData[k];
                  }
                }
              }
            });
            if (!data.fullReview || srcContent.length > (data.fullReview||'').length) {
              data.fullReview = srcContent;
            }
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            updated++;
            console.log(`  [UPDATE/JSON] ${slug.padEnd(40)} via .json source`);
          } else {
            skipped++;
          }
        } catch { noMatch++; unmatched.push(slug); }
      } else {
        noMatch++;
        unmatched.push(slug);
      }
      continue;
    }

    const newContent = readBestContent(entry);
    const existing = data.fullReview || data.review_content || '';

    if (newContent.length > existing.length) {
      data.fullReview = newContent;
      if (!data.review_content) data.review_content = newContent;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      updated++;
      console.log(`  [UPDATE] ${slug.padEnd(40)} ${existing.length.toString().padStart(6)} → ${newContent.length.toString().padStart(6)} chars  (+${newContent.length - existing.length})`);
    } else {
      skipped++;
    }
  }

  console.log(`\n  Done: ${updated} updated · ${skipped} already optimal · ${noMatch} no source match`);
  if (unmatched.length > 0) {
    console.log(`\n  Unmatched prop firm slugs (first 20):`);
    unmatched.slice(0, 20).forEach(s => console.log(`    - ${s}`));
  }
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */

console.log('══════════════════════════════════════════════════════');
console.log('  enrich-fullreview — backfilling verbatim source content');
console.log('══════════════════════════════════════════════════════');

enrichBrokers();
enrichPropFirms();

console.log('\n✓ Enrichment complete.\n');
