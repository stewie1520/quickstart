import { BehaviorSubject } from 'rxjs'

export type WithOutNextComplete<T = BehaviorSubject<unknown>> = Omit<T, 'next' | 'complete'>

