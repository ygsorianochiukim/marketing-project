'use client'

import { useEffect, useState } from 'react'
import { Job, JobStatus } from '@/types'
import { templateGoalFit, goalConfig } from '@/lib/adPlaybooks'

const STATUS_LABELS: Record<JobStatus, string> = {
  pending: 'Pending',
  clarifying: 'Clarifying Brief',
  evaluating: 'Evaluating Media',
  scripting: 'Generating Ad',
  rendering: 'Rendering',
  done: 'Done',
  needs_shots: 'Needs Images',
  failed: 'Failed',
}

const STATUS_COLORS: Record<JobStatus, string> = {
  pending: '#8a857a',
  clarifying: '#8a6a3b',
  evaluating: '#8a6a3b',
  scripting: '#a8923b',
  rendering: '#a8923b',
  done: '#5a7a48',
  needs_shots: '#a8632b',
  failed: '#a04848',
}

function StatusDot({ status }: { status: JobStatus }) {
  const color = STATUS_COLORS[status]
  const pulse = ['clarifying', 'evaluating', 'scripting', 'rendering'].includes(status)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
          boxShadow: pulse ? `0 0 6px ${color}` : 'none',
          animation: pulse ? 'pulse 2s ease-in-out infinite' : 'none',
        }}
      />
      <span style={{ color, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
        {STATUS_LABELS[status]}
      </span>
    </span>
  )
}

