import birthdayPhotos from './birthdayBlock'
import usPhotos from './usBlock'
import quietPhotos from './quietDaysBlock'
import trainingPhotos from './trainingBlock'
import manySidesPhotos from './manySidesBlock'
import adventurePhotos from './adventuresBlock'
import adventure014 from './embedded/adventure014'
import londonMagic15To17 from './londonMagic15_17'
import londonMagic18To20 from './londonMagic18_20'
import londonMagic21To23 from './londonMagic21_23'
import alicantePhotos from './alicanteBlock'
import type { PhotoMemory } from './types'

const curatedReasonPhotos: PhotoMemory[] = [
  ...birthdayPhotos,
  ...alicantePhotos,
  ...usPhotos,
  ...adventurePhotos.slice(0, 5),
  adventure014,
  ...londonMagic15To17,
  ...londonMagic18To20,
  ...londonMagic21To23,
  ...quietPhotos,
  ...trainingPhotos,
  ...manySidesPhotos,
  ...adventurePhotos.slice(5),
]

export const reasonPhotos = curatedReasonPhotos.slice(0, 30)
