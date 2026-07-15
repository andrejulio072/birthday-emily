import { useMemo, useState } from 'react'
import { Reveal } from './Effects'

const artists = [
  {
    name: 'Taylor Swift',
    role: 'The storyteller',
    symbol: 'TS',
    note: 'For the big feelings, hidden meanings and every chapter that deserved its own era.',
    tracks: ['Lover', 'Enchanted', 'Love Story', 'Daylight', 'invisible string', 'You Are in Love'],
  },
  {
    name: 'Olivia Dean',
    role: 'The soul',
    symbol: 'OD',
    note: 'For warmth, honesty and the kind of voice that makes a quiet moment feel cinematic.',
    tracks: ['Man I Need', 'So Easy (To Fall in Love)', 'A Couple Minutes', 'Rein Me In', 'Dive', 'The Hardest Part'],
  },
] as const

export function MusicSection() {
  const [artistIndex, setArtistIndex] = useState(0)
  const [trackIndex, setTrackIndex] = useState(0)
  const artist = artists[artistIndex]
  const track = artist.tracks[trackIndex]

  const spotifyUrl = useMemo(
    () => `https://open.spotify.com/search/${encodeURIComponent(`${artist.name} ${track}`)}`,
    [artist.name, track],
  )

  const chooseArtist = (index: number) => {
    setArtistIndex(index)
    setTrackIndex(0)
  }

  return (
    <section className="music-section" id="soundtrack">
      <div className="music-glow" aria-hidden="true" />
      <Reveal className="section-heading centered music-heading">
        <p className="eyebrow">Her soundtrack</p>
        <h2>Taylor’s stories.<br />Olivia’s soul.</h2>
        <p>No copied lyrics and no heavy autoplay. Just the songs and artists that make this page sound more like Emily.</p>
      </Reveal>

      <div className="music-experience">
        <Reveal className="music-player">
          <div className="record-shell" aria-hidden="true">
            <div className="record-disc">
              <span>{artist.symbol}</span>
            </div>
          </div>
          <div className="now-playing">
            <span>Selected for this chapter</span>
            <h3>{track}</h3>
            <p>{artist.name}</p>
            <div className="equalizer" aria-hidden="true">
              {Array.from({ length: 14 }, (_, index) => <i key={index} style={{ animationDelay: `${index * -75}ms` }} />)}
            </div>
            <a href={spotifyUrl} target="_blank" rel="noreferrer">Find this song on Spotify ↗</a>
          </div>
        </Reveal>

        <div className="music-library">
          <div className="artist-tabs" role="tablist" aria-label="Emily's favourite musicians">
            {artists.map((item, index) => (
              <button
                key={item.name}
                className={artistIndex === index ? 'artist-tab active' : 'artist-tab'}
                onClick={() => chooseArtist(index)}
                role="tab"
                aria-selected={artistIndex === index}
              >
                <span>{item.symbol}</span>
                <div><strong>{item.name}</strong><small>{item.role}</small></div>
              </button>
            ))}
          </div>

          <Reveal className="track-panel" delay={120}>
            <p>{artist.note}</p>
            <div className="track-list">
              {artist.tracks.map((item, index) => (
                <button
                  key={item}
                  className={trackIndex === index ? 'active' : ''}
                  onClick={() => setTrackIndex(index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item}</strong>
                  <i>♪</i>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
