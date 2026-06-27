import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function Timeline({ role }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeGallery, setActiveGallery] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [comments, setComments] = useState({}) // { postId: [comments] }
  const [newComment, setNewComment] = useState({}) // { postId: text }

  useEffect(() => {
    axios.get(`${API}/api/timeline`)
      .then(res => {
        setEntries(res.data)
        res.data.forEach(entry => loadComments(entry._id))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const loadComments = (postId) => {
    axios.get(`${API}/api/comments/${postId}`)
      .then(res => {
        setComments(prev => ({ ...prev, [postId]: res.data }))
      })
      .catch(() => {})
  }

  const submitComment = async (postId) => {
    const text = newComment[postId]
    if (!text || !text.trim()) return

    try {
      await axios.post(`${API}/api/comments`, { postId, text, author: role })
      setNewComment(prev => ({ ...prev, [postId]: '' }))
      loadComments(postId)
    } catch (err) {
      // silent fail is fine here, low stakes
    }
  }

  const allMedia = (entry) => {
    const main = { url: entry.mediaUrl, type: entry.mediaType }
    const extras = (entry.extraMediaUrls || '')
      .split(',')
      .map(u => u.trim())
      .filter(u => u.length > 0)
      .map(u => ({
        url: u,
        type: u.endsWith('.mp4') || u.includes('/video/') ? 'video' : 'image'
      }))
    return [main, ...extras]
  }

  const openGallery = (entry) => {
    const hasExtra = entry.extraMediaUrls && entry.extraMediaUrls.trim().length > 0
    if (!hasExtra) return
    setActiveGallery(entry)
    setActiveIndex(0)
  }

  const closeGallery = () => {
    setActiveGallery(null)
    setActiveIndex(0)
  }

  const nextImage = () => {
    const media = allMedia(activeGallery)
    setActiveIndex((activeIndex + 1) % media.length)
  }

  const prevImage = () => {
    const media = allMedia(activeGallery)
    setActiveIndex((activeIndex - 1 + media.length) % media.length)
  }

  if (loading) return null
  if (entries.length === 0) return null

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Our Story 🌸</h2>
      <p style={styles.hint}>every moment, from the start</p>

      <div style={styles.feed}>
        {entries.map((e) => {
          const hasExtra = e.extraMediaUrls && e.extraMediaUrls.trim().length > 0
          const postComments = comments[e._id] || []

          return (
            <div
              key={e._id}
              style={{
                ...styles.card,
                transform: `rotate(${e.tiltAngle || 0}deg)`,
              }}
            >
              <p style={styles.date}>{e.date}</p>

              <div style={styles.mediaWrap} onClick={() => openGallery(e)}>
                {e.mediaType === 'video' ? (
                  <video src={e.mediaUrl} controls style={styles.media} />
                ) : (
                  <img
                    src={e.mediaUrl}
                    alt={e.caption}
                    style={{ ...styles.media, cursor: hasExtra ? 'pointer' : 'default' }}
                  />
                )}
                {hasExtra && (
                  <span style={styles.galleryBadge}>📷 gallery</span>
                )}
              </div>

              <p style={styles.caption}>{e.caption}</p>

              {/* Comments */}
              <div style={styles.commentsWrap}>
                {postComments.map(c => (
                  <div key={c._id} style={styles.commentRow}>
                    <span style={styles.commentIcon}>{c.author === 'you' ? '💙' : '💗'}</span>
                    <span style={styles.commentText}>{c.text}</span>
                  </div>
                ))}

                <div style={styles.commentInputRow}>
                  <input
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment[e._id] || ''}
                    onChange={ev => setNewComment(prev => ({ ...prev, [e._id]: ev.target.value }))}
                    onKeyDown={ev => ev.key === 'Enter' && submitComment(e._id)}
                  />
                  <button
                    style={styles.commentSendBtn}
                    onClick={() => submitComment(e._id)}
                  >
                    {role === 'you' ? '💙' : '💗'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {activeGallery && (
        <div style={styles.overlay} onClick={closeGallery}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={closeGallery}>✕</button>

            {(() => {
              const media = allMedia(activeGallery)
              const current = media[activeIndex]
              return (
                <>
                  {current.type === 'video' ? (
                    <video src={current.url} controls style={styles.modalMedia} />
                  ) : (
                    <img src={current.url} alt="" style={styles.modalMedia} />
                  )}
                  {media.length > 1 && (
                    <div style={styles.navRow}>
                      <button style={styles.navBtn} onClick={prevImage}>‹</button>
                      <p style={styles.counter}>{activeIndex + 1} / {media.length}</p>
                      <button style={styles.navBtn} onClick={nextImage}>›</button>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrap: { marginBottom: '2rem' },
  title: { fontSize: '18px', color: '#b5294e', marginBottom: '0.25rem', textAlign: 'center' },
  hint: { fontSize: '13px', color: '#999', marginBottom: '1.5rem', textAlign: 'center' },
  feed: { display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0 0.5rem' },
  card: {
    background: '#fff',
    border: '1px solid #f4c0d1',
    borderRadius: '10px',
    padding: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s',
  },
  date: { fontSize: '11px', color: '#bbb', marginBottom: '8px' },
  mediaWrap: { position: 'relative' },
  media: { width: '100%', borderRadius: '6px', display: 'block' },
  galleryBadge: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: '12px',
    padding: '3px 8px',
    borderRadius: '12px',
  },
  caption: { fontSize: '14px', color: '#444', lineHeight: '1.5', marginTop: '10px' },
  commentsWrap: {
    marginTop: '12px',
    paddingTop: '10px',
    borderTop: '1px solid #f4c0d1',
  },
  commentRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    marginBottom: '6px',
  },
  commentIcon: { fontSize: '13px' },
  commentText: { fontSize: '13px', color: '#555', lineHeight: '1.4' },
  commentInputRow: {
    display: 'flex',
    gap: '6px',
    marginTop: '8px',
  },
  commentInput: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: '20px',
    border: '1px solid #f4c0d1',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'Georgia, serif',
  },
  commentSendBtn: {
    background: '#fbeaf0',
    border: '1px solid #f4c0d1',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '1rem',
  },
  modalContent: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalMedia: { maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px' },
  closeBtn: {
    position: 'absolute',
    top: '-40px',
    right: '0',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '12px',
  },
  navBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  counter: { color: '#fff', fontSize: '13px' },
}

export default Timeline