import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import AppMobileOptimized from './AppMobileOptimized'
import { MusicSection } from './components/MusicSection'
import { RomanceArchive } from './components/RomanceArchive'

type PortalTargets = {
  music: HTMLElement | null
  memories: HTMLElement | null
}

function AppExperience() {
  const [targets, setTargets] = useState<PortalTargets>({ music: null, memories: null })

  useEffect(() => {
    const eras = document.getElementById('eras')
    const oldMemories = document.querySelector<HTMLElement>('section#memories')
    if (!eras || !oldMemories) return

    const musicMount = document.createElement('div')
    musicMount.dataset.experiencePortal = 'soundtrack'
    eras.insertAdjacentElement('afterend', musicMount)

    const memoriesMount = document.createElement('div')
    memoriesMount.dataset.experiencePortal = 'memories'
    oldMemories.replaceWith(memoriesMount)

    setTargets({ music: musicMount, memories: memoriesMount })

    return () => {
      musicMount.remove()
      memoriesMount.remove()
    }
  }, [])

  return (
    <>
      <AppMobileOptimized />
      {targets.music && createPortal(<MusicSection />, targets.music)}
      {targets.memories && createPortal(<RomanceArchive />, targets.memories)}
    </>
  )
}

export default AppExperience