function GoalFitChip({ templateKey }: { templateKey?: string }) {
  const goal = templateGoalFit(templateKey)
  if (!goal) return null
  const cfg = goalConfig(goal)
  const colorByGoal: Record<typeof goal, string> = {
    engagement: '#5a7a48',
    reach: '#8a6a3b',
    reactivation: '#4a6a8a',
  }
  const color = colorByGoal[goal]
  return (
    <span
      title={cfg.description}
      style={{
        fontSize: 10,
        color,
        fontFamily: 'Cormorant Garamond, serif',
        fontStyle: 'italic',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        padding: '3px 9px',
        border: `1px solid ${color}55`,
        background: `${color}10`,
        borderRadius: 4,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.emoji} {cfg.label} Fit
    </span>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <div
      style={{
        background: '#f3e8cf',
        border: '1px solid #c9b88f',
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 12,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#8a6a3b')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#c9b88f')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#2d2a26', marginBottom: 4, fontWeight: 600 }}>
            {job.brief.product}
          </p>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#8a857a', letterSpacing: '0.1em' }}>
            {job.id}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <StatusDot status={job.status} />
          <GoalFitChip templateKey={job.templateKey} />
        </div>
      </div>

      <p style={{ fontSize: 14, color: '#5a5a5a', marginBottom: 12, lineHeight: 1.6, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
        {job.brief.concept}
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {job.brief.tone && (
          <span style={{ fontSize: 12, color: '#5a5a5a', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
            Tone : <span style={{ color: '#8a6a3b', fontStyle: 'normal', fontWeight: 600 }}>{job.brief.tone}</span>
          </span>
        )}
        {job.assets.length > 0 && (
          <span style={{ fontSize: 12, color: '#5a5a5a', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
            Assets : <span style={{ color: '#8a6a3b', fontStyle: 'normal', fontWeight: 600 }}>{job.assets.length}</span>
          </span>
        )}
      </div>

      {job.missingShots && job.missingShots.length > 0 && (
        <div style={{ marginTop: 12, padding: '10px 14px', background: '#ebdfc5', borderRadius: 8, border: '1px solid #a8632b' }}>
          <p style={{ fontSize: 12, color: '#a8632b', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', marginBottom: 6, letterSpacing: '0.08em' }}>Missing shots</p>
          {job.missingShots.map((s, i) => (
            <p key={i} style={{ fontSize: 13, color: '#2d2a26', marginBottom: 2, fontFamily: 'Cormorant Garamond, serif' }}>• {s}</p>
          ))}
        </div>
      )}

      {(job.imageUrl || job.driveLink) && (
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          {job.imageUrl && (
            <a
              href={job.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: 'transparent',
                border: '1px solid #8a6a3b',
                borderRadius: 6,
                color: '#8a6a3b',
                fontSize: 12,
                fontFamily: 'DM Mono, monospace',
                textDecoration: 'none',
                letterSpacing: '0.08em',
              }}
            >
              VIEW AD →
            </a>
          )}
          {job.driveLink && (
            <a
              href={job.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: 'transparent',
                border: '1px solid #4a6a8a',
                borderRadius: 6,
                color: '#4a6a8a',
                fontSize: 12,
                fontFamily: 'DM Mono, monospace',
                textDecoration: 'none',
                letterSpacing: '0.08em',
              }}
            >
              DRIVE →
            </a>
          )}
        </div>
      )}

      <p style={{ fontSize: 11, color: '#8a857a', fontFamily: 'DM Mono, monospace', marginTop: 12 }}>
        {new Date(job.createdAt).toLocaleString()}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [botStatus, setBotStatus] = useState<{ running: boolean; tag: string | null }>({ running: false, tag: null })
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    const [jobsRes, botRes] = await Promise.all([fetch('/api/jobs'), fetch('/api/bot')])
    if (jobsRes.ok) setJobs(await jobsRes.json())
    if (botRes.ok) setBotStatus(await botRes.json())
    setLoading(false)
  }

  async function toggleBot() {
    const action = botStatus.running ? 'stop' : 'start'
    await fetch('/api/bot', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action }) })
    await fetchData()
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const activeJobs = jobs.filter((j) => !['done', 'failed'].includes(j.status))
  const doneJobs = jobs.filter((j) => ['done', 'failed'].includes(j.status))

  return (
    <div style={{ minHeight: '100vh', background: '#e9ddc4', color: '#2d2a26' }}>
      <div style={{ padding: '40px 24px', maxWidth: 800, margin: '0 auto' }}>
        <style>{`
          @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        `}</style>

        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: '#8a6a3b', letterSpacing: '0.3em', marginBottom: 8, textTransform: 'uppercase' }}>
            Ad Generator
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 56, fontWeight: 700, color: '#2d2a26', marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1 }}>
            Production Pipeline
          </h1>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, fontStyle: 'italic', color: '#5a5a5a', marginBottom: 24 }}>
            Briefs in progress and finished campaigns.
          </p>
          <hr style={{ border: 0, borderTop: '1px solid #c9b88f', marginBottom: 24 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="/settings"
              style={{
                padding: '8px 20px',
                border: '1px solid #c9b88f',
                borderRadius: 6,
                background: 'transparent',
                color: '#5a5a5a',
                fontFamily: 'DM Mono, monospace',
                fontSize: 12,
                letterSpacing: '0.1em',
                textDecoration: 'none',
              }}
            >
              SETTINGS
            </a>
            <a
              href="/boost-stats"
              style={{
                padding: '8px 20px',
                border: '1px solid #c9b88f',
                borderRadius: 6,
                background: 'transparent',
                color: '#5a5a5a',
                fontFamily: 'DM Mono, monospace',
                fontSize: 12,
                letterSpacing: '0.1em',
                textDecoration: 'none',
              }}
            >
              BOOST STATS
            </a>
            <button
              onClick={toggleBot}
              style={{
                padding: '8px 20px',
                border: `1px solid ${botStatus.running ? '#5a7a48' : '#8a6a3b'}`,
                borderRadius: 6,
                background: 'transparent',
                color: botStatus.running ? '#5a7a48' : '#8a6a3b',
                fontFamily: 'DM Mono, monospace',
                fontSize: 12,
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              {botStatus.running ? 'STOP BOT' : 'START BOT'}
            </button>
            {botStatus.running && botStatus.tag && (
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#5a7a48' }}>
                {botStatus.tag} — online
              </span>
            )}
            {!botStatus.running && (
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#8a857a' }}>
                Bot offline
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 14, color: '#5a5a5a' }}>Loading...</p>
        ) : (
          <>
            {activeJobs.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#5a5a5a', letterSpacing: '0.2em', marginBottom: 16, textTransform: 'uppercase' }}>
                  Active — {activeJobs.length}
                </p>
                {activeJobs.map((job) => <JobCard key={job.id} job={job} />)}
              </section>
            )}

            {doneJobs.length > 0 && (
              <section>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#5a5a5a', letterSpacing: '0.2em', marginBottom: 16, textTransform: 'uppercase' }}>
                  Completed — {doneJobs.length}
                </p>
                {doneJobs.map((job) => <JobCard key={job.id} job={job} />)}
              </section>
            )}

            {jobs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: '#8a857a', marginBottom: 12, fontStyle: 'italic' }}>
                  No jobs yet
                </p>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: '#8a857a', fontStyle: 'italic' }}>
                  Start the bot and type &quot;generate ad for...&quot; in Discord
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
