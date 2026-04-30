import { useState, useEffect } from "react"
import { FocusTrap } from "focus-trap-react"
import type { FocusTrapProps } from "focus-trap-react"

interface TrapFocusProps {
  active?: boolean
  onDeactivate: () => void
  activationDelay?: number
  clickOutsideDeactivates?: boolean
  initialFocus?: string
  children: React.ReactNode
}

export default function TrapFocus({
  active = true,
  onDeactivate,
  activationDelay = 10,
  clickOutsideDeactivates = false,
  initialFocus,
  children,
}: TrapFocusProps) {
  const [trapActive, setTrapActive] = useState(false)

  useEffect(() => {
    const id = setTimeout(
      () => {
        setTrapActive(active)
      },
      active ? activationDelay : 5,
    )
    return () => {
      clearTimeout(id)
    }
  }, [active, activationDelay])

  const focusTrapOptions: FocusTrapProps["focusTrapOptions"] = {
    initialFocus: initialFocus
      ? () => document.querySelector(initialFocus) as HTMLElement
      : undefined,

    escapeDeactivates: true,
    clickOutsideDeactivates,
    onDeactivate,
  }

  return (
    <FocusTrap active={trapActive} focusTrapOptions={focusTrapOptions}>
      {children}
    </FocusTrap>
  )
}
