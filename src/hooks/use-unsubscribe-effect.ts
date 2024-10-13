import { DependencyList, useEffect } from 'react'
import { Subject } from 'rxjs'

export const useUnsubscribeEffect = (
  effect: (unsubscribe$: Subject<void>) => (void | (() => void)),
  deps?: DependencyList
) => {
  useEffect(() => {
    const unsubscribe$ = new Subject<void>()

    const destructor = effect(unsubscribe$)

    return () => {
      unsubscribe$.next()
      unsubscribe$.complete()
      if (typeof destructor === 'function') {
        destructor()
      }
    }
  }, deps)
}
