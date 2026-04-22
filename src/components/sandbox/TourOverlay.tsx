type TourStep = {
  title: string
  description: string
}

type TourOverlayProps = {
  open: boolean
  steps: TourStep[]
  currentStep: number
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
}

export const TourOverlay = ({
  open,
  steps,
  currentStep,
  onNext,
  onPrevious,
  onClose,
}: TourOverlayProps) => {
  if (!open) {
    return null
  }

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <div className="tour-backdrop" role="dialog" aria-modal="true" aria-label="Workflow Designer Tour">
      <div className="tour-card">
        <div className="tour-progress">Step {currentStep + 1} of {steps.length}</div>
        <h3>{step.title}</h3>
        <p>{step.description}</p>

        <div className="tour-dots" aria-hidden="true">
          {steps.map((item, index) => (
            <span key={item.title} className={`tour-dot ${index === currentStep ? 'active' : ''}`} />
          ))}
        </div>

        <div className="tour-actions">
          <button type="button" className="small-btn" disabled={isFirst} onClick={onPrevious}>
            Back
          </button>
          <button type="button" className="small-btn" onClick={onClose}>
            Skip
          </button>
          <button type="button" className="run-btn" onClick={isLast ? onClose : onNext}>
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
