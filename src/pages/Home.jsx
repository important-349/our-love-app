import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Countdown from '../components/Countdown'
import Letter from '../components/Letter'
import Reasons from '../components/Reasons'
import MessageBox from '../components/MessageBox'
import Timeline from '../components/Timeline'

function Home({ role }) {
  const [letterOpen, setLetterOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.heartBig}>💗</div>
        <h1 style={styles.title}>Happy 1 Year, My Love</h1>
        <p style={styles.subtitle}>June 27, 2025 → June 27, 2026</p>

      </div>
      {/* Live Countdown */}
      <Countdown />
      {/* Envelope / Letter */}
      {!letterOpen ? (
        <div style={styles.envelope} onClick={() => setLetterOpen(true)}>
          <p style={styles.envelopeText}>💌 tap to open your letter</p>
        </div>
      ) : (
        <Letter />
      )}

      {/* Our Story Timeline */}
      <Timeline role={role} />

      {/* Reasons */}
      

      {/* Message Box */}
      

      {/* Secret admin button */}
      <button
        onClick={() => navigate('/admin')}
        style={styles.secretBtn}
        title=""
      >
        💗
      </button>

    </div>
  )
}

const styles = {
  page: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '2rem 1rem 4rem',
    textAlign: 'center',
    position: 'relative',
  },
  header: { marginBottom: '2rem' },
  heartBig: { fontSize: '52px', display: 'block', marginBottom: '0.5rem' },
  title: { fontSize: '24px', fontWeight: '600', color: '#b5294e', marginBottom: '0.25rem' },
  subtitle: { fontSize: '14px', color: '#999', marginBottom: '0.25rem' },
  days: { fontSize: '14px', color: '#d4537e' },
  envelope: {
    background: '#fbeaf0',
    border: '1px solid #f4c0d1',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    cursor: 'pointer',
  },
  envelopeText: { fontSize: '16px', color: '#993556', fontStyle: 'italic' },
  secretBtn: {
    position: 'fixed',
    bottom: '16px',
    left: '16px',
    background: 'transparent',
    border: 'none',
    fontSize: '14px',
    opacity: '0.2',
    cursor: 'pointer',
    padding: '8px',
  },
}

export default Home