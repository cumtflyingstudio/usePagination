import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react-hooks';
import { usePagination } from '../usePagination';

// 一个列表请求
const mockPaginationRequest = (
  currPage: number,
  // odd -> 1000X, even -> 2000X
  id: number = (currPage % 2 === 0 ? 2 : 1) * 10000 + currPage,
) => {
  function createItem(currPage) {
    return {
      id: id++,
      name: `Page:${currPage}`,
    };
  }
  return Promise.resolve([createItem(currPage), createItem(currPage)]);
};
// 使用react-hooks 的renderHook
const setUpHook = <T>(
  paginationRequest: (currPage: number) => Promise<T[]>,
) => {
  const renderHookRes = renderHook(() => usePagination(paginationRequest));
  return renderHookRes;
};

describe('usePagination', () => {
  it('should be defined', () => {
    const { result } = setUpHook(() => Promise.resolve([]));
    expect(result.current).toBeDefined();
  });
  it('init should be with refresh once', async () => {
    const { result } = setUpHook(mockPaginationRequest);
    expect(result.current.data).toEqual([]);
    await act(async () => {});
    expect(result.current.data).toEqual([
      { id: 10001, name: 'Page:1' },
      { id: 10002, name: 'Page:1' },
    ]);
  });
  it('test run once', async () => {
    const { result } = setUpHook(mockPaginationRequest);
    expect(result.current.data).toEqual([]);
    await act(async () => {
      await result.current.run();
    });
    expect(result.current.data).toEqual([
      { id: 10001, name: 'Page:1' },
      { id: 10002, name: 'Page:1' },
      { id: 20002, name: 'Page:2' },
      { id: 20003, name: 'Page:2' },
    ]);
  });
  it('test run twice', async () => {
    const { result } = setUpHook(mockPaginationRequest);
    expect(result.current.data).toEqual([]);
    await act(async () => {
      await result.current.run();
      await result.current.run();
    });
    expect(result.current.data).toEqual([
      { id: 10001, name: 'Page:1' },
      { id: 10002, name: 'Page:1' },
      { id: 20002, name: 'Page:2' },
      { id: 20003, name: 'Page:2' },
      { id: 10003, name: 'Page:3' },
      { id: 10004, name: 'Page:3' },
    ]);
  });

  it('test run twice: schedular right sequence', async () => {
    const { result } = setUpHook(mockPaginationRequest);
    expect(result.current.data).toEqual([]);
    await act(async () => {
      await Promise.all([result.current.run(), result.current.run()]);
    });
    expect(result.current.data).toEqual([
      { id: 10001, name: 'Page:1' },
      { id: 10002, name: 'Page:1' },
      { id: 20002, name: 'Page:2' },
      { id: 20003, name: 'Page:2' },
      { id: 10003, name: 'Page:3' },
      { id: 10004, name: 'Page:3' },
    ]);
  });
});
