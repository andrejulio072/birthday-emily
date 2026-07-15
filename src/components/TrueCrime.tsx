import { useMemo, useState } from 'react'
import { Reveal, TiltCard } from './Effects'

const suspects = [
  {
    code: 'TB',
    name: 'Ted Bundy',
    label: 'The charm offensive',
    danger: 99,
    joke: 'Emily has a psychology degree and a functioning red-flag detector. The “charming stranger” routine would survive approximately twelve seconds.',
    verdict: 'Profile exposed before episode two.',
  },
  {
    code: 'JD',
    name: 'Jeffrey Dahmer',
    label: 'The dinner invitation',
    danger: 100,
    joke: 'The vegan menu is nonexistent, the atmosphere is suspicious, and the host has failed every imaginable background check.',
    verdict: 'Invitation declined. Number blocked. Documentary watched later.',
  },
  {
    code: 'ZK',
    name: 'The Zodiac Killer',
    label: 'The cryptic letter',
    danger: 94,
    joke: 'Emily would solve the pattern, analyse the need for attention, criticise the typography and still have time for a Taylor Swift bridge.',
    verdict: 'Cipher solved. Ego diagnosed. Case forwarded.',
  },
]

const quiz = [
  {
    question: 'A suspiciously charming stranger says, “Trust me.” What does Emily do?',
    answers: [
      ['Trusts him because the lighting is cinematic', 0],
      ['Analyses his language, notices four inconsistencies and leaves', 2],
      ['Asks whether Netflix already made the documentary', 1],
    ] as const,
  },
  {
    question: 'Someone suggests a shortcut through an isolated forest.',
    answers: [
      ['Absolutely not. Main road, location shared, doors locked', 2],
      ['Only after checking the Rotten Tomatoes score', 1],
      ['Follows the ominous music', 0],
    ] as const,
  },
  {
    question: 'A coded letter arrives with dramatic symbols.',
    answers: [
      ['Throws it away', 1],
      ['Solves it, profiles the writer and corrects the grammar', 2],
      ['Frames it because the aesthetic is interesting', 0],
    ] as const,
  },
]

const cipher = 'UIFSF JT OP POF MJLF ZPV'
const decoded = 'THERE IS NO ONE LIKE YOU'

