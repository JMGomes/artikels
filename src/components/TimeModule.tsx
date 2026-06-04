import { TimePractice } from './time/TimePractice'

type TimeModuleProps = {
  onBack: () => void
}

export function TimeModule({ onBack }: TimeModuleProps) {
  return <TimePractice onBack={onBack} />
}
