import { Code2, Check, Sparkles } from 'lucide-react'

export default function FocusVisual() {
  return (
    <div className="focus-visual" aria-hidden="true">
      <div className="focus-orbit focus-orbit-outer" />
      <div className="focus-orbit focus-orbit-inner" />
      <div className="focus-core">
        <Code2 className="h-10 w-10" />
        <span>
          One problem.
          <br />
          One step ahead.
        </span>
      </div>
      <div className="focus-chip focus-chip-top">
        <Sparkles className="h-4 w-4" />
        Find your next challenge
      </div>
      <div className="focus-chip focus-chip-bottom">
        <span className="focus-check">
          <Check className="h-3 w-3" />
        </span>
        Build a little momentum
      </div>
      <span className="focus-dot focus-dot-one" />
      <span className="focus-dot focus-dot-two" />
    </div>
  )
}