export function TrueCrimeUnit({ onReward }: { onReward: () => void }) {
  const [selected, setSelected] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [quizStep, setQuizStep] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [cipherSolved, setCipherSolved] = useState(false)
  const suspect = suspects[selected]

  const survivalResult = useMemo(() => {
    if (quizScore >= 5) return 'Final girl energy: elite. The villain is emotionally analysed and arrested before the third act.'
    if (quizScore >= 3) return 'Strong survival instincts. One questionable cinematic decision, but nothing Emily cannot recover from.'
    return 'Plot twist: Emily was only pretending to make bad choices so she could study everyone else.'
  }, [quizScore])

  const runScan = () => {
    if (scanning) return
    setScanning(true)
    setScanResult(null)
    window.setTimeout(() => {
      setScanResult(suspect.verdict)
      setScanning(false)
      onReward()
    }, 1500)
  }

  const answerQuiz = (points: number) => {
    const nextScore = quizScore + points
    setQuizScore(nextScore)
    if (quizStep === quiz.length - 1) {
      setQuizDone(true)
      onReward()
    } else {
      setQuizStep((step) => step + 1)
    }
  }

  return (
    <section className="crime-unit" id="crime-unit">
      <div className="crime-noise" aria-hidden="true" />
      <Reveal className="crime-heading">
        <p className="eyebrow">Emily’s True-Crime Unit</p>
        <h2>Famous cases.<br /><em>Zero chance of fooling her.</em></h2>
        <p>
          No admiration and no graphic details. This is simply a scientific demonstration of why a psychology graduate,
          documentary specialist and professional red-flag detector would be a serial killer’s worst audience.
        </p>
      </Reveal>

      <div className="crime-board">
        <div className="crime-board-lines" aria-hidden="true">
          <span className="line line-a" />
          <span className="line line-b" />
          <span className="line line-c" />
        </div>
        <div className="suspect-tabs" role="tablist" aria-label="Parody suspect files">
          {suspects.map((item, index) => (
            <button
              key={item.code}
              className={selected === index ? 'suspect-tab active' : 'suspect-tab'}
              onClick={() => {
                setSelected(index)
                setScanResult(null)
              }}
              role="tab"
              aria-selected={selected === index}
            >
              <span>{item.code}</span>
              <strong>{item.name}</strong>
              <small>{item.label}</small>
            </button>
          ))}
        </div>

        <TiltCard className="suspect-dossier">
          <div className="dossier-topline">
            <span>PARODY DOSSIER · {suspect.code}-30</span>
            <strong>NOT A FAN CLUB</strong>
          </div>
          <div className="suspect-mugshot" aria-hidden="true">
            <span>{suspect.code}</span>
            <div className="height-lines" />
          </div>
          <div className="dossier-copy">
            <p className="eyebrow dark">Behavioural assessment</p>
            <h3>{suspect.name}</h3>
            <p>{suspect.joke}</p>
            <div className="danger-row">
              <span>Obvious danger</span>
              <div className="danger-track"><i style={{ width: `${suspect.danger}%` }} /></div>
              <strong>{suspect.danger}%</strong>
            </div>
            <div className="danger-row safe-row">
              <span>Chance Emily is fooled</span>
              <div className="danger-track"><i style={{ width: '1%' }} /></div>
              <strong>1%</strong>
            </div>
            <button className="scanner-button" onClick={runScan} disabled={scanning}>
              {scanning ? 'Scanning behavioural pattern…' : 'Run Emily’s red-flag scanner'}
            </button>
            <div className={scanning ? 'scanner-beam active' : 'scanner-beam'} aria-hidden="true" />
            {scanResult && <div className="scan-result">VERDICT: {scanResult}</div>}
          </div>
        </TiltCard>
      </div>

      <div className="crime-games-grid">
        <Reveal className="thriller-quiz" delay={100}>
          <div className="game-label">Interactive test 01</div>
          <h3>Would Emily survive a psychological thriller?</h3>
          {!quizDone ? (
            <>
              <div className="quiz-progress"><span style={{ width: `${((quizStep + 1) / quiz.length) * 100}%` }} /></div>
              <p className="quiz-question">{quiz[quizStep].question}</p>
              <div className="quiz-options">
                {quiz[quizStep].answers.map(([answer, points]) => (
                  <button key={answer} onClick={() => answerQuiz(points)}>{answer}</button>
                ))}
              </div>
            </>
          ) : (
            <div className="quiz-result">
              <span>Survival probability: 100%</span>
              <p>{survivalResult}</p>
              <button onClick={() => { setQuizDone(false); setQuizStep(0); setQuizScore(0) }}>Run another timeline</button>
            </div>
          )}
        </Reveal>

        <Reveal className="cipher-card" delay={200}>
          <div className="game-label">Interactive test 02</div>
          <h3>The birthday cipher</h3>
          <p className="cipher-note">Zodiac-style presentation. Considerably less alarming message.</p>
          <div className={cipherSolved ? 'cipher-text solved' : 'cipher-text'}>
            {cipherSolved ? decoded : cipher}
          </div>
          <div className="cipher-key">KEY: shift every letter one place backwards</div>
          <button
            className="decode-button"
            onClick={() => {
              setCipherSolved((value) => !value)
              if (!cipherSolved) onReward()
            }}
          >
            {cipherSolved ? 'Encode again' : 'Decode the evidence'}
          </button>
        </Reveal>
      </div>

      <Reveal className="crime-closing" delay={250}>
        <span className="crime-tape">DO NOT CROSS · BIRTHDAY INVESTIGATION · DO NOT CROSS</span>
        <p>
          Official conclusion: Emily may enjoy documentaries about terrifying people, but she remains the sweetest person in the entire investigation.
        </p>
      </Reveal>
    </section>
  )
}
