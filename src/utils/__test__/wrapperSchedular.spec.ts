/* eslint-disable arrow-parens */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import wrapperSchedular from '../wrapperSchedular';

describe('wrapperSchedular', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  const request = (i: number) => {
    return new Promise<number>(resolve => {
      setTimeout(() => {
        resolve(i);
      }, 1000);
    });
  };
  it('should be defined', () => {
    expect(wrapperSchedular).toBeDefined();
  });
  it('feature:return fastest work, test two tasks', async () => {
    let i = 0;
    let j = 0;
    const myRequest = wrapperSchedular(request, { type: 'fastest' });
    const promise = Promise.all([myRequest(i++), myRequest(i++)])
    const withoutSchedular_promise = Promise.all([request(j++), request(j++)])
    vi.runAllTimers();
    await expect(promise).resolves.toEqual([0, 0]);
    await expect(withoutSchedular_promise).resolves.toEqual([0, 1]);
  });
  it('feature:return latest work ,test three tasks', async () => {
    let i = 0;
    let j = 0;
    const myRequest = wrapperSchedular(request, { type: 'latest' });
    const promise = Promise.all([myRequest(i++), myRequest(i++), myRequest(i++)])
    const withoutSchedular_promise = Promise.all([request(j++), request(j++), request(j++)])
    vi.runAllTimers();
    await expect(promise).resolves.toEqual([2, 2, 2]);
    await expect(withoutSchedular_promise).resolves.toEqual([0, 1, 2]);
  });

  it('feature: list option, list should be rightly returned', async () => {
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
    await expect(tasks).resolves.toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
        4,
        5,
        6,
      ]
    `);
  });
});
