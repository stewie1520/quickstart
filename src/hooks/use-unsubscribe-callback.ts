import { DependencyList, useCallback, useRef } from 'react'
import { Subject } from 'rxjs'

type Tail<T extends any[]> = T extends [unknown, ...infer Tail] ? Tail : never

// type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never
// type Tail<T extends any[]> = T extends [infer Head, ...infer Tail] ? Tail : never

export const useUnsubscribeCallback = <T extends (unsubscribe$: Subject<void>, ...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): ((...args: Tail<Parameters<T>>) => ReturnType<T>) => {
  const unsubscribeRef$ = useRef<Subject<void>>(new Subject())

  return useCallback((...args) => {
    unsubscribeRef$.current.next()
    unsubscribeRef$.current.complete()
    unsubscribeRef$.current = new Subject<void>()

    return callback(unsubscribeRef$.current, ...args)
  }, [...deps])
}
