import type { VerbEntry } from '../types/verb'
import { ConjugationPractice } from './conjugation/ConjugationPractice'

type ConjugationModuleProps = {
  verbs: VerbEntry[]
  onBack: () => void
}

export function ConjugationModule({ verbs, onBack }: ConjugationModuleProps) {
  return <ConjugationPractice verbs={verbs} onBack={onBack} />
}
