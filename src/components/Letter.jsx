function Letter() {
  return (
    <div style={styles.card}>
      <p style={styles.date}>June 27, 2026</p>
      <p style={styles.body}>
        My dearest,{'\n\n'}
        One year ago, something wonderful started — you.{'\n\n'}
        This past year, you have made ordinary days feel like little adventures.
        Your laugh is my favorite sound. Your presence is my favorite place.{'\n\n'}
        I'm so grateful you're mine, and I am yours. 💗
      </p>
      <p style={styles.sign}>— forever yours</p>
    </div>
  )
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #f4c0d1',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    textAlign: 'left',
  },
  date: { fontSize: '12px', color: '#bbb', marginBottom: '1rem' },
  body: { fontSize: '15px', lineHeight: '1.9', color: '#444', whiteSpace: 'pre-wrap' },
  sign: { marginTop: '1rem', fontStyle: 'italic', color: '#b5294e' },
}

export default Letter