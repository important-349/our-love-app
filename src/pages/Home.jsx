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
    <>
      <div className="home-page">

        <div className="home-header">
          <div className="home-icon-glow">
            <div className="home-icon-heart" />
          </div>
          <h1 className="home-title">Happy One Year, My Love</h1>
          <p className="home-subtitle">June 28, 2025 — June 28, 2026</p>        </div>

        <Countdown />

        {!letterOpen ? (
          <div className="home-envelope" onClick={() => setLetterOpen(true)}>
            <div className="home-envelope-shimmer" />
            <p className="home-envelope-text">tap to open your letter</p>
          </div>
        ) : (
          <Letter />
        )}

        <Timeline role={role} />
        {/* Reasons */}
        
        {/* MessageBox */}
        

        <button
          onClick={() => navigate('/admin')}
          className="home-secret-btn"
          title=""
        >
          ✦
        </button>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');

        .home-page {
          max-width: 480px;
          margin: 0 auto;
          padding: 2.5rem 1.2rem 4rem;
          text-align: center;
          position: relative;
        }

        .home-header {
          margin-bottom: 2.2rem;
        }

        .home-icon-glow {
          width: 44px;
          height: 44px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: rgba(255, 200, 215, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: home-iconPulse 3.5s ease-in-out infinite;
          border: 1px solid rgba(212, 160, 180, 0.3);
        }

        .home-icon-heart {
          width: 12px;
          height: 12px;
          background: rgba(181, 41, 78, 0.7);
          border-radius: 50%;
        }

        @keyframes home-iconPulse {
          0%,100% { opacity: 0.6; box-shadow: 0 0 14px 2px rgba(255,200,215,0.25) }
          50%     { opacity: 1;   box-shadow: 0 0 26px 6px rgba(255,200,215,0.45) }
        }

        .home-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 400;
          font-size: 30px;
          letter-spacing: 0.3px;
          color: rgba(80, 20, 45, 0.9);
          margin: 0 0 0.5rem;
          line-height: 1.25;
        }

        .home-subtitle {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 13px;
          font-style: italic;
          letter-spacing: 1px;
          color: rgba(140, 80, 110, 0.55);
          margin: 0;
        }

        .home-envelope {
          position: relative;
          background: linear-gradient(160deg, rgba(255, 248, 251, 0.75), rgba(255, 240, 246, 0.65));
          backdrop-filter: blur(24px) saturate(150%);
          -webkit-backdrop-filter: blur(24px) saturate(150%);
          border: 1px solid rgba(212, 160, 180, 0.3);
          border-radius: 18px;
          padding: 2.2rem 1.5rem;
          margin-bottom: 2rem;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 4px 28px rgba(181, 41, 78, 0.07), inset 0 1px 0 rgba(255,255,255,0.6);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .home-envelope:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 36px rgba(181, 41, 78, 0.12), inset 0 1px 0 rgba(255,255,255,0.7);
        }

        .home-envelope:active {
          transform: scale(0.98);
        }

        .home-envelope-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 55%;
          height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: home-shimmerPass 7s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes home-shimmerPass {
          0%   { transform: translateX(-120%) }
          100% { transform: translateX(220%) }
        }

        .home-envelope-text {
          position: relative;
          z-index: 1;
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 16px;
          font-style: italic;
          color: rgba(120, 30, 60, 0.75);
          margin: 0;
          letter-spacing: 0.3px;
        }

        .home-secret-btn {
          position: fixed;
          bottom: 18px;
          left: 18px;
          background: transparent;
          border: none;
          font-size: 13px;
          color: rgba(181, 41, 78, 0.5);
          opacity: 0.18;
          cursor: pointer;
          padding: 8px;
          transition: opacity 0.3s ease;
        }

        .home-secret-btn:hover {
          opacity: 0.4;
        }
      `}</style>
    </>
  )
}

export default Home