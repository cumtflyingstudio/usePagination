/* eslint-disable arrow-parens */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import wrapperSchedular from '../wrapperSchedular';

describe('wrapperSchedular', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  it('should be defined', () => {
    expect(wrapperSchedular).toBeDefined();
  });
  it('feature:return fastest work, test two tasks', async () => {
    let i = 0;
    const request = () => {
      return new Promise<number>(resolve => {
        setTimeout(() => {
          resolve(i++);
        }, 1000);
      });
    };
    const myRequest = wrapperSchedular(request, { type: 'fastest' });
    myRequest().then(res => {
      expect(res).toBe(0);
    });
    setTimeout(() => {
      myRequest().then(res => {
        expect(res).toBe(0);
      });
    }, 500);
    vi.runAllTimers();
  });
  it('feature:return fastest work ,test three tasks', async () => {
    let i = 0;
    const request = () => {
      return new Promise<number>(resolve => {
        setTimeout(() => {
          resolve(i++);
        }, 1000);
      });
    };
    const myRequest = wrapperSchedular(request, { type: 'fastest' });
    myRequest().then(res => {
      expect(res).toBe(0);
    });
    setTimeout(() => {
      myRequest().then(res => {
        expect(res).toBe(0);
      });
    }, 250);
    setTimeout(() => {
      myRequest().then(res => {
        expect(res).toBe(0);
      });
    }, 500);
    vi.runAllTimers();
  });
  it('feature: latest, test two tasks', async () => {
    let i = 0;
    const request = () => {
      return new Promise<number>(resolve => {
        setTimeout(() => {
          resolve(i++);
        }, 1000);
      });
    };
    const myRequest = wrapperSchedular(request, { type: 'latest' });
    myRequest().then(res => {
      expect(res).toBe(1);
    });
    setTimeout(() => {
      myRequest().then(res => {
        expect(res).toBe(1);
      });
    }, 500);
    vi.runAllTimers();
  });
  it('feature: latest ,test three tasks', async () => {
    let i = 0;
    const request = () => {
      return new Promise<number>(resolve => {
        setTimeout(() => {
          resolve(i++);
        }, 1000);
      });
    };
    const myRequest = wrapperSchedular(request, { type: 'latest' });
    myRequest().then(res => {
      expect(res).toBe(2);
    });
    setTimeout(() => {
      myRequest().then(res => {
        expect(res).toBe(2);
      });
    }, 250);
    setTimeout(() => {
      myRequest().then(res => {
        expect(res).toBe(2);
      });
    }, 500);
    vi.runAllTimers();
  });
  it('feature: type list, list should be rightly returned', async () => {
    function mockAsyncTask(num: number) {
      return new Promise<number>(resolve => {
        setTimeout(() => {
          resolve(num);
        }, (Math.random() * 100) % 100);
      });
    }
    const list: number[] = [];
    // const task = mockAsyncTask // without schedular returns random array like this: [2,1,3,5,4,6]
    const task = wrapperSchedular(mockAsyncTask, { type: 'list' });
    const tasks = Promise.all(
      Array.from({ length: 6 }, (_, k) => k + 1).map(i =>
        task(i).then(res => list.push(res)),
      ),
    );
    vi.runAllTimers();
    await expect(tasks).resolves.toEqual([1, 2, 3, 4, 5, 6]);
  });
});
