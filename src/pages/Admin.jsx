import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function Admin() {
  const [password, setPassword] = useState('')
  const [date, setDate] = useState('')
  const [caption, setCaption] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState('image')
  const [extraUrls, setExtraUrls] = useState('') // comma-separated
  const [status, setStatus] = useState('')
  const [entries, setEntries] = useState([])

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = () => {
    axios.get(`${API}/api/timeline`)
      .then(res => setEntries(res.data))
      .catch(() => {})
  }

  const addTimeline = async () => {
    setStatus('')

    try {
      const res = await axios.post(`${API}/api/timeline`, {
        date,
        caption,
        mediaUrl,
        mediaType,
        extraMediaUrls: extraUrls,
        password
      })
      setStatus('Memory added 💗')
      setDate('')
      setCaption('')
      setMediaUrl('')
      setMediaType('image')
      setExtraUrls('')
      setEntries([...entries, res.data])
    } catch (err) {
      setStatus('Wrong password or something went wrong.')
    }
  }

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this memory?')) return
    try {
      await axios.delete(`${API}/api/timeline/${id}`, { data: { password } })
      setEntries(entries.filter(e => e._id !== id))
    } catch (err) {
      alert('Error deleting — check your password is entered above')
    }
  }

  return (
    <div style={styles.page}>
      <h1>Admin 💗</h1>
      <input
        type="password"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <hr style={{ margin: '25px 0' }} />
      <h2>Add Timeline Memory</h2>
      <input
        placeholder="Date (e.g. June 27, 2025)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      />
      <textarea
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={styles.textarea}
      />
      <input
        placeholder="Main Cloudinary URL (cover photo/video)"
        value={mediaUrl}
        onChange={(e) => setMediaUrl(e.target.value)}
        style={styles.input}
      />
      <select
        value={mediaType}
        onChange={(e) => setMediaType(e.target.value)}
        style={styles.input}
      >
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>
      <textarea
        placeholder="Extra photo/video URLs, separated by commas (optional)"
        value={extraUrls}
        onChange={(e) => setExtraUrls(e.target.value)}
        style={styles.textarea}
      />
      <p style={styles.helperText}>
        Tip: paste multiple Cloudinary links separated by commas to make this post a swipeable gallery.
      </p>
      <button onClick={addTimeline} style={styles.button}>
        Add Memory
      </button>
      <p>{status}</p>

      <hr style={{ margin: '25px 0' }} />
      <h2>Your Memories ({entries.length})</h2>
      {entries.length === 0 && <p style={styles.empty}>No memories yet</p>}
      {entries.map(e => (
        <div key={e._id} style={styles.entryCard}>
          <p style={styles.entryDate}>{e.date}</p>
          <p style={styles.entryCaption}>{e.caption}</p>
          {e.extraMediaUrls && e.extraMediaUrls.trim().length > 0 && (
            <p style={styles.entryExtra}>has extra media</p>
          )}
          <button onClick={() => deleteEntry(e._id)} style={styles.deleteBtn}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

const styles = {
  page: { maxWidth: '500px', margin: '40px auto', padding: '20px' },
  input: { width: '100%', padding: '10px', marginBottom: '10px' },
  textarea: { width: '100%', height: '80px', padding: '10px', marginBottom: '6px' },
  helperText: { fontSize: '12px', color: '#999', marginBottom: '14px' },
  button: { width: '100%', padding: '12px', cursor: 'pointer' },
  entryCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px',
  },
  entryDate: { fontSize: '12px', color: '#999', marginBottom: '4px' },
  entryCaption: { fontSize: '14px', color: '#333', marginBottom: '4px' },
  entryExtra: { fontSize: '12px', color: '#b5294e', marginBottom: '8px' },
  deleteBtn: {
    background: 'transparent',
    border: '1px solid #f4c0d1',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '12px',
    color: '#b5294e',
    cursor: 'pointer',
  },
  empty: { fontSize: '13px', color: '#bbb' },
}

export default Admin