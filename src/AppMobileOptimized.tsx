import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { eras, evidence, profileTraits, reasons } from './data'
import {
  BurstLayer,
  CaseProgress,
  CursorGlow,
  DodgingButton,
  FinaleOverlay,
  Reveal,
  SecretStars,
  TiltCard,
  playChime,
} from './components/Effects'
import { PhotoSlot, SwipeGallery, Typewriter, VideoSlot } from './components/Media'
import { AdaptiveDanceVisualizer, AdaptiveParticleField } from './components/Performance'

const LazyTrueCrimeUnit = lazy(() =>
  import('./components/TrueCrime').then((module) => ({ default: module.TrueCrimeUnit })),
)

const birthday = new Date('2026-07-16T00:00:00+01:00')

function DeferredTrueCrime({ onReward }: { onReward: () => void }) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const shell = shellRef.current
    if (!shell || ready) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setReady(true)
        observer.disconnect()
      },
      { rootMargin: '700px 0px', threshold: 0 },
    )

    observer.observe(shell)
    return () => observer.disconnect()
  }, [ready])

  return (
    <div ref={shellRef} className="deferred-crime-shell">
      {ready ? (
        <Suspense
          fallback={(
            <div className="deferred-crime-placeholder">
              <div><span /><p>Loading Emily’s investigation unit</p></div>
            </div>
          )}
        >
          <LazyTrueCrimeUnit onReward={onReward} />
        </Suspense>
      ) : (
        <div className="deferred-crime-placeholder" aria-hidden="true">
          <div><span /><p>Investigation file secured</p></div>
        </div>
      )}
    </div>
  )
}

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

function AppMobileOptimized() {
  const [entered, setEntered] = useState(false)
  const [introReady, setIntroReady] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [openReason, setOpenReason] = useState<number | null>(null)
  const [openEvidence, setOpenEvidence] = useState('01')
  const [activeEra, setActiveEra] = useState(0)
  const [stars, setStars] = useState<Set<number>>(() => new Set())
  const [burst, setBurst] = useState<{ id: number; x: number; y: number } | null>(null)
  const [finale, setFinale] = useState(false)

  const markIntroReady = useCallback(() => setIntroReady(true), [])

  const triggerReward = useCallback(() => {
    setBurst({ id: Date.now(), x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 })
    playChime(soundOn, [523.25, 659.25, 783.99])
  }, [soundOn])

  const enterExperience = (withSound: boolean) => {
    setSoundOn(withSound)
    setEntered(true)
    playChime(withSound, [392, 523.25, 659.25, 783.99])
  }

  useEffect(() => {
    document.documentElement.classList.add('adaptive-performance')
    return () => document.documentElement.classList.remove('adaptive-performance')
  }, [])

  useEffect(() => {
    document.body.style.overflow = entered && !finale ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [entered, finale])

  return (
    <>
      {!entered && (
        <div className="intro-screen cinematic-intro">
          <AdaptiveParticleField />
          <div className="intro-vignette" />
          <div className="intro-file-number">GBF / EMILY / 30</div>
          <div className="intro-terminal">
            <p className="eyebrow">Private investigation · 16 July 2026</p>
            <div className="intro-status"><i /> Secure birthday file detected</div>
            <h1>Emily</h1>
            <div className="intro-type">
              <Typewriter
                lines={[
                  'SUBJECT: EMILY',
                  'STATUS: TURNING 30',
                  'THREAT LEVEL: EXTREMELY LOVABLE',
                ]}
                speed={31}
                onComplete={markIntroReady}
              />
            </div>
            <div className={introReady ? 'intro-actions ready' : 'intro-actions'}>
              <button className="primary-button" onClick={() => enterExperience(true)} disabled={!introReady}>
                Enter with sound
              </button>
              <button className="silent-button" onClick={() => enterExperience(false)} disabled={!introReady}>
                Enter silently
              </button>
            </div>
            <p className="microcopy">Created by Andre · No victims, only birthday surprises</p>
          </div>
          <div className="intro-scan" aria-hidden="true" />
        </div>
      )}

      <main className={entered ? 'page page-visible enhanced-page' : 'page'}>
        {entered && (
          <>
            <CursorGlow />
            <CaseProgress starsFound={stars.size} />
            <SecretStars
              found={stars}
              onFind={(index, point) => {
                setStars((current) => {
                  const next = new Set(current)
                  next.add(index)
                  return next
                })
                setBurst({ id: Date.now(), ...point })
                playChime(soundOn, [659.25, 783.99, 1046.5])
              }}
            />
            <BurstLayer burst={burst} />
            <button
              className="sound-toggle"
              onClick={() => {
                setSoundOn((value) => !value)
                if (!soundOn) playChime(true, [523.25, 659.25])
              }}
              aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundOn ? 'Sound on' : 'Sound off'}
            </button>
          </>
        )}

        <section className="hero section-dark" id="top">
          <AdaptiveParticleField />
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-grid" aria-hidden="true" />
          <nav className="nav-shell">
            <a className="monogram" href="#top" aria-label="Back to top">E</a>
            <span>Emily · Chapter 30</span>
            <a href="#promise">The final file</a>
          </nav>

          <Reveal className="hero-content">
            <p className="eyebrow">Case file Nº 30 · Strictly confidential</p>
            <div className="hero-status-row">
              <span>Psychology graduate</span>
              <span>True-crime specialist</span>
              <span>Vegan</span>
              <span>Swiftie</span>
            </div>
            <h2>Happy 30th<br /><em>Birthday, Emily.</em></h2>
            <p className="hero-copy">
              Thirty years of a beautiful mind, a gentle heart, unforgettable energy and enough knowledge of serial killers to make every charming stranger immediately suspicious.
            </p>
            <Countdown />
            <a className="text-link" href="#profile">Open the case ↓</a>
          </Reveal>

          <Reveal className="hero-photo-reveal" delay={250}>
            <PhotoSlot src="/photos/hero.jpg" alt="Emily" className="hero-photo-placeholder" label="Your hero photo" />
            <div className="photo-evidence-tag">EXHIBIT A · THE BIRTHDAY GIRL</div>
          </Reveal>
        </section>

        <section className="section-light profile-section" id="profile">
          <Reveal className="section-heading">
            <p className="eyebrow dark">Psychological profile</p>
            <h2>The woman behind<br />the beautiful mystery.</h2>
            <p>No diagnosis and no generic compliments. Just an affectionate behavioural profile of the woman who can analyse a criminal mind and then dance around the kitchen.</p>
          </Reveal>
          <div className="profile-grid">
            {profileTraits.map((trait, index) => (
              <Reveal key={trait.label} delay={index * 70}>
                <TiltCard className="profile-card">
                  <span className="profile-icon">{trait.icon}</span>
                  <p>{trait.label}</p>
                  <h3>{trait.value}</h3>
                  <div className="card-coordinate">E30 · {String(index + 1).padStart(2, '0')}</div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-plum eras-section" id="eras">
          <Reveal className="section-heading centered">
            <p className="eyebrow">A life in chapters</p>
            <h2>The Emily eras.</h2>
            <p>Choose an era. The page changes rhythm with her.</p>
          </Reveal>
          <div className="eras-experience">
            <div className="eras-list">
              {eras.map((era, index) => (
                <button
                  className={activeEra === index ? 'era-card active' : 'era-card'}
                  key={era.number}
                  onClick={() => {
                    setActiveEra(index)
                    playChime(soundOn, [392 + index * 35, 523.25 + index * 25])
                  }}
                >
                  <span>{era.number}</span>
                  <div><h3>{era.title}</h3><p>{era.copy}</p></div>
                </button>
              ))}
            </div>
            <Reveal className="era-stage" delay={180}>
              <AdaptiveDanceVisualizer active={activeEra === 0 || activeEra === 4 || activeEra === 5} />
              <div className="era-stage-number">{eras[activeEra].number}</div>
              <div className="era-stage-copy">
                <p>Now playing</p>
                <h3>{eras[activeEra].title}</h3>
                <span>{activeEra === 2 ? 'Documentary mode activated' : activeEra === 0 ? 'Dance floor detected' : 'Chapter selected'}</span>
              </div>
            </Reveal>
          </div>
        </section>

        <DeferredTrueCrime onReward={triggerReward} />

        <section className="section-paper evidence-section" id="evidence">
          <Reveal className="section-heading">
            <p className="eyebrow dark">Collected evidence</p>
            <h2>Evidence that you are extraordinary.</h2>
            <p>Tap each file. Every finding builds the only case that matters here.</p>
          </Reveal>
          <div className="evidence-layout">
            <div className="evidence-tabs" role="tablist" aria-label="Evidence files">
              {evidence.map((item, index) => (
                <button
                  key={item.id}
                  className={openEvidence === item.id ? 'evidence-tab active' : 'evidence-tab'}
                  onClick={() => {
                    setOpenEvidence(item.id)
                    playChime(soundOn, [440 + index * 30])
                  }}
                  role="tab"
                  aria-selected={openEvidence === item.id}
                >
                  <span>Evidence {item.id}</span><strong>{item.title}</strong>
                </button>
              ))}
            </div>
            <TiltCard className="evidence-file">
              <div className="file-stamp">CONFIDENTIAL</div>
              {evidence.filter((item) => item.id === openEvidence).map((item) => (
                <div key={item.id}>
                  <p className="eyebrow dark">Finding {item.id}</p>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <div className="evidence-fingerprint" aria-hidden="true">◎</div>
                  <div className="verdict">Verdict: guilty of being completely unforgettable.</div>
                </div>
              ))}
            </TiltCard>
          </div>
        </section>

        <section className="section-dark photo-section" id="memories">
          <AdaptiveParticleField />
          <Reveal className="section-heading centered">
            <p className="eyebrow">The Emily archives</p>
            <h2>Memories worth keeping.</h2>
            <p>Swipe through the evidence. Your real photos will replace each archive automatically.</p>
          </Reveal>
          <Reveal delay={160}><SwipeGallery /></Reveal>
        </section>

        <section className="section-light reasons-section" id="reasons">
          <Reveal className="section-heading centered narrow">
            <p className="eyebrow dark">Thirty for thirty</p>
            <h2>30 reasons I love you.</h2>
            <p>Tap each card to turn it over. The truth is waiting on the other side.</p>
          </Reveal>
          <div className="reasons-grid flip-reasons-grid">
            {reasons.map((reason, index) => (
              <button
                className={openReason === index ? 'reason-card open' : 'reason-card'}
                key={reason}
                onClick={() => {
                  setOpenReason(openReason === index ? null : index)
                  playChime(soundOn, [523.25 + (index % 5) * 35])
                }}
                aria-expanded={openReason === index}
              >
                <span className="reason-front">
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <small>Tap to reveal</small>
                </span>
                <span className="reason-back">
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <p>{reason}</p>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="section-paper promise-section" id="promise">
          <Reveal>
            <div className="promise-mark">♡</div>
            <p className="eyebrow dark">The final statement</p>
            <h2>My promise to you.</h2>
            <div className="promise-copy">
              <p>On your thirtieth birthday, I am not promising you a perfect story.</p>
              <p>I am promising to choose you with love, patience and honesty. To respect your heart, keep learning you, and continue choosing you through every chapter we build together.</p>
              <p>Happy birthday, Emily.<br />Welcome to your next era.</p>
            </div>
            <p className="signature">With love, Andre</p>
            <p className="final-warning">One final file remains. It appears to be avoiding capture.</p>
            <DodgingButton
              onCaught={() => {
                setFinale(true)
                playChime(soundOn, [392, 523.25, 659.25, 783.99, 1046.5])
              }}
            />
          </Reveal>
        </section>

        <section className="section-plum video-section" id="message">
          <Reveal><VideoSlot /></Reveal>
          <Reveal className="video-copy" delay={160}>
            <p className="eyebrow">In my own voice</p>
            <h2>Some things needed to be said properly.</h2>
            <p>The jokes end here for a moment. This is the message only you can give her in your voice.</p>
          </Reveal>
        </section>

        <footer>
          <p>Case closed · Emily is 30, deeply loved and only getting started.</p>
          <span>16 · 07 · 2026</span>
        </footer>
      </main>

      <FinaleOverlay visible={finale} onClose={() => setFinale(false)} starsFound={stars.size} />
    </>
  )
}

export default AppMobileOptimized
