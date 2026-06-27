import { useState, useEffect, useRef } from 'react'

const START_DATE = new Date('2025-06-28T00:00:00')
const TARGET_MS = 365 * 24 * 60 * 60 * 1000
const MUSIC_URL = 'https://res.cloudinary.com/dzrszofak/video/upload/v1782544589/golden_brown_x_love_story__music_256k_ehw4hv.mp3'

const BUTTON_TEXTS = ['One last surprise', 'For you', 'Open when you\'re ready']

const REVEAL_LINES = [
  { text: '365 days...', delay: 0.3 },
  { text: 'countless memories...', delay: 1.6 },
  { text: 'a love that keeps growing.', delay: 2.9 },
  { text: 'Thank you for every smile, every hug, every quiet moment.', delay: 4.6 },
  { text: "I don't know exactly where life will take us, but I hope that someday, us and our families become one.", delay: 7.0 },
]

function Countdown() {
  const [elapsed, setElapsed] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const [particles, setParticles] = useState([])
  const [hearts, setHearts] = useState([])
  const [escapingHearts, setEscapingHearts] = useState([])
  const [pressed, setPressed] = useState(false)
  const [burstRing, setBurstRing] = useState([])
  const [showSignature, setShowSignature] = useState(false)
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

  useEffect(() => {
    if (!unlocked || showCelebration) return
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % BUTTON_TEXTS.length)
    }, 3500)
    return () => clearInterval(textInterval)
  }, [unlocked, showCelebration])

  useEffect(() => {
    if (!showCelebration) {
      setShowSignature(false)
      return
    }
    const t = setTimeout(() => setShowSignature(true), 9200)
    return () => clearTimeout(t)
  }, [showCelebration])

  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60)
  const seconds = Math.floor((elapsed / 1000) % 60)

  const handleHover = () => {
    const newHearts = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      left: 40 + Math.random() * 20,
      drift: Math.random() * 30 - 15,
    }))
    setEscapingHearts(prev => [...prev, ...newHearts])
    setTimeout(() => {
      setEscapingHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id)))
    }, 1500)
  }

  const handleClick = () => {
    setPressed(true)

    const ring = Array.from({ length: 12 }, (_, i) => {
      const ang = (i / 12) * Math.PI * 2
      const dist = 55 + Math.random() * 18
      return { id: i, bx: Math.cos(ang) * dist, by: Math.sin(ang) * dist }
    })
    setBurstRing(ring)

    setTimeout(() => {
      launchCelebration()
    }, 550)
  }

  const launchCelebration = () => {
    setShowCelebration(true)

    const newParticles = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      drift: Math.random() * 40 - 20,
      size: 2 + Math.random() * 3,
      duration: 6 + Math.random() * 4,
      delay: Math.random() * 4,
      isHeart: Math.random() > 0.7,
    }))
    setParticles(newParticles)

    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      drift: Math.random() * 40 - 20,
      size: 12 + Math.random() * 10,
      duration: 6 + Math.random() * 3,
      delay: Math.random() * 4,
    }))
    setHearts(newHearts)

    if (audioRef.current) {
      audioRef.current.volume = 0.4
      audioRef.current.play().catch(() => {})
    }
  }

  const closeCelebration = () => {
    setShowCelebration(false)
    setPressed(false)
    setParticles([])
    setHearts([])
    setBurstRing([])
    setShowSignature(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <>
      <div className="countdown-wrap">
        {/* TEMP TESTING BUTTON — remove before sending to her */}
        <button
          onClick={() => {
            localStorage.removeItem('anniversaryUnlocked')
            window.location.reload()
          }}
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            fontSize: '10px',
            background: 'transparent',
            border: 'none',
            color: 'rgba(181,41,78,0.3)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          reset
        </button>

        <p className="countdown-label">together for</p>
        <div className="countdown-row">
          <Unit value={days} label="days" />
          <Unit value={hours} label="hours" />
          <Unit value={minutes} label="minutes" />
          <Unit value={seconds} label="seconds" />
        </div>

        {unlocked && (
          <div className="countdown-button-stage">
            <button
              className={`countdown-surprise-btn${pressed ? ' pressed' : ''}`}
              onMouseEnter={handleHover}
              onClick={handleClick}
            >
              <span key={textIndex} className="anniv-text-fade countdown-btn-text">
                {BUTTON_TEXTS[textIndex]}
              </span>
              <div className="countdown-orbit-wrap">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <span
                    key={i}
                    className="countdown-orbit-sparkle"
                    style={{
                      animationDuration: `${5 + (i % 3)}s`,
                      animationDelay: `${i * 0.7}s`,
                    }}
                  >
                    ✦
                  </span>
                ))}
              </div>
            </button>

            {escapingHearts.map(h => (
              <span
                key={h.id}
                className="countdown-escaping-heart"
                style={{
                  left: `${h.left}%`,
                  '--drift': `${h.drift}px`,
                }}
              >
                ✦
              </span>
            ))}

            {burstRing.map(s => (
              <span
                key={s.id}
                className="countdown-burst-ring"
                style={{
                  '--bx': `${s.bx}px`,
                  '--by': `${s.by}px`,
                }}
              >
                ✦
              </span>
            ))}
          </div>
        )}
      </div>

      <audio ref={audioRef} src={MUSIC_URL} loop />

      {showCelebration && (
        <div className="countdown-overlay anniv-fadeInDark">
          <div className="countdown-ambient-glow" />

          {particles.map(p => (
            <div
              key={p.id}
              className={`countdown-particle${p.isHeart ? ' is-heart' : ''}`}
              style={{
                left: `${p.left}%`,
                '--drift': `${p.drift}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                fontSize: p.isHeart ? '10px' : undefined,
                width: !p.isHeart ? `${p.size}px` : undefined,
                height: !p.isHeart ? `${p.size}px` : undefined,
              }}
            >
              {p.isHeart ? '✦' : ''}
            </div>
          ))}

          {hearts.map(h => (
            <div
              key={h.id}
              className="countdown-rising-heart"
              style={{
                left: `${h.left}%`,
                fontSize: `${h.size}px`,
                '--drift': `${h.drift}px`,
                animationDuration: `${h.duration}s`,
                animationDelay: `${h.delay}s`,
              }}
            >
              ♡
            </div>
          ))}

          <div className="countdown-card anniv-cardFadeIn">
            <div className="countdown-shimmer" />

            <div className="countdown-icon-glow">
              <div className="countdown-icon-heart" />
            </div>

            <h2 className="countdown-card-title anniv-line">
              Happy one year, my love
            </h2>

            <div className="countdown-body-wrap">
              {REVEAL_LINES.map((line, i) => (
                <p
                  key={i}
                  className="countdown-body-line anniv-line"
                  style={{ animationDelay: `${line.delay}s` }}
                >
                  {line.text}
                </p>
              ))}
            </div>

            {showSignature && (
              <p className="countdown-signature anniv-signatureFade">
                Forever.
              </p>
            )}

            <button className="countdown-close-btn" onClick={closeCelebration}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=Playfair+Display:ital@1&display=swap');

        /* ── Countdown Wrap ── */
        .countdown-wrap {
          background: rgba(255, 245, 248, 0.55);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(212, 160, 180, 0.25);
          border-radius: 24px;
          padding: 2rem 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          position: relative;
          box-shadow: 0 4px 32px rgba(181, 41, 78, 0.08), inset 0 1px 0 rgba(255,255,255,0.6);
        }

        .countdown-label {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 13px;
          font-style: italic;
          color: rgba(140, 60, 90, 0.7);
          margin-bottom: 1.2rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .countdown-row {
          display: flex;
          justify-content: center;
          gap: 0;
        }

        /* ── Unit ── */
        .countdown-unit {
          min-width: 64px;
          padding: 0 0.5rem;
          position: relative;
        }
        .countdown-unit:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(181, 41, 78, 0.15);
        }

        .countdown-unit-value {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 36px;
          font-weight: 300;
          color: #8c1c3a;
          line-height: 1;
          letter-spacing: -1px;
          margin: 0 0 4px;
        }

        .countdown-unit-label {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(140, 60, 90, 0.5);
          margin: 0;
        }

        /* ── Button Stage ── */
        .countdown-button-stage {
          margin-top: 1.8rem;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70px;
        }

        .countdown-surprise-btn {
          position: relative;
          padding: 14px 40px;
          border-radius: 999px;
          border: 1px solid rgba(212, 160, 180, 0.4);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 220, 230, 0.5) 50%,
            rgba(220, 180, 195, 0.4) 100%
          );
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.5px;
          color: #6d1f38;
          cursor: pointer;
          animation: anniv-floatBtn 3.5s ease-in-out infinite, anniv-heartbeat 4s ease-in-out infinite;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          overflow: visible;
        }

        .countdown-surprise-btn.pressed {
          transform: scale(0.92) !important;
        }

        .countdown-btn-text {
          position: relative;
          z-index: 2;
        }

        .countdown-orbit-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .countdown-orbit-sparkle {
          position: absolute;
          left: 50%;
          top: 50%;
          font-size: 9px;
          margin-left: -5px;
          margin-top: -5px;
          color: rgba(200, 130, 150, 0.7);
          animation: anniv-orbit 6s linear infinite;
          opacity: 0.8;
        }

        .countdown-escaping-heart {
          position: absolute;
          top: 40%;
          font-size: 9px;
          pointer-events: none;
          opacity: 0.6;
          color: rgba(181, 41, 78, 0.7);
          animation: anniv-heartRise 1.4s ease-out forwards;
        }

        .countdown-burst-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          font-size: 8px;
          pointer-events: none;
          color: rgba(200, 140, 160, 0.8);
          animation: anniv-sparkleBurstRing 0.7s ease-out forwards;
        }

        /* ── Overlay & Card ── */
        .countdown-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 1000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(3px);
        }

        .countdown-ambient-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200, 130, 150, 0.15), transparent 70%);
          animation: anniv-ambientPulse 6s ease-in-out infinite;
          z-index: 0;
        }

        .countdown-particle {
          position: absolute;
          top: -10px;
          z-index: 1;
          animation: anniv-driftDown linear infinite;
          border-radius: 50%;
          background: rgba(255, 220, 228, 0.5);
          box-shadow: 0 0 5px rgba(255, 200, 210, 0.4);
          opacity: 0.5;
          color: rgba(200, 130, 150, 0.7);
        }

        .countdown-rising-heart {
          position: absolute;
          bottom: -20px;
          z-index: 1;
          opacity: 0.4;
          color: rgba(181, 41, 78, 0.6);
          animation: anniv-heartRiseSlow ease-out infinite;
        }

        .countdown-card {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 380px;
          margin: 1rem;
          padding: 3.5rem 2.5rem 2.8rem;
          border-radius: 28px;
          background: rgba(15, 8, 12, 0.75);
          backdrop-filter: blur(28px) saturate(140%);
          -webkit-backdrop-filter: blur(28px) saturate(140%);
          border: 1px solid rgba(255, 210, 220, 0.15);
          box-shadow:
            0 0 60px rgba(200, 100, 130, 0.1),
            0 30px 80px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          text-align: center;
          overflow: hidden;
        }

        .countdown-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 60%;
          height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.04), transparent);
          animation: anniv-shimmerPass 7s ease-in-out infinite;
          pointer-events: none;
        }

        .countdown-icon-glow {
          width: 36px;
          height: 36px;
          margin: 0 auto 2rem;
          border-radius: 50%;
          background: rgba(255, 200, 215, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: anniv-iconPulse 3.5s ease-in-out infinite;
          border: 1px solid rgba(255, 200, 215, 0.2);
        }

        .countdown-icon-heart {
          width: 8px;
          height: 8px;
          background: rgba(255, 210, 225, 0.85);
          border-radius: 50%;
        }

        .countdown-card-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          font-size: 28px;
          letter-spacing: 0.5px;
          color: rgba(255, 240, 244, 0.95);
          margin-bottom: 2rem;
          line-height: 1.3;
        }

        .countdown-body-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .countdown-body-line {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 15px;
          font-style: italic;
          line-height: 1.75;
          color: rgba(230, 210, 218, 0.8);
          margin: 0;
        }

        .countdown-signature {
          font-family: 'Playfair Display', cursive;
          font-style: italic;
          font-size: 30px;
          color: rgba(255, 200, 215, 0.9);
          margin-top: 2rem;
          margin-bottom: 0.5rem;
        }

        .countdown-close-btn {
          margin-top: 2rem;
          background: linear-gradient(
            135deg,
            rgba(181, 41, 78, 0.6) 0%,
            rgba(140, 30, 60, 0.5) 100%
          );
          color: rgba(255, 230, 238, 0.95);
          border: 1px solid rgba(255, 180, 200, 0.2);
          border-radius: 999px;
          padding: 12px 36px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(181, 41, 78, 0.2);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          backdrop-filter: blur(8px);
        }

        .countdown-close-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 32px rgba(181, 41, 78, 0.3);
        }

        /* ── Shared Animations ── */
        @keyframes anniv-floatBtn {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-5px) }
        }

        @keyframes anniv-heartbeat {
          0%,90%,100% {
            box-shadow: 0 0 0 1px rgba(212,160,180,0.3),
                        0 8px 32px rgba(181,41,78,0.15),
                        0 0 40px rgba(255,200,215,0.3)
          }
          93% {
            box-shadow: 0 0 0 1px rgba(212,160,180,0.5),
                        0 8px 36px rgba(181,41,78,0.25),
                        0 0 60px rgba(255,180,200,0.5)
          }
          96% {
            box-shadow: 0 0 0 1px rgba(212,160,180,0.3),
                        0 8px 32px rgba(181,41,78,0.15),
                        0 0 40px rgba(255,200,215,0.3)
          }
        }

        @keyframes anniv-orbit {
          from { transform: rotate(0deg) translateX(72px) rotate(0deg); opacity: 0.8 }
          to   { transform: rotate(360deg) translateX(72px) rotate(-360deg); opacity: 0.8 }
        }

        @keyframes anniv-text-fade-kf {
          0%,28%  { opacity: 1; transform: translateY(0) }
          33%,95% { opacity: 0; transform: translateY(-6px) }
          100%    { opacity: 0 }
        }
        .anniv-text-fade {
          animation: anniv-text-fade-kf 3.5s ease-in-out;
          display: inline-block;
        }

        @keyframes anniv-sparkleBurstRing {
          0%   { transform: translate(0,0) scale(0.4); opacity: 1 }
          100% { transform: translate(var(--bx), var(--by)) scale(1); opacity: 0 }
        }

        @keyframes anniv-heartRise {
          0%   { transform: translateY(0) scale(0.6); opacity: 0 }
          12%  { opacity: 0.9 }
          100% { transform: translateY(-60px) translateX(var(--drift,0px)) scale(1.1); opacity: 0 }
        }

        @keyframes anniv-heartRiseSlow {
          0%   { transform: translateY(0) scale(0.7); opacity: 0 }
          15%  { opacity: 0.45 }
          85%  { opacity: 0.3 }
          100% { transform: translateY(-90vh) translateX(var(--drift,0px)) scale(1); opacity: 0 }
        }

        @keyframes anniv-driftDown {
          0%   { transform: translateY(0) translateX(0); opacity: 0 }
          10%  { opacity: 0.5 }
          90%  { opacity: 0.25 }
          100% { transform: translateY(100vh) translateX(var(--drift,0px)); opacity: 0 }
        }

        @keyframes anniv-fadeInDark-kf {
          from { background: rgba(8,4,8,0) }
          to   { background: rgba(8,4,10,0.93) }
        }
        .anniv-fadeInDark {
          animation: anniv-fadeInDark-kf 1.4s ease forwards;
        }

        @keyframes anniv-ambientPulse {
          0%,100% { opacity: 0.2; transform: scale(1) }
          50%     { opacity: 0.35; transform: scale(1.08) }
        }

        @keyframes anniv-cardFadeIn-kf {
          0%   { opacity: 0; transform: scale(0.95) translateY(10px) }
          100% { opacity: 1; transform: scale(1) translateY(0) }
        }
        .anniv-cardFadeIn {
          animation:
            anniv-cardFadeIn-kf 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards,
            anniv-cardFloat 8s ease-in-out 2.1s infinite;
          opacity: 0;
        }

        @keyframes anniv-cardFloat {
          0%,100% { transform: translateY(0) }
          50%     { transform: translateY(-5px) }
        }

        @keyframes anniv-shimmerPass {
          0%   { transform: translateX(-120%) }
          100% { transform: translateX(120%) }
        }

        @keyframes anniv-lineReveal {
          0%   { opacity: 0; transform: translateY(8px) }
          100% { opacity: 1; transform: translateY(0) }
        }
        .anniv-line {
          opacity: 0;
          animation: anniv-lineReveal 1.4s ease-out forwards;
        }

        @keyframes anniv-signatureFade-kf {
          0%   { opacity: 0; transform: translateY(6px) scale(0.97) }
          100% { opacity: 1; transform: translateY(0) scale(1) }
        }
        .anniv-signatureFade {
          animation: anniv-signatureFade-kf 1.6s ease-out forwards;
        }

        @keyframes anniv-iconPulse {
          0%,100% { opacity: 0.4; box-shadow: 0 0 14px 2px rgba(255,200,215,0.2) }
          50%     { opacity: 0.85; box-shadow: 0 0 24px 6px rgba(255,200,215,0.4) }
        }
      `}</style>
    </>
  )
}

function Unit({ value, label }) {
  return (
    <div className="countdown-unit">
      <p className="countdown-unit-value">{String(value).padStart(2, '0')}</p>
      <p className="countdown-unit-label">{label}</p>
    </div>
  )
}

export default Countdown