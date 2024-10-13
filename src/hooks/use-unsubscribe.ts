import { Subject } from 'rxjs'
import { useEffect, useState } from 'react'

export const useUnsubscribe = () => {
  const [unsubscribe$] = useState<Subject<void>>(new Subject())

  useEffect(() => {
    return () => {
      unsubscribe$.next()
      unsubscribe$.complete()
    }
  }, [unsubscribe$])

  return unsubscribe$
}
