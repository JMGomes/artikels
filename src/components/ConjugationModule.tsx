import { useState } from 'react'
import type { VerbEntry, VerbFilter } from '../types/verb'
import { ConjugationPractice } from './conjugation/ConjugationPractice'
import { ConjugationSetup } from './conjugation/ConjugationSetup'

type ConjugationMode = 'setup' | 'practice'

type ConjugationModuleProps = {
  verbs: VerbEntry[]
  onBack: () => void
}

export function ConjugationModule({ verbs, onBack }: ConjugationModuleProps) {
  const [mode, setMode] = useState<ConjugationMode>('setup')
  const [sessionVerbs, setSessionVerbs] = useState<VerbEntry[]>([])
  const [sessionFilter, setSessionFilter] = useState<VerbFilter | null>(null)

  if (mode === 'practice' && sessionVerbs.length > 0) {
    return (
      <ConjugationPractice
        verbs={sessionVerbs}
        filter={sessionFilter}
        onBack={() => setMode('setup')}
      />
    )
  }

  return (
    <ConjugationSetup
      verbs={verbs}
      onBack={onBack}
      onStart={(filtered, filter) => {
        setSessionVerbs(filtered)
        setSessionFilter(filter)
        setMode('practice')
      }}
    />
  )
}
