/**
 * Fetches agent profiles from the Laravel core-system for co-branding
 * generated ads. Lookup is by Discord CHANNEL ID — each Discord channel
 * in core-system is mapped to exactly one agent via the
 * `wbs_i_agent_discord_channels` table. The bot looks up whichever agent
 * "owns" the channel a brief was submitted in.
 *
 * Uses a 5-minute in-memory cache so we don't hit the API on every brief.
 * Negative results (404 / no agent) are also cached to avoid hammering
 * the API when a non-agent channel posts.
 */

import type { AgentProfile } from '@/types'

export type { AgentProfile }

type CacheEntry = { agent: AgentProfile | null; expires: number }
const CACHE = new Map<string, CacheEntry>()
const TTL_MS = 5 * 60 * 1000

// TODO(sir-marv): swap the path segment below for the actual endpoint your
// coworker exposes. The base URL is `process.env.CORE_SYSTEM_API_URL`.
// Expected response shape (verified against the screenshot):
// {
//   success: true,
//   data: [{
//     wbs_i_agent_discord_channel_id, wbs_i_agent_id,
//     discord_channel_id, discord_channel_name, is_active, date_created,
//     agent: { wbs_i_agent_id, full_name, discord_id, phone, is_active }
//   }]
// }
const ENDPOINT_PATH = '/agent/discord-channels'
const QUERY_PARAM = 'discord_channel_id'

export async function fetchAgentByChannelId(discordChannelId: string): Promise<AgentProfile | null> {
  const cached = CACHE.get(discordChannelId)
  if (cached && cached.expires > Date.now()) return cached.agent

  const base = process.env.CORE_SYSTEM_API_URL
  if (!base) {
    console.warn('[agentStore] CORE_SYSTEM_API_URL not set — co-branding disabled')
    return null
  }

  const url = `${base.replace(/\/$/, '')}${ENDPOINT_PATH}?${QUERY_PARAM}=${encodeURIComponent(discordChannelId)}`

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })

    if (res.status === 404) {
      CACHE.set(discordChannelId, { agent: null, expires: Date.now() + TTL_MS })
      return null
    }

    if (!res.ok) {
      console.warn(`[agentStore] HTTP ${res.status} for discord_channel_id=${discordChannelId}`)
      return null
    }

    const body = await res.json()
    if (!body?.success || !Array.isArray(body?.data) || body.data.length === 0) {
      CACHE.set(discordChannelId, { agent: null, expires: Date.now() + TTL_MS })
      return null
    }

    // Take the first channel mapping. The mapping table is unique per
    // discord_channel_id, so additional rows would be unexpected.
    const channelRow = body.data[0]
    if (!channelRow.is_active || !channelRow.agent || !channelRow.agent.is_active) {
      CACHE.set(discordChannelId, { agent: null, expires: Date.now() + TTL_MS })
      return null
    }

    const agent = normalize(channelRow.agent)
    CACHE.set(discordChannelId, { agent, expires: Date.now() + TTL_MS })
    return agent
  } catch (err: any) {
    console.warn(`[agentStore] Fetch failed: ${err?.message ?? err}`)
    return null
  }
}

function normalize(a: Record<string, unknown>): AgentProfile {
  const fullName = ((a.full_name as string) ?? '').trim()

  return {
    id: (a.wbs_i_agent_id as number) ?? 0,
    fullName: fullName || 'Agent',
    firstName: null,
    lastName: null,
    // The channel-mapping endpoint doesn't expose accreditation status, but
    // a channel link is only created for vetted agents, so we default to
    // "Accredited" for the rendered badge. If core-system ever surfaces the
    // raw `status` here, swap this to read it directly.
    status: 'Accredited',
    isActive: Boolean(a.is_active),
    phone: (a.phone as string) ?? null,
    discordId: (a.discord_id as string) ?? '',
  }
}

export function clearAgentCache(discordChannelId?: string): void {
  if (discordChannelId) CACHE.delete(discordChannelId)
  else CACHE.clear()
}

/**
 * Format the agent's accreditation badge text. Renders "Accredited Agent"
 * for fully accredited agents, "Registered Agent" otherwise.
 */
export function agentBadge(agent: AgentProfile): string {
  return agent.status === 'Accredited' ? 'Accredited Agent' : 'Registered Agent'
}
