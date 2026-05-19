# Discord Bot Cheat Sheet

> Full reference: see [DISCORD_COMMANDS.md](DISCORD_COMMANDS.md)

## 🚀 Boost

```
boost post: <postId or FB URL>          → boost post: 1372029201613949
boost stats                             → view live ad analytics
boost scaler                            → winners vs losers analysis
boost auto on   /   boost auto off      → toggle auto-boost
pause boost post: <postId>              → pause all boosts on one post
pause boost: <campaignId>               → pause one campaign
cleanup shells                          → delete empty campaigns
retry boosts                            → reset given-up entries
boost skip pending                      → mark pending as done
set boost budget: <php>                 → set boost budget: 250
set boost age: <min>-<max>              → set boost age: 25-60
set boost country: <ISO>                → set boost country: PH
show boost settings                     → current config
boost debug                             → raw FB API dump
```

## 📊 Coverage

```
coverage check                          → which categories are stale
coverage scan                           → AI-tag recent FB posts
coverage fix                            → patch missing post IDs
resync coverage                         → reconcile postedAt against FB reality
coverage reset [category]               → wipe history
schedule coverage check daily every 9 AM → recurring check
schedule coverage check off             → disable
show coverage schedule                  → status
```

## 📅 Posts

```
scheduled posts                         → list queued FB posts
cancel post <n>                         → cancel post 3
shift posts                             → compact schedule
reschedule post <n>: <date>             → reschedule post 1: 2026-05-23
reschedule post <n>: +<days>            → reschedule post 1: +10
post latest                             → recover last ad
```

## ✏️ Content Generation

```
weekly plan                             → batch 5-7 ads for the week
content plan: <n>                       → content plan: 3
concept ad: <brief>                     → one-shot ad from brief
generate ad for <product> — concept: <idea>
animate ad                              → 30s video from last concept
reprompt: <notes>                       → revise current ad
preview templates                       → preview all templates
preview: <name>                         → preview: elegant memorial
assign brief: <draftId>                 → attach photo brief
brief: <draftId>:                       → fulfill brief (attach image)
guide video                             → PDF → 60s narrated video
```

## 📡 Signals & Insights

```
signals                                 → show stored signals
signals refresh                         → pull fresh signals
signals reset                           → wipe the store (no dedup memory)
pairing run                             → signal ↔ template analysis
insights   (or)   ad insights           → ad category performance
```

## 🎨 Library

```
submit: <context>                       → submit images (auto-scored)
scan drive                              → score all Drive photos
```

## 🧠 Brand Knowledge

```
brand: <question>                       → Q&A from brand KB
set ad prompt: <text>                   → override ad prompt
show ad prompt   /   clear ad prompt
```

## 🔁 Flow Control (inside an active flow)

```
yes    no    skip    ready    cancel
schedule all                            → confirm batch schedule
schedule 1,3,5                          → schedule subset
boost                                   → boost the post just made
```

---

**Pin this in a Discord channel for quick reference. Commands are case-insensitive; no slash prefix needed.**
