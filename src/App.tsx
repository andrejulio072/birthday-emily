import { useEffect, useMemo, useState } from 'react'
import { eras, evidence, profileTraits, reasons } from './data'

const birthday = new Date('2026-07-16T00:00:00+01:00')

function Countdown() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const values = useMemo(() => {
    const difference = birthday.getTime() - now.getTime()
    if (difference <= 0) return null
    return {
      days: Math.floor(difference / 86_400_000),
      hours: Math.floor((difference / 3_600_000) % 24),
      minutes: Math.floor((difference / 60_000) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }, [now])

  if (!values) return <p className="birthday-live">Chapter 30 is officially here ✦</p>

  return (
    <div className="countdown" aria-label="Countdown to Emily's birthday">
      {Object.entries(values).map(([label, value]) => (
        <div className="countdown-item" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

function PhotoSlot({ src, alt, className, label }: { src: string; alt: string; className: string; label: string }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className={className}>
      {!failed && (
        <img
          className={loaded ? 'media-image loaded' : 'media-image'}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {!loaded && (
        <div className="media-placeholder-copy">
          <span>{label}</span>
          <small>{src}</small>
        </div>
      )}
    </div>
  )
}

function VideoSlot() {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className="video-frame">
      {!failed && (
        <video
          className={ready ? 'birthday-video ready' : 'birthday-video'}
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={() => setReady(true)}
          onError={() => setFailed(true)}
        >
          <source src="/video/message.mp4" type="video/mp4" />
        </video>
      )}
      {!ready && (
        <div className="video-placeholder-copy">
          <div className="play-icon">▶</div>
          <p>YOUR VIDEO MESSAGE</p>
          <small>/video/message.mp4</small>
        </div>
      )}
    </div>
  )
}

function App() {
  const [entered, setEntered] = useState(false)
  const [openReason, setOpenReason] = useState<number | null>(null)
  const [openEvidence, setOpenEvidence] = useState<string | null>('01')

  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [entered])

  return (
    <>
      {!entered && (
        <div className="intro-screen">
          <div className="intro-glow" />
          <p className="eyebrow">Private invitation · 16 July 2026</p>
          <h1>Emily</h1>
          <p className="intro-copy">A new chapter is ready for you.</p>
          <button className="primary-button" onClick={() => setEntered(true)}>
            Enter Chapter 30
          </button>
          <p className="microcopy">Created with love by Andre</p>
        </div>
      )}

      <main className={entered ? 'page page-visible' : 'page'}>
        <section className="hero section-dark" id="top">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <nav className="nav-shell">
            <a className="monogram" href="#top" aria-label="Back to top">E</a>
            <span>Emily · Chapter 30</span>
            <a href="#promise">The promise</a>
          </nav>

          <div className="hero-content">
            <p className="eyebrow">Case file Nº 30 · Strictly confidential</p>
            <h2>Happy 30th<br /><em>Birthday, Emily.</em></h2>
            <p className="hero-copy">
              Thirty years of a beautiful mind, a gentle heart, unforgettable energy and just enough true-crime knowledge to keep me slightly nervous.
            </p>
            <Countdown />
            <a className="text-link" href="#profile">Begin the investigation ↓</a>
          </div>

          <PhotoSlot
            src="/photos/hero.jpg"
            alt="Emily"
            className="hero-photo-placeholder"
            label="YOUR PHOTO"
          />
        </section>

        <section className="section-light" id="profile">
          <div className="section-heading">
            <p className="eyebrow dark">Psychological profile</p>
            <h2>The woman behind<br />the beautiful mystery.</h2>
            <p>No clinical diagnosis. Just an affectionate collection of facts that make you unmistakably you.</p>
          </div>
          <div className="profile-grid">
            {profileTraits.map((trait) => (
              <article className="profile-card" key={trait.label}>
                <span className="profile-icon">{trait.icon}</span>
                <p>{trait.label}</p>
                <h3>{trait.value}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section-plum" id="eras">
          <div className="section-heading centered">
            <p className="eyebrow">A life in chapters</p>
            <h2>The Emily eras.</h2>
            <p>Not costumes. Not characters. Different parts of the same extraordinary woman.</p>
          </div>
          <div className="eras-list">
            {eras.map((era) => (
              <article className="era-card" key={era.number}>
                <span>{era.number}</span>
                <div>
                  <h3>{era.title}</h3>
                  <p>{era.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-paper" id="evidence">
          <div className="section-heading">
            <p className="eyebrow dark">Collected evidence</p>
            <h2>Evidence that you are extraordinary.</h2>
            <p>Tap each file to inspect the findings.</p>
          </div>
          <div className="evidence-layout">
            <div className="evidence-tabs" role="tablist" aria-label="Evidence files">
              {evidence.map((item) => (
                <button
                  key={item.id}
                  className={openEvidence === item.id ? 'evidence-tab active' : 'evidence-tab'}
                  onClick={() => setOpenEvidence(item.id)}
                  role="tab"
                  aria-selected={openEvidence === item.id}
                >
                  <span>Evidence {item.id}</span>
                  <strong>{item.title}</strong>
                </button>
              ))}
            </div>
            <article className="evidence-file">
              <div className="file-stamp">CONFIDENTIAL</div>
              {evidence.filter((item) => item.id === openEvidence).map((item) => (
                <div key={item.id}>
                  <p className="eyebrow dark">Finding {item.id}</p>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <div className="verdict">Verdict: guilty of being completely unforgettable.</div>
                </div>
              ))}
            </article>
          </div>
        </section>

        <section className="section-dark photo-section" id="memories">
          <div className="section-heading centered">
            <p className="eyebrow">The Emily archives</p>
            <h2>Memories worth keeping.</h2>
            <p>Your photos will live here naturally, without filters that change who you are.</p>
          </div>
          <div className="photo-grid">
            {['01', '02', '03', '04'].map((number) => (
              <PhotoSlot
                key={number}
                src={`/photos/memory-${number}.jpg`}
                alt={`A memory with Emily ${number}`}
                className={`photo-placeholder photo-${number}`}
                label={`PHOTO ${number}`}
              />
            ))}
          </div>
        </section>

        <section className="section-light" id="reasons">
          <div className="section-heading centered narrow">
            <p className="eyebrow dark">Thirty for thirty</p>
            <h2>30 reasons I love you.</h2>
            <p>Some are profound. Some are small. Every one of them is true.</p>
          </div>
          <div className="reasons-grid">
            {reasons.map((reason, index) => (
              <button
                className={openReason === index ? 'reason-card open' : 'reason-card'}
                key={reason}
                onClick={() => setOpenReason(openReason === index ? null : index)}
                aria-expanded={openReason === index}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{openReason === index ? reason : 'Tap to reveal'}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="section-plum video-section" id="message">
          <VideoSlot />
          <div className="video-copy">
            <p className="eyebrow">In my own voice</p>
            <h2>Some things needed to be said properly.</h2>
            <p>This space is ready for the birthday video you record for her. The final page can use a custom poster image and play it directly without leaving the experience.</p>
          </div>
        </section>

        <section className="section-paper promise-section" id="promise">
          <div className="promise-mark">♡</div>
          <p className="eyebrow dark">The final statement</p>
          <h2>My promise to you.</h2>
          <div className="promise-copy">
            <p>On your thirtieth birthday, I am not promising you a perfect story.</p>
            <p>I am promising to choose you with love, patience and honesty. To respect your heart, keep learning you, and continue choosing you through every chapter we build together.</p>
            <p>Happy birthday, Emily.<br />Welcome to your next era.</p>
          </div>
          <p className="signature">With love, Andre</p>
          <a className="primary-button dark-button" href="#top">Return to the beginning</a>
        </section>

        <footer>
          <p>Case closed · Emily is 30, deeply loved and only getting started.</p>
          <span>16 · 07 · 2026</span>
        </footer>
      </main>
    </>
  )
}

export default App
