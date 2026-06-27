import { useState, useEffect, useRef } from 'react'

const START_DATE = new Date('2025-06-27T00:00:00')
const TARGET_MS = 365 * 24 * 60 * 60 * 1000
const MUSIC_URL = 'https://res.cloudinary.com/dzrszofak/video/upload/v1782544589/golden_brown_x_love_story__music_256k_ehw4hv.mp3' // 👈 replace after uploading

function Countdown() {
  const [elapsed, setElapsed] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState([])
  const [hearts, setHearts] = useState([])
  const audioRef = useRef(null)

  useEffect(() => {
    const alreadyUnlocked = localStorage.getItem('anniversaryUnlocked') === 'true'
    if (alreadyUnlocked) setUnlocked(true)

    const tick = () => {
      const now = new Date()
      const diff = now - START_DATE
      setElapsed(diff)

      if (diff >= TARGET_MS && !alreadyUnlocked) {
        setUnlocked(true)
        localStorage.setItem('anniversaryUnlocked', 'true')
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60)
  const seconds = Math.floor((elapsed / 1000) % 60)

  const launchCelebration = () => {
    setShowCelebration(true)

    const confetti = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2,
      color: ['#b5294e', '#f4c0d1', '#ffd700', '#fbeaf0', '#993556'][Math.floor(Math.random() * 5)],
      size: 6 + Math.random() * 8,
    }))
    setConfettiPieces(confetti)

    const heartBursts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      size: 16 + Math.random() * 20,
    }))
    setHearts(heartBursts)

    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(() => {})
    }
  }

  const closeCelebration = () => {
    setShowCelebration(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <>
      <div style={styles.wrap}>
        <p style={styles.label}>together for</p>
        <div style={styles.row}>
          <Unit value={days} label="days" />
          <Unit value={hours} label="hrs" />
          <Unit value={minutes} label="min" />
          <Unit value={seconds} label="sec" />
        </div>

        {unlocked && (
          <button style={styles.celebrateBtn} onClick={launchCelebration}>
            🎉 tap for a surprise
          </button>
        )}
      </div>

      <audio ref={audioRef} src={MUSIC_URL} loop />

      {showCelebration && (
        <div style={styles.overlay} onClick={closeCelebration}>
          {confettiPieces.map(c => (
            <div
              key={c.id}
              style={{
                position: 'absolute',
                top: '-20px',
                left: `${c.left}%`,
                width: `${c.size}px`,
                height: `${c.size}px`,
                background: c.color,
                borderRadius: '2px',
                animation: `fall ${c.duration}s linear ${c.delay}s forwards`,
              }}
            />
          ))}

          {hearts.map(h => (
            <div
              key={h.id}
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: `${h.left}%`,
                fontSize: `${h.size}px`,
                animation: `floatUp ${h.duration}s ease-in ${h.delay}s forwards`,
                opacity: 0,
              }}
            >
              💗
            </div>
          ))}

          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <p style={styles.popupHeart}>🎉💗🎉</p>
            <h2 style={styles.popupTitle}>Happy Anniversary, my love</h2>
            <p style={styles.popupBody}>
              365 days of you and me.{'\n\n'}
              Every single day with you has been a gift. Thank you for choosing me, again and again.{'\n\n'}
              Here's to many many more years together. I love you endlessly. 💗
            </p>
            <button style={styles.popupBtn} onClick={closeCelebration}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(110vh) rotate(360deg);
          }
        }
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-100vh) scale(1.2); }
        }
      `}</style>
    </>
  )
}

function Unit({ value, label }) {
  return (
    <div style={styles.unit}>
      <p style={styles.unitValue}>{value}</p>
      <p style={styles.unitLabel}>{label}</p>
    </div>
  )
}

const styles = {
  wrap: {
    background: '#fbeaf0',
    border: '1px solid #f4c0d1',
    borderRadius: '12px',
    padding: '1.2rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  label: { fontSize: '12px', color: '#993556', marginBottom: '0.6rem', letterSpacing: '0.5px' },
  row: { display: 'flex', justifyContent: 'center', gap: '12px' },
  unit: { minWidth: '50px' },
  unitValue: { fontSize: '22px', fontWeight: '600', color: '#b5294e' },
  unitLabel: { fontSize: '11px', color: '#999' },
  celebrateBtn: {
    marginTop: '1rem',
    background: '#b5294e',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.75)',
    zIndex: 1000,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    textAlign: 'center',
    maxWidth: '340px',
    position: 'relative',
    zIndex: 10,
    margin: '1rem',
  },
  popupHeart: { fontSize: '32px', marginBottom: '1rem' },
  popupTitle: { fontSize: '22px', color: '#b5294e', marginBottom: '0.8rem' },
  popupBody: { fontSize: '15px', color: '#555', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' },
  popupBtn: {
    background: '#b5294e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '14px',
    cursor: 'pointer',
  },
}

export default Countdown