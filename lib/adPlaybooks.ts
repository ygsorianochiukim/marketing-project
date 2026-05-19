/**
 * Goal-fit catalog. Each of the 16 ad templates is mapped to the KPI it's
 * best optimized for:
 *
 *   - engagement   → cost-per-message (Messenger replies)
 *   - reach        → impressions / shares / brand recall
 *   - reactivation → warm-audience re-engagement
 *
 * This classification surfaces in:
 *   - the dashboard job cards (a chip on each rendering job)
 *   - boost-stats "BY GOAL" tab (campaigns grouped by goal, scored by the
 *     KPI appropriate to their template)
 *
 * No user-facing toggle — the bot doesn't ask agents to pick a goal; the
 * goal is derived structurally from which template the brief flow chose.
 */

export type CampaignGoal = 'engagement' | 'reach' | 'reactivation'

export interface GoalConfig {
  goal: CampaignGoal
  label: string
  emoji: string
  description: string
  // KPI to use when scoring campaigns of this goal in boost-stats.
  primaryKpi: 'costPerMessage' | 'cpm' | 'reach'
  // Winner / loser thresholds for the primary KPI. For costPerMessage and
  // cpm: lower is better. For reach: higher is better.
  winnerThreshold: number
  loserThreshold: number
  // Templates that belong to this goal, in expected-performance order.
  templates: string[]
}

export const GOALS: Record<CampaignGoal, GoalConfig> = {
  engagement: {
    goal: 'engagement',
    label: 'Engagement',
    emoji: '📨',
    description: 'Maximize Messenger replies. Winner: cost-per-message under ₱100.',
    primaryKpi: 'costPerMessage',
    winnerThreshold: 100,
    loserThreshold: 250,
    templates: [
      'CONVERSATIONAL_TEMPLATE',
      'SOFT_DR_TEMPLATE',
      'AUTHORITY_TEMPLATE',
      'EDUCATIONAL_TEMPLATE',
      'OFFER_PROMO_TEMPLATE',
    ],
  },
  reach: {
    goal: 'reach',
    label: 'Reach',
    emoji: '📣',
    description: 'Maximize impressions and brand recall. Winner: cost per 1,000 impressions (CPM) under ₱30.',
    primaryKpi: 'cpm',
    winnerThreshold: 30,
    loserThreshold: 80,
    templates: [
      'VISUAL_METAPHOR_TEMPLATE',
      'WITTY_FILIPINO_TEMPLATE',
      'LIFESTYLE_TEMPLATE',
      'STORY_TEMPLATE',
      'LIGHT_EMOTIONAL_TEMPLATE',
    ],
  },
  reactivation: {
    goal: 'reactivation',
    label: 'Reactivation',
    emoji: '🎯',
    description: 'Bring back warm audiences. Winner: cost-per-message under ₱150 (more forgiving than engagement on cold).',
    primaryKpi: 'costPerMessage',
    winnerThreshold: 150,
    loserThreshold: 300,
    templates: [
      'RETARGETING_TEMPLATE',
      'OFFER_PROMO_TEMPLATE',
      'EDUCATIONAL_TEMPLATE',
      'AUTHORITY_TEMPLATE',
    ],
  },
}

/**
 * Map a template key to its primary goal. When a template belongs to
 * multiple goals (e.g. OFFER_PROMO is in both engagement + reactivation),
 * the assignment below picks the one where the template performs best.
 *
 * Built once at import time — O(1) lookups.
 */
const TEMPLATE_TO_GOAL: Record<string, CampaignGoal> = {
  // Engagement-first templates
  CONVERSATIONAL_TEMPLATE: 'engagement',
  SOFT_DR_TEMPLATE: 'engagement',
  AUTHORITY_TEMPLATE: 'engagement',
  EDUCATIONAL_TEMPLATE: 'engagement',
  OFFER_PROMO_TEMPLATE: 'engagement',
  DIRECT_RESPONSE_TEMPLATE: 'engagement',

  // Reach-first templates
  VISUAL_METAPHOR_TEMPLATE: 'reach',
  WITTY_FILIPINO_TEMPLATE: 'reach',
  LIFESTYLE_TEMPLATE: 'reach',
  STORY_TEMPLATE: 'reach',
  LIGHT_EMOTIONAL_TEMPLATE: 'reach',
  EMOTIONAL_TEMPLATE: 'reach',
  PROBLEM_SOLUTION_TEMPLATE: 'reach',
  COMPARISON_TEMPLATE: 'reach',

  // Reactivation-first templates
  RETARGETING_TEMPLATE: 'reactivation',
}

export function templateGoalFit(templateKey: string | null | undefined): CampaignGoal | null {
  if (!templateKey) return null
  return TEMPLATE_TO_GOAL[templateKey] ?? null
}

export function goalConfig(goal: CampaignGoal): GoalConfig {
  return GOALS[goal]
}

/**
 * Evaluates a campaign against the KPI thresholds for its template's goal.
 * Returns the tier label ("winner" / "mid" / "loser" / "ramping"), the
 * KPI value used, and a short human-readable reason.
 *
 * Templates without a goal mapping (e.g. a custom prompt) get null —
 * caller should fall back to the legacy unified ₱/msg scoring.
 */
export function evaluateByGoal(
  campaign: {
    templateKey?: string | null
    costPerMessage: number
    messagingConversations: number
    cpm: number
    reach: number
    spend: number
  },
): { tier: 'winner' | 'mid' | 'loser' | 'ramping'; kpiValue: number; goal: CampaignGoal; reason: string } | null {
  const goal = templateGoalFit(campaign.templateKey)
  if (!goal) return null
  const config = GOALS[goal]

  // Ramping: too little spend to judge — apply uniformly.
  if (campaign.spend < 100) {
    return {
      tier: 'ramping',
      kpiValue: campaign[config.primaryKpi],
      goal,
      reason: `Under ₱100 spend — too early to judge.`,
    }
  }

  const value = campaign[config.primaryKpi]
  const lowerIsBetter = config.primaryKpi !== 'reach'

  let tier: 'winner' | 'mid' | 'loser'
  if (lowerIsBetter) {
    if (value > 0 && value < config.winnerThreshold) tier = 'winner'
    else if (value > config.loserThreshold) tier = 'loser'
    else tier = 'mid'
  } else {
    if (value > config.loserThreshold) tier = 'winner' // higher = better
    else if (value < config.winnerThreshold) tier = 'loser'
    else tier = 'mid'
  }

  const kpiLabel =
    config.primaryKpi === 'costPerMessage' ? `₱${value.toFixed(0)}/msg` :
    config.primaryKpi === 'cpm' ? `₱${value.toFixed(0)} / 1K imp` :
    `${value.toLocaleString()} reach`

  const reason =
    tier === 'winner' ? `${kpiLabel} beats ${config.label} winner threshold` :
    tier === 'loser' ? `${kpiLabel} worse than ${config.label} loser threshold` :
    `${kpiLabel} in the middle band for ${config.label}`

  return { tier, kpiValue: value, goal, reason }
}
