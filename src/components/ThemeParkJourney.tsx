import { useState } from 'react'
import { Reveal } from './Effects'

const attractions = [
  {
    number: '01',
    title: 'The Love Coaster',
    copy: 'Fast turns, unexpected drops and the easiest decision at the end: choosing you again.',
    accent: 'rose',
  },
  {
    number: '02',
    title: 'The Swiftie Sky Loop',
    copy: 'A dramatic loop through every era, with excellent outfits and absolutely no skipping the bridge.',
    accent: 'violet',
  },
  {
    number: '03',
    title: 'Olivia Dean Sunset Stage',
    copy: 'Warm lights, a slower rhythm and the part of the evening that feels like it belongs only to us.',
    accent: 'sunset',
  },
] as const

const coasterPath = 'M -30 250 C 80 250 82 80 190 80 S 310 300 410 210 S 515 42 625 75 S 735 270 845 170 S 965 38 1080 175 S 1190 255 1250 135'

export function ThemeParkJourney() {
  const [rideRun, setRideRun] = useState(0)
  const [message, setMessage] = useState('Your birthday pass is ready.')

  function launchRide() {
    setRideRun((current) => current + 1)
    setMessage('The Love Coaster has left the station — hold on to Andre.')
    window.setTimeout(() => {
      setMessage('Ride complete. Best part: we get to build the next chapter ourselves.')
    }, 7200)
  }

  return (
    <section className="theme-park-section" id="birthday-park">
      <div className="park-aurora park-aurora-one" aria-hidden="true" />
      <div className="park-aurora park-aurora-two" aria-hidden="true" />
      <div className="park-stars" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => <i key={index} />)}
      </div>

      <Reveal className="park-heading">
        <p className="eyebrow">Emily’s birthday park · Admission for two</p>
        <h2>Welcome to the most<br /><em>beautiful ride.</em></h2>
        <p>
          Some stories move in straight lines. Ours has loops, surprises, quiet views and the kind of moments
          you want to ride again.
        </p>
      </Reveal>

      <div className="park-layout">
        <Reveal className="birthday-ticket" delay={90}>
          <div className="ticket-ribbon">Unlimited access</div>
          <div className="ticket-topline">
            <span>GBF PARKS · SPECIAL EVENT</span>
            <strong>30</strong>
          </div>
          <div className="ticket-main">
            <small>Admit</small>
            <h3>Emily<br />+ Andre</h3>
            <p>Valid for every adventure, every laugh and every chapter still waiting for us.</p>
          </div>
          <div className="ticket-code" aria-hidden="true">
            <span>16</span><i /><span>07</span><i /><span>26</span>
          </div>
          <button type="button" className="ride-button" onClick={launchRide}>
            <span>Launch the birthday ride</span>
            <b aria-hidden="true">→</b>
          </button>
          <p className="ride-message" aria-live="polite">{message}</p>
        </Reveal>

        <Reveal className="park-stage" delay={180}>
          <div className="park-marquee" aria-hidden="true">
            <span>Emily’s Birthday Park</span>
            <div>{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
          </div>

          <div className="ferris-wheel" aria-hidden="true">
            <div className="wheel-ring">
              <span className="spoke spoke-1" />
              <span className="spoke spoke-2" />
              <span className="spoke spoke-3" />
              <span className="spoke spoke-4" />
              {Array.from({ length: 8 }, (_, index) => <i className={`cabin cabin-${index + 1}`} key={index} />)}
            </div>
            <div className="wheel-support wheel-support-left" />
            <div className="wheel-support wheel-support-right" />
          </div>

          <svg className="coaster-scene" viewBox="0 0 1200 330" preserveAspectRatio="none" aria-label="Animated birthday roller coaster">
            <defs>
              <linearGradient id="coasterTrackGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff6fae" />
                <stop offset="48%" stopColor="#ffd166" />
                <stop offset="100%" stopColor="#55d6d1" />
              </linearGradient>
              <filter id="trackGlow" x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path className="coaster-shadow" d={coasterPath} />
            <path className="coaster-track" d={coasterPath} pathLength="1" />
            <path className="coaster-rail" d={coasterPath} pathLength="1" />
            {rideRun > 0 && (
              <g className="coaster-svg-train" key={rideRun}>
                <rect x="-25" y="-17" width="50" height="26" rx="8" />
                <circle cx="-13" cy="12" r="6" />
                <circle cx="13" cy="12" r="6" />
                <text x="0" y="1" textAnchor="middle">E + A</text>
                <animateMotion dur="7s" begin="0s" fill="freeze" rotate="auto" path={coasterPath} />
              </g>
            )}
          </svg>

          <div className="coaster-station">
            <span>Next departure</span>
            <strong>Whenever you press the button</strong>
          </div>
        </Reveal>
      </div>

      <div className="attractions-grid">
        {attractions.map((attraction, index) => (
          <Reveal key={attraction.number} delay={220 + index * 70}>
            <article className={`attraction-card attraction-${attraction.accent}`}>
              <div className="attraction-number">{attraction.number}</div>
              <div className="attraction-icon" aria-hidden="true">
                <span /><span /><span />
              </div>
              <h3>{attraction.title}</h3>
              <p>{attraction.copy}</p>
              <small>Open all day · Memories included</small>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="park-bottom-line" aria-hidden="true">
        <span>Love</span><i />
        <span>Music</span><i />
        <span>Adventure</span><i />
        <span>Chapter 30</span>
      </div>
    </section>
  )
}
