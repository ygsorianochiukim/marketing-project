# Discord Bot — Command Reference

Complete list of every command the ad-generator Discord bot recognizes, grouped by what you're trying to do.

**How to send a command:** just type it in any channel where the bot has Read/Send Message permission. Commands are case-insensitive and trigger on the **first word(s)** of your message — no slash prefix.

---

## 1. Boost & Auto-boost

Manage Facebook ad boosts: create, pause, configure budgets, automate.

### Manual boost control

| Command | What it does | Example |
|---|---|---|
| `boost post: <postId or URL>` | Boost a specific FB post by ID or full FB URL. Creates campaign with current budget/age/country settings. | `boost post: 1372029201613949` or `boost post: https://www.facebook.com/photo/?fbid=1376915041125365` |
| `boost stats` | Pull live boost analytics — spend, reach, CTR, msgs, cost-per-message for all campaigns. | `boost stats` |
| `boost debug` | Raw FB Graph API dump — for diagnosing token/permission issues. | `boost debug` |
| `boost scaler` *(alias: `scaler`)* | Analyze every boost into winners / mids / losers / ramping tiers. | `boost scaler` |
| `cleanup shells` | Delete empty boost campaigns (created but no ad attached — usually from failed auto-boost attempts). | `cleanup shells` |
| `pause boost: <campaignId>` | Pause one specific campaign by its FB campaign ID. | `pause boost: 120244538201080176` |
| `pause boost post: <postId>` *(alias: `unboost post: <postId>`)* | Pause **all** active campaigns targeting one post. | `pause boost post: 1372029201613949` |

### Auto-boost rules

| Command | What it does | Example |
|---|---|---|
| `boost auto on` | Turn on automatic boosting — every scheduled post gets boosted the moment it goes live on FB. | `boost auto on` |
| `boost auto off` | Turn off auto-boost. | `boost auto off` |
| `boost skip pending` | Mark all pending entries as boosted (silences them from auto-boost retry). | `boost skip pending` |
| `retry boosts` | Reset entries the bot gave up on (after 3 failed attempts) so it can try again. | `retry boosts` |

### Boost settings

| Command | What it does | Example |
|---|---|---|
| `set boost budget: <php>` | Set the daily budget used when auto-boosting. | `set boost budget: 250` |
| `set boost age: <min>-<max>` | Set the age targeting range. | `set boost age: 25-60` |
| `set boost country: <ISO>` | Set country targeting (PH, US, etc.). | `set boost country: PH` |
| `show boost settings` | Show current budget, age, country, and auto-boost on/off state. | `show boost settings` |

---

## 2. Coverage & Scheduling

Coverage tracks which ad categories have been posted recently. The bot uses this to keep your content varied and surface gaps.

### Coverage queries

