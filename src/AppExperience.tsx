import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import AppMobileOptimized from './AppMobileOptimized'
import { MusicSection } from './components/MusicSection'
import { RomanceArchive } from './components/RomanceArchive'
import { ThemeParkJourney } from './components/ThemeParkJourney'

type PortalTargets = {
  park: HTMLElement | null
  music: HTMLElement | null
  memories: HTMLElement | null
}

function AppExperience() {
  const [targets, setTargets] = useState<PortalTargets>({ park: null, music: null, memories: null })

  useEffect(() => {
    const profile = document.getElementById('profile')
    const eras = document.getElementById('eras')
    const oldMemories = document.querySelector<HTMLElement>('section#memories')
    if (!profile || !eras || !oldMemories) return

    const parkMount = document.createElement('div')
    parkMount.dataset.experiencePortal = 'birthday-park'
    profile.insertAdjacentElement('beforebegin', parkMount)

    const musicMount = document.createElement('div')
    musicMount.dataset.experiencePortal = 'soundtrack'
    eras.insertAdjacentElement('afterend', musicMount)

    const memoriesMount = document.createElement('div')
    memoriesMount.dataset.experiencePortal = 'memories'
    oldMemories.replaceWith(memoriesMount)

    setTargets({ park: parkMount, music: musicMount, memories: memoriesMount })

    return () => {
      parkMount.remove()
      musicMount.remove()
      memoriesMount.remove()
    }
  }, [])

  return (
    <>
      <AppMobileOptimized />
      {targets.park && createPortal(<ThemeParkJourney />, targets.park)}
      {targets.music && createPortal(<MusicSection />, targets.music)}
      {targets.memories && createPortal(<RomanceArchive />, targets.memories)}
    </>
  )
}

export default AppExperience
