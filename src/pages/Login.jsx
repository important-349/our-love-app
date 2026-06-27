import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API}/api/auth/login`, { username, password })
      onLogin(res.data.role)
    } catch (err) {
      setError('Wrong username or password 💔')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.heart}>💗</p>
        <h2 style={styles.title}>Just for us two</h2>
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Checking...' : 'Enter 💌'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff5f7',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    border: '1px solid #f4c0d1',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    textAlign: 'center',
    width: '100%',
    maxWidth: '340px',
  },
  heart: { fontSize: '40px', marginBottom: '0.5rem' },
  title: { fontSize: '18px', color: '#b5294e', marginBottom: '1.5rem' },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #f4c0d1',
    fontSize: '14px',
    marginBottom: '10px',
    outline: 'none',
    fontFamily: 'Georgia, serif',
  },
  btn: {
    width: '100%',
    background: '#b5294e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: { color: '#b5294e', fontSize: '13px', marginBottom: '8px' },
}

export default Login