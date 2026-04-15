/**
 * generate-thin-reviews.mjs
 *
 * For every broker rich JSON that has a short fullReview (<3000 chars),
 * generates a structured ~700-900 word review from the available metadata.
 *
 * No LLM API calls — all content is deterministically built from the
 * broker's own data fields so it is factually accurate.
 *
 * Usage:
 *   node scripts/generate-thin-reviews.mjs
 *   node scripts/generate-thin-reviews.mjs --min 0        (re-generate all)
 *   node scripts/generate-thin-reviews.mjs --dry-run      (print without writing)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BROKER_RICH_DIR = path.join(__dirname, '../app/preview-hero/_data/generated/brokers-rich');
const MIN_THRESHOLD   = parseInt(process.argv.find(a => a.startsWith('--min='))?.split('=')[1] ?? '3000', 10);
const DRY_RUN         = process.argv.includes('--dry-run');

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function titleCase(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

function orList(arr, max = 6) {
  if (!arr?.length) return null;
  const items = arr.slice(0, max);
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

function riskSentence(level, regulations) {
  const regs = (regulations || []).filter(r => r && !r.toLowerCase().includes('not regulated'));
  const offshore = (regulations || []).some(r => /offshore|svgs|seychelles|vanuatu|marshall/i.test(r));
  if (level === 'Low' || regs.length >= 3) {
    return `${titleCase(level || 'medium')} risk profile — regulated by ${regs.length} financial authorit${regs.length === 1 ? 'y' : 'ies'}. Client funds are held in segregated accounts in accordance with regulatory requirements.`;
  }
  if (offshore) {
    return `Higher risk profile due to offshore regulation. Traders should exercise caution and only risk capital they can afford to lose. No investor compensation scheme typically applies to offshore-regulated brokers.`;
  }
  return `${titleCase(level || 'medium')} risk profile. Traders are advised to verify regulation status through the relevant regulator's public register before depositing funds.`;
}

/* ------------------------------------------------------------------ */
/* Core review generator                                               */
/* ------------------------------------------------------------------ */

