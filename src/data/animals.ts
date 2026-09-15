/**
 * The cast. Eight animals a Serbian toddler meets in books and songs first.
 *
 * Each one carries its own colours so a child can recognise a friend by shape
 * and colour long before they can read a name.
 */

import type { Lang } from '../i18n/strings'

export type AnimalId = 'maca' | 'kuca' | 'krava' | 'patka' | 'ovca' | 'zaba' | 'ptica' | 'meda'

export interface Animal {
  id: AnimalId
  name: Record<Lang, string>
  /** The written sound, e.g. "mu" — spoken out loud after the synth voice. */
  says: Record<Lang, string>
  /** Main body colour. */
  color: string
  /** Darker tone for ears, patches, outlines. */
  shade: string
  /** The soft background used whenever this animal is on stage. */
  scene: string
}

export const ANIMALS: Animal[] = [
  {
    id: 'maca',
    name: { sr: 'Maca', en: 'Kitty' },
    says: { sr: 'mjau', en: 'meow' },
    color: '#e8b98f',
    shade: '#c9915f',
    scene: '#f6e7d6',
  },
  {
    id: 'kuca',
    name: { sr: 'Kuca', en: 'Puppy' },
    says: { sr: 'av av', en: 'woof woof' },
    color: '#d9b08a',
    shade: '#a97f57',
    scene: '#f3e6d8',
  },
  {
    id: 'krava',
    name: { sr: 'Krava', en: 'Cow' },
    says: { sr: 'muu', en: 'moo' },
    color: '#f0ece6',
    shade: '#9c8f85',
    scene: '#e6ecdf',
  },
  {
    id: 'patka',
    name: { sr: 'Patka', en: 'Duck' },
    says: { sr: 'kva kva', en: 'quack quack' },
    color: '#f2d79a',
    shade: '#d3a44f',
    scene: '#e3ecef',
  },
  {
    id: 'ovca',
    name: { sr: 'Ovca', en: 'Sheep' },
    says: { sr: 'beee', en: 'baa' },
    color: '#f1eee9',
    shade: '#b8ada3',
    scene: '#e9ecdf',
  },
  {
    id: 'zaba',
    name: { sr: 'Žaba', en: 'Frog' },
    says: { sr: 'kre kre', en: 'ribbit' },
    color: '#a9c58c',
    shade: '#7fa063',
    scene: '#e2ecdc',
  },
  {
    id: 'ptica',
    name: { sr: 'Ptica', en: 'Birdie' },
    says: { sr: 'fiju', en: 'tweet' },
    color: '#9fc0cf',
    shade: '#6e94a6',
    scene: '#e6edf2',
  },
  {
    id: 'meda',
    name: { sr: 'Meda', en: 'Bear' },
    says: { sr: 'mrrr', en: 'grrr' },
    color: '#c9a37d',
    shade: '#9c7853',
    scene: '#efe6da',
  },
]

const BY_ID = new Map<AnimalId, Animal>(ANIMALS.map((a) => [a.id, a]))

export function animal(id: AnimalId): Animal {
  const found = BY_ID.get(id)
  if (!found) throw new Error(`Unknown animal: ${id}`)
  return found
}

/** Picks a different animal than the one given — for "who is hiding" turns. */
export function otherAnimal(not: AnimalId, pool: AnimalId[] = ANIMALS.map((a) => a.id)): AnimalId {
  const options = pool.filter((id) => id !== not)
  return options[Math.floor(Math.random() * options.length)] ?? not
}
