import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function Admin() {
  const [password, setPassword] = useState('')
  const [date, setDate] = useState('')
  const [caption, setCaption] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState('image')
  const [extraUrls, setExtraUrls] = useState('')
  const [status, setStatus] = useState('')
  const [entries, setEntries] = useState([])
  const [editingId, setEditingId] = useState(null) // null = adding new, otherwise editing this id

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = () => {
    axios.get(`${API}/api/timeline`)
      .then(res => setEntries(res.data))
      .catch(() => {})
  }

  const resetForm = () => {
    setDate('')
    setCaption('')
    setMediaUrl('')
    setMediaType('image')
    setExtraUrls('')
    setEditingId(null)
  }

  const startEdit = (entry) => {
    setEditingId(entry._id)
    setDate(entry.date || '')
    setCaption(entry.caption || '')
    setMediaUrl(entry.mediaUrl || '')
    setMediaType(entry.mediaType || 'image')
    setExtraUrls(entry.extraMediaUrls || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitTimeline = async () => {
    setStatus('')

    try {
      if (editingId) {
        // UPDATE existing
        const res = await axios.put(`${API}/api/timeline/${editingId}`, {
          date, caption, mediaUrl, mediaType,
          extraMediaUrls: extraUrls,
          password
        })
        setStatus('Memory updated 💗')
        setEntries(entries.map(e => e._id === editingId ? res.data : e))
      } else {
        // CREATE new
        const res = await axios.post(`${API}/api/timeline`, {
          date, caption, mediaUrl, mediaType,
          extraMediaUrls: extraUrls,
          password
        })
        setStatus('Memory added 💗')
        setEntries([...entries, res.data])
      }
      resetForm()
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
      <h2>{editingId ? 'Edit Memory' : 'Add Timeline Memory'}</h2>
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
      <button onClick={submitTimeline} style={styles.button}>
        {editingId ? 'Save Changes' : 'Add Memory'}
      </button>
      {editingId && (
        <button onClick={resetForm} style={styles.cancelButton}>
          Cancel Edit
        </button>
      )}
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
          <div style={styles.entryButtons}>
            <button onClick={() => startEdit(e)} style={styles.editBtn}>
              Edit
            </button>
            <button onClick={() => deleteEntry(e._id)} style={styles.deleteBtn}>
              Delete
            </button>
          </div>
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
  cancelButton: {
    width: '100%',
    padding: '10px',
    marginTop: '8px',
    cursor: 'pointer',
    background: 'transparent',
    border: '1px solid #ccc',
  },
  entryCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px',
  },
  entryDate: { fontSize: '12px', color: '#999', marginBottom: '4px' },
  entryCaption: { fontSize: '14px', color: '#333', marginBottom: '4px' },
  entryExtra: { fontSize: '12px', color: '#b5294e', marginBottom: '8px' },
  entryButtons: { display: 'flex', gap: '8px' },
  editBtn: {
    background: 'transparent',
    border: '1px solid #99c1f4',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '12px',
    color: '#3a6fb5',
    cursor: 'pointer',
  },
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