import { useEffect, useState } from 'react'
import { fetchAutomations } from '../api/client'
import type { AutomatedAction } from '../types/workflow'

export const useAutomations = () => {
  const [automations, setAutomations] = useState<AutomatedAction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchAutomations()
        if (active) {
          setAutomations(data)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  return { automations, loading, error }
}
