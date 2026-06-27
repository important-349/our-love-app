import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function MessageBox() {
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!body.trim()) return
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API}/api/messages`, { body })
      setSent(true)
    } catch (err) {
      setError('Something went wrong, try again 💔')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={styles.card}>
        <p style={styles.sentText}>Message sent 💗 I'll read it soon.</p>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Leave me a message 💬</h3>
      <textarea
        style={styles.textarea}
        placeholder="Write something sweet..."
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={4}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button
        style={loading ? styles.btnDisabled : styles.btn}
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send 💌'}
      </button>
    </div>
  )
}

const styles = {
  card: { background: '#fbeaf0', border: '1px solid #f4c0d1', borderRadius: '12px', padding: '1.5rem', marginTop: '2rem' },
  title: { fontSize: '16px', color: '#b5294e', marginBottom: '1rem' },
  textarea: {
    width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f4c0d1',
    fontSize: '14px', marginBottom: '10px', outline: 'none', resize: 'none',
    background: '#fff', fontFamily: 'Georgia, serif',
  },
  btn: { background: '#b5294e', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', cursor: 'pointer', width: '100%' },
  btnDisabled: { background: '#d4537e', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', cursor: 'not-allowed', width: '100%' },
  error: { color: '#b5294e', fontSize: '13px', marginBottom: '8px' },
  sentText: { color: '#b5294e', fontSize: '15px', textAlign: 'center', fontStyle: 'italic' },
}

export default MessageBox