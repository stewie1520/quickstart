import { DependencyList, useEffect, useRef } from 'react'
import { Subject } from 'rxjs'

export const useUnsubscribeDidMountEffect = (
  effect: (unsubscribe$: Subject<void>) => (void | (() => void)),
  deps?: DependencyList
) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) {
      const unsubscribe$ = new Subject<void>()

      const destructor = effect(unsubscribe$)

      return () => {
        unsubscribe$.next()
        unsubscribe$.complete()
        if (typeof destructor === 'function') {
          destructor()
        }
      }
    } else {
      didMount.current = true
    }
  }, deps)
}
