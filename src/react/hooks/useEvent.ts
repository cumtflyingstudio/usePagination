import { useCallback } from 'react'
import useLatest from './useLatest'
function useEvent<T, R>(fn: (...args: T[]) => R) {
  const fnRef = useLatest(fn)
  return useCallback((...args: T[]) => {
    return fnRef.current.apply(null, args) as R
  }, [])
}
export default useEvent
