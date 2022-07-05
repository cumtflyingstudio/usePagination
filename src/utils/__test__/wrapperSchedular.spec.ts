import { beforeEach, describe, expect, it, vi } from 'vitest'
import wrapperSchedular from '../wrapperSchedular'
describe('wrapperSchedular', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  it('should be defined', () => {
    expect(wrapperSchedular).toBeDefined()
  })
  it('feature:return fastest work, test two tasks', async () => {
    let i = 0
    const request = () => {
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(i++)
        }, 1000)
      })
    }
    const myRequest = wrapperSchedular(request, { type: 'fastest' })
    myRequest().then((res) => {
      expect(res).toBe(0)
    })
    setTimeout(() => {
      myRequest().then((res) => {
        expect(res).toBe(0)
      })
    }, 500)
    vi.runAllTimers()
  })
  it('feature:return fastest work ,test three tasks', async () => {
    let i = 0
    const request = () => {
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(i++)
        }, 1000)
      })
    }
    const myRequest = wrapperSchedular(request, { type: 'fastest' })
    myRequest().then((res) => {
      expect(res).toBe(0)
    })
    setTimeout(() => {
      myRequest().then((res) => {
        expect(res).toBe(0)
      })
    }, 250)
    setTimeout(() => {
      myRequest().then((res) => {
        expect(res).toBe(0)
      })
    }, 500)
    vi.runAllTimers()
  })
  it('feature:return latest work, test two tasks', async () => {
    let i = 0
    const request = () => {
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(i++)
        }, 1000)
      })
    }
    const myRequest = wrapperSchedular(request, { type: 'latest' })
    myRequest().then((res) => {
      expect(res).toBe(1)
    })
    setTimeout(() => {
      myRequest().then((res) => {
        expect(res).toBe(1)
      })
    }, 500)
    vi.runAllTimers()
  })
  it('feature:return latest work ,test three tasks', async () => {
    let i = 0
    const request = () => {
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(i++)
        }, 1000)
      })
    }
    const myRequest = wrapperSchedular(request, { type: 'latest' })
    myRequest().then((res) => {
      expect(res).toBe(2)
    })
    setTimeout(() => {
      myRequest().then((res) => {
        expect(res).toBe(2)
      })
    }, 250)
    setTimeout(() => {
      myRequest().then((res) => {
        expect(res).toBe(2)
      })
    }, 500)
    vi.runAllTimers()
  })
})