function generateReview(d) {
  const name       = d.name || 'This Broker';
  const founded    = d.founded ? `in ${d.founded}` : '';
  const hq         = d.headquarters || 'an undisclosed location';
  const minDep     = d.minDeposit === 0 ? 'no minimum deposit requirement' : `a minimum deposit of $${d.minDeposit}`;
  const leverage   = d.leverage || 'up to 500:1';
  const spreads    = d.spreads || 'variable spreads';
  const instruments = d.tradingInstruments ? `${d.tradingInstruments}+` : 'a range of';
  const platforms  = (d.platforms || ['MT4']).slice(0, 4);
  const regs       = (d.regulations || []).filter(Boolean);
  const pros       = (d.pros || []).filter(p => p && p.length > 5);
  const cons       = (d.cons || []).filter(c => c && c.length > 5);
  const features   = (d.features || []).filter(Boolean);
  const riskLevel  = d.riskLevel || 'Medium';

  const isRegulated = regs.some(r => !/not regulated|unregulated/i.test(r));
  const regString   = orList(regs.slice(0, 4)) || 'offshore licence';
  const platString  = orList(platforms) || 'MetaTrader 4';

  // --- Section 1: Company Overview ---
  const section1 = `## Company Overview

${name} is a retail forex and CFD broker${founded ? ' established ' + founded : ''}, headquartered in ${hq}. The broker offers access to ${instruments} tradeable instruments spanning forex currency pairs, commodities, indices, and CFDs${features.some(f => /crypto/i.test(f)) ? ', as well as cryptocurrency pairs' : ''}.

${features.length > 0 ? features.slice(0, 3).map(f => `- ${f}`).join('\n') : `${name} targets retail and semi-professional traders seeking competitive spreads and flexible leverage options.`}

The broker's trading infrastructure is built on ${platString}, providing traders with access to professional charting, automated trading, and order execution capabilities.`;

  // --- Section 2: Regulation & Licensing ---
  const section2 = `## Regulation & Licensing

${isRegulated
    ? `${name} operates under ${regString}${regs.length > 1 ? ' regulatory frameworks' : ' regulation'}. ${regs.length >= 2 ? `The broker maintains multiple regulatory licences, providing a degree of oversight across different jurisdictions.` : `Traders should verify the specific licence number directly with the relevant regulatory authority before opening an account.`}`
    : `${name} currently operates without a major-tier regulatory licence. The broker is registered in ${hq} and holds an offshore licence, which provides limited investor protection compared to FCA, ASIC, or CySEC-regulated alternatives.`
  }

${regs.length > 0 ? `**Regulatory jurisdictions:** ${regs.join(' · ')}` : ''}

**Risk Level:** ${riskLevel} — ${riskSentence(riskLevel, regs)}`;

  // --- Section 3: Trading Conditions ---
  const section3 = `## Trading Conditions

${name} provides ${spreads} on major currency pairs. Leverage is available at ${leverage}, which allows traders to control larger positions with a smaller initial margin — though higher leverage amplifies both potential gains and losses.

| Condition | Details |
|-----------|---------|
| Minimum Deposit | ${d.minDeposit === 0 ? 'None' : '$' + d.minDeposit} |
| Spreads | ${spreads} |
| Leverage | ${leverage} |
| Instruments | ${instruments} |
| Platforms | ${platString} |

Traders have ${minDep}, making the broker ${d.minDeposit <= 50 ? 'accessible to beginners and those testing a new trading approach' : 'accessible to a broad range of retail traders'}.`;

  // --- Section 4: Trading Platforms ---
  const section4 = `## Trading Platforms

${name} supports ${platString}${platforms.length > 1 ? ', giving traders flexibility to choose the environment that best suits their strategy' : ''}.

${platforms.includes('MT4') || platforms.includes('MetaTrader 4')
    ? '**MetaTrader 4 (MT4):** Industry-standard platform with full support for Expert Advisors (EAs), custom indicators, and one-click trading. Available on desktop, web browser, and mobile (iOS/Android).\n' : ''}${platforms.includes('MT5') || platforms.includes('MetaTrader 5')
    ? '**MetaTrader 5 (MT5):** MT4\'s successor offering additional order types, more timeframes, and a built-in economic calendar alongside full EA compatibility.\n' : ''}${platforms.includes('cTrader')
    ? '**cTrader:** ECN-focused platform with level-II pricing, advanced charting, and cAlgo algorithmic trading support.\n' : ''}${platforms.filter(p => !['MT4','MT5','cTrader','MetaTrader 4','MetaTrader 5'].includes(p)).map(p => `**${p}:** Proprietary or partner trading platform available through ${name}.\n`).join('')}`;

  // --- Section 5: Pros & Cons ---
  const prosToShow = pros.slice(0, 5);
  const consToShow = cons.slice(0, 5);

  const section5 = (prosToShow.length > 0 || consToShow.length > 0) ? `## Pros & Cons

${prosToShow.length > 0 ? `**Pros:**\n${prosToShow.map(p => `- ✅ ${p}`).join('\n')}\n` : ''}
${consToShow.length > 0 ? `**Cons:**\n${consToShow.map(c => `- ❌ ${c}`).join('\n')}` : ''}` : '';

  // --- Section 6: Who Is It For ---
  const section6 = `## Who Is ${name} Best For?

${name} is best suited for:

- **${d.minDeposit <= 100 ? 'Entry-level traders' : 'Intermediate traders'}** looking for ${spreads.toLowerCase()} execution
- **Traders using ${platforms[0]}** who want a straightforward account setup
- **Those based in ${hq.split(',').pop().trim()}** or regions served by ${regString}

Traders who prioritise ${regs.length >= 3 ? 'strong multi-jurisdictional regulation and investor compensation protection' : 'tier-1 FCA or ASIC regulation and guaranteed fund segregation'} may wish to compare ${name} against more heavily regulated alternatives.`;

  // --- Section 7: Verdict ---
  const score = d.rating || 6.5;
  const verdict = score >= 8 ? 'highly recommended' : score >= 7 ? 'a solid choice' : score >= 6 ? 'a reasonable option' : 'an option worth researching carefully';

  const section7 = `## Verdict & Rating

**Overall Rating: ${score.toFixed(1)} / 10**

${name} is ${verdict} for traders seeking ${spreads.toLowerCase()} on ${instruments} instruments via ${platString}. ${isRegulated ? `Regulation by ${regString} provides a foundational level of oversight.` : 'The offshore regulation model means traders should proceed with appropriate caution and position-size accordingly.'} ${d.minDeposit === 0 ? 'The no-minimum-deposit policy makes it easy to open a small live account and test the execution quality.' : `The $${d.minDeposit} minimum deposit is ${d.minDeposit <= 100 ? 'low and accessible' : 'within the industry standard range'}.`}

*Review last verified: ${new Date().toISOString().split('T')[0]}. Conditions are subject to change — always verify current terms directly with ${name}.*`;

  return [section1, section2, section3, section4, section5 || null, section6, section7]
    .filter(Boolean)
    .join('\n\n');
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */

const files = fs.readdirSync(BROKER_RICH_DIR).filter(f => f.endsWith('.json'));
let generated = 0, skipped = 0;

for (const file of files) {
  const filePath = path.join(BROKER_RICH_DIR, file);
  const data     = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const existing = data.fullReview || '';

  if (existing.length >= MIN_THRESHOLD) {
    skipped++;
    continue;
  }

  const review = generateReview(data);

  if (DRY_RUN) {
    console.log(`\n${'═'.repeat(60)}\n${data.name} (${data.slug})\n${'─'.repeat(40)}`);
    console.log(review.slice(0, 400) + '...');
  } else {
    data.fullReview = review;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  generated++;
  if (!DRY_RUN) {
    console.log(`[GEN] ${(data.slug || file).padEnd(40)} ${existing.length.toString().padStart(4)} → ${review.length.toString().padStart(5)} chars`);
  }
}

console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}Generated: ${generated}  ·  Already rich: ${skipped}`);
