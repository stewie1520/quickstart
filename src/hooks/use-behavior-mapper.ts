import { useEffect, useState } from 'react'
import { BehaviorSubject, takeUntil } from 'rxjs'
import { useUnsubscribe } from '@/hooks'
import { WithOutNextComplete } from '@/types/rxjs'

export const useBehaviorMapper = <T = unknown>(listener$: WithOutNextComplete<BehaviorSubject<T>>) => {
  const unsubscribe$ = useUnsubscribe()
  const [state, setState] = useState<T>(listener$.getValue())

  useEffect(() => {
    listener$
      .pipe(takeUntil(unsubscribe$))
      .subscribe((state) => setState(state))
      // .subscribe((state) => setState(cloneDeep(state)))
  }, [listener$, unsubscribe$])

  return state
}
