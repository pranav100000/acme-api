import { useCallback, useRef, useState } from 'react'

export function useFlashMessage(timeoutMs = 3000) {
  const [message, setMessage] = useState('')
  const timeoutRef = useRef(null)

  const showMessage = useCallback((nextMessage) => {
    window.clearTimeout(timeoutRef.current)
    setMessage(nextMessage)
    timeoutRef.current = window.setTimeout(() => {
      setMessage('')
    }, timeoutMs)
  }, [timeoutMs])

  return [message, showMessage]
}