| Command | What it does | Example |
|---|---|---|
| `coverage check` | Show which ad categories haven't been posted recently. Optional auto-render: bot offers to generate missing categories. | `coverage check` |
| `coverage scan` | Scan recent FB page posts, AI-tag them with categories, record them in coverage. | `coverage scan` |
| `coverage fix` | Patch missing FB post IDs into coverage from the live page (needed when auto-boost can't find a post). | `coverage fix` |
| `resync coverage` *(alias: `coverage resync`)* | Reconcile `postedAt` across ALL coverage entries against FB's actual published + scheduled times. Fixes drift from external reschedules (Meta Business Suite) or legacy data. | `resync coverage` |
| `coverage reset` | Wipe all coverage history. Add a category name to scope the reset. | `coverage reset` or `coverage reset memorial` |

### Scheduled coverage check (recurring job)

| Command | What it does | Example |
|---|---|---|
| `schedule coverage check <interval>` | Run a coverage check on a recurring schedule. Interval: `daily`, `weekly`, or `every N days`. Add `every <hour> AM/PM` to set time. **Posts result in whatever channel you ran the command in.** | `schedule coverage check daily every 9 AM` |
| `schedule coverage check off` | Disable the recurring check. | `schedule coverage check off` |
| `show coverage schedule` | Show current schedule, target channel, and last-run timestamp. | `show coverage schedule` |

---

## 3. Posts & Scheduling

Manage what's queued on Facebook.

| Command | What it does | Example |
|---|---|---|
| `scheduled posts` *(alias: `scheduled`)* | List all queued FB posts numbered 1, 2, 3… with their scheduled times. | `scheduled posts` |
| `cancel post <num>` | Cancel scheduled post by its list number from `scheduled posts`. After cancel, run `shift posts` to fill the gap. | `cancel post 3` |
| `shift posts` | Compact the schedule — moves future posts up to fill any cancelled gaps. Updates coverage automatically. | `shift posts` |
| `reschedule post <num>: <date>` | Move a single scheduled post. Absolute: `YYYY-MM-DD [HH:MM]`. Relative: `+N` days. Times are PHT. | `reschedule post 1: 2026-05-23 9:00` or `reschedule post 1: +10` |
| `post latest` | Recover & post the last generated ad to FB (useful after server restart). | `post latest` |

---

## 4. Content Generation

Ad/post copy and image generation.

### Single ad flows

| Command | What it does | Example |
|---|---|---|
| `generate ad for <product> — concept: <idea>` | Start the full ad generation flow (asks audience, hook, etc.). | `generate ad for memorial lots — concept: legacy for OFW families` |
| `create post for <concept>` | Generate a social post (text/caption) from a concept. | `create post for chapel blessing ceremony` |
| `concept ad: <brief>` | One-shot ad from a brief — text or Runway-generated image. | `concept ad: memorial service for busy professionals` |
| `animate ad` | Take the last generated concept and turn it into a 30-second video (3 scenes + TTS). | `animate ad` |
| `reprompt: <notes>` | Regenerate the current image ad with revision notes. | `reprompt: shorter headline, warmer tone` |
| `ready` | Confirm and start ad generation after the bot has asked clarifying questions. | `ready` |

### Batch / weekly planning

| Command | What it does | Example |
|---|---|---|
| `weekly plan` *(alias: `content plan: <count>`)* | Generate a 5–7 ad batch for the week. Bot asks audience level first. | `weekly plan` or `content plan: 3` |
| `preview templates` | Render previews for every ad template in your library. Optional photo attachment for variety. | `preview templates` |
| `preview: <name>` | Render a single template preview. | `preview: elegant memorial` |

### Brief & draft management

| Command | What it does | Example |
|---|---|---|
| `assign brief: <draftId>` | Attach a multi-line photo brief to a draft. | `assign brief: draft_abc123` |
| `brief: <draftId>:` *(attach image)* | Fulfill a draft's asset brief by attaching the photo. | `brief: draft_abc:` (with image attached) |
| `reprompts` | List all ad categories that have reprompt-enabled. | `reprompts` |

### Special generators

| Command | What it does | Example |
|---|---|---|
| `guide video` *(attach PDF)* | Convert an attached PDF user guide into a 60-second video explainer with narration. | `guide video` (with PDF attached) |

---

## 5. Signals & Insights

Trend pulls and ad performance insights.

| Command | What it does | Example |
|---|---|---|
| `signals` | Show all stored signals (approved, held, discarded). | `signals` |
| `signals refresh` | Pull fresh signals from all 5 surface sources (Trends, News RSS, YouTube, Reddit, PH Calendar). | `signals refresh` |
| `signals reset` | Wipe the entire signal store. Next `signals refresh` re-pulls from scratch with no dedup memory (previously-seen items come back with fresh timestamps). | `signals reset` |
| `pairing run` | Manually trigger the signal-to-ad-template pairing analysis. | `pairing run` |
| `insights` *(alias: `ad insights`)* | Show ad-category-level performance ranked by engagement. | `insights` |

---

## 6. Library / Asset Management

Manage the photo library used for ad generation.

| Command | What it does | Example |
|---|---|---|
| `submit:` *(attach images)* | Submit one or more images; Claude auto-scores and describes them, adds to library. | `submit: brand event photos` (with attachments) |
| `submit asset` *(alias: `upload asset`)* | Show help/usage for the asset submission flow. | `submit asset` |
| `scan drive` | Score all unscored Google Drive photos and add to the library. | `scan drive` |

---

## 7. Brand Knowledge

Ask brand-specific questions answered from the brand knowledge base.

| Command | What it does | Example |
|---|---|---|
| `brand: <question>` | Ask anything from the brand's perspective — pain points, objections, ad angles, positioning. | `brand: How do we counter the "too expensive" objection?` |
| `set ad prompt: <text>` | Override the system's default ad-generation prompt. | `set ad prompt: You are writing for a luxury memorial brand...` |
| `show ad prompt` | Show the currently active ad prompt. | `show ad prompt` |
| `clear ad prompt` | Reset to the built-in default ad prompt. | `clear ad prompt` |

---

## 8. Flow Control

These work **inside** an ongoing conversation flow (after the bot asked you a question).

| Command | What it does |
|---|---|
| `yes` / `no` | Confirm or reject the bot's last question (in a generate-ad or schedule-coverage flow). |
| `skip` | Skip an optional step in a flow. |
| `cancel` *(alias: `stop`)* | Abort the current flow at any point. |
| `schedule all` | After a batch generation, confirm scheduling ALL the rendered ads. |
| `schedule <nums>` | Schedule only specific ads by their batch numbers (comma-separated). | `schedule 1,3,5` |
| `boost` | After a single ad post completes, confirm boosting it. |

---

## 9. Permission & Server Migration Notes

**One-bot-many-servers:** The bot's identity is tied to its `DISCORD_BOT_TOKEN` env var. If the bot is invited to multiple Discord servers, it will respond to commands in **all of them**. To stop it responding in one server, kick the bot from that server.

**Channel-bound state:** Only ONE setting in the entire app is tied to a Discord channel: `coverageCheckChannelId` in `brand-settings.json`. It controls where these post:
- Scheduled coverage check results
- Auto-boost "🚀 Boosted" notifications
- Auto-boost failure warnings
- Auto-pause / auto-boost-again alerts

To redirect everything to a new channel, run `schedule coverage check daily every 9 AM` (or whatever schedule you want) in the new channel — it overwrites the stored channel ID.

---

## 10. Quick Reference — "I want to…"

| Goal | Command |
|---|---|
| See what's running on FB ads | `boost stats` |
| Pause a runaway boost | `pause boost post: <postId>` |
| Enable hands-off boosting | `boost auto on` |
| Move a scheduled post to a later date | `reschedule post <n>: <date>` |
| Fill scheduling gaps after cancelling a post | `shift posts` |
| Find out what's trending today | `signals refresh` |
| Plan a week of ads | `weekly plan` |
| Generate a one-off ad | `concept ad: <brief>` |
| Diagnose why an auto-boost didn't fire | `coverage fix` then `boost stats` |
| See if auto-boost is on | `show boost settings` |

---

## 11. Common Gotchas

1. **`boost stats` shows post IDs, not campaign IDs.** To pause by post (`pause boost post: <id>`) use the IDs from the stats output. To pause by campaign (`pause boost: <id>`) you need the campaign ID from the web UI at `http://localhost:3000/boost-stats` or from server logs.

2. **`reschedule post` and `shift posts` keep coverage.json in sync as of the latest fix.** Earlier versions silently let the schedule drift, causing auto-boost to miss reschedules.

3. **Scheduled coverage check fires once per PHT calendar day at the configured hour.** If the server is down at that hour, the check now catches up the moment the server comes back (as long as it's still the same PHT day).

4. **Auto-boost requires `FACEBOOK_PAGE_ID`, `FB_AD_ACCOUNT_ID`, and `FACEBOOK_ACCESS_TOKEN`** in `.env.local`. If any are missing, auto-boost silently no-ops every tick.

5. **`coverage fix` only looks at the last 50 posts on the FB page.** If a post is older than that, the patcher won't find it.

6. **The bot listens on every channel it has access to** — there's no command prefix. To prevent it from responding in casual channels, restrict its View Channel permission.
