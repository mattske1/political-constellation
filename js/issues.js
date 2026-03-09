/* ============================================
   Political Constellation — Issue Definitions
   ============================================

   This file defines the issue catalogue and creates
   the runtime state object used by all other modules.

   To add or remove issues, edit ISSUE_DEFINITIONS.
   Everything else adapts automatically.
   ============================================ */

/**
 * Each entry:
 *   key        — internal ID (lowercase, no spaces)
 *   name       — display label
 *   leftLabel  — left end of Position slider
 *   rightLabel — right end of Position slider
 */
var ISSUE_DEFINITIONS = [
  { key: 'healthcare',  name: 'Healthcare',     leftLabel: 'Universal',         rightLabel: 'Market-Based' },
  { key: 'abortion',    name: 'Abortion',       leftLabel: 'Pro-Choice',        rightLabel: 'Pro-Life' },
  { key: 'guns',        name: 'Gun Rights',     leftLabel: 'Gun Control',       rightLabel: 'Gun Rights' },
  { key: 'immigration', name: 'Immigration',    leftLabel: 'Open',              rightLabel: 'Restrictive' },
  { key: 'climate',     name: 'Climate Policy', leftLabel: 'Aggressive Action', rightLabel: 'Market Solutions' },
  { key: 'taxes',       name: 'Taxation',       leftLabel: 'Higher Taxes',      rightLabel: 'Lower Taxes' }
];

/**
 * Build the live state object from definitions.
 * Returns { healthcare: { position:50, authority:50, commitment:50, priority:50 }, ... }
 *
 * @param {Array} defs  ISSUE_DEFINITIONS or a custom array with the same shape
 * @returns {Object}
 */
function createIssueState(defs) {
  var state = {};
  defs.forEach(function (def) {
    state[def.key] = { position: 50, authority: 50, commitment: 50, priority: 50 };
  });
  return state;
}
