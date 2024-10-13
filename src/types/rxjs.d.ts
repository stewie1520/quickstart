import { BehaviorSubject } from 'rxjs'

export type WithOutNextComplete<T = BehaviorSubject<any>> = Omit<T, 'next' | 'complete'>

