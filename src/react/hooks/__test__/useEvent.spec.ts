import { renderHook } from '@testing-library/react-hooks'
import { describe, expect, it } from 'vitest'
import useEvent from '../useEvent'
describe('useEvent', () => {
  it('should be a function', () => {
    expect(typeof useEvent).toBe('function')
  })
  it('feature: memorized fn', () => {
    const { rerender, result } = renderHook(() => {
      let i = 1
      return useEvent(() => {
        return i++
      })
    })

    expect(result.current()).toBe(1) // useCallback(,[]) should be 1
    rerender()
    expect(result.current()).toBe(1) // useCallback(,[]) should be 2 , because of the closure
  })
})
