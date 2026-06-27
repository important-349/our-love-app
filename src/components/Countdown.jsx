import { useState, useEffect } from 'react'

const START_DATE = new Date('2025-06-27T00:00:00')
const TARGET_MS = 365 * 24 * 60 * 60 * 1000 // exactly 365 days in ms

function Countdown() {
  const [elapsed, setElapsed] = useState(0)
  const [celebrated, setCelebrated] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const diff = now - START_DATE
      setElapsed(diff)

      if (diff >= TARGET_MS && !celebrated) {
        setCelebrated(true)
        setShowPopup(true)
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [celebrated])

  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60)
  const seconds = Math.floor((elapsed / 1000) % 60)

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
      </div>

      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <p style={styles.popupHeart}>🎉💗🎉</p>
            <h2 style={styles.popupTitle}>Happy Anniversary!</h2>
            <p style={styles.popupBody}>
              365 days of you and me. Here's to forever more. I love you so much. 💗
            </p>
            <button style={styles.popupBtn} onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
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
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  popup: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    textAlign: 'center',
    maxWidth: '340px',
  },
  popupHeart: { fontSize: '32px', marginBottom: '1rem' },
  popupTitle: { fontSize: '24px', color: '#b5294e', marginBottom: '0.8rem' },
  popupBody: { fontSize: '15px', color: '#555', lineHeight: '1.6', marginBottom: '1.5rem' },
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