import { useState } from 'react'

const REASONS = [
  "Your laugh fills any room with warmth 🌸",
  "The way you care for everyone around you",
  "You make me a better person every day",
  "Your silly moments are my favorite moments",
  "You understand me without words 💫",
  "Your kindness has no limit",
  "Being with you feels like home 🏡",
  "Every day with you is a gift 🎁",
]

function Reasons() {
  const [unlocked, setUnlocked] = useState([])

  const toggle = (i) => {
    if (!unlocked.includes(i)) setUnlocked([...unlocked, i])
  }

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Reasons I love you</h2>
      <p style={styles.hint}>tap each heart to reveal ✨</p>
      <div style={styles.grid}>
        {REASONS.map((r, i) => (
          <div
            key={i}
            style={unlocked.includes(i) ? styles.cardOpen : styles.cardLocked}
            onClick={() => toggle(i)}
          >
            {unlocked.includes(i)
              ? <p style={styles.reasonText}>{r}</p>
              : <span style={styles.lock}>💗</span>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrap: { marginBottom: '2rem' },
  title: { fontSize: '18px', color: '#b5294e', marginBottom: '0.25rem' },
  hint: { fontSize: '13px', color: '#999', marginBottom: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  cardLocked: {
    background: '#fbeaf0', border: '1px solid #f4c0d1', borderRadius: '12px',
    padding: '1rem', minHeight: '80px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  cardOpen: {
    background: '#fff', border: '1px solid #f4c0d1', borderRadius: '12px',
    padding: '1rem', minHeight: '80px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  lock: { fontSize: '24px' },
  reasonText: { fontSize: '13px', lineHeight: '1.5', color: '#444', textAlign: 'center' },
}

export default Reasons