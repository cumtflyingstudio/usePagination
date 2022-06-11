import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { usePagination } from "../usePagination";
const mockPaginationRequest = (
  currPage: number,
  // odd -> 1000X, even -> 2000X
  id: number = (Number(!(currPage % 2)) + 1) * 10000 + currPage
) => {
  function createItem(currPage) {
    return {
      id: id++,
      name: `Page:${currPage}`,
    };
  }
  return Promise.resolve([createItem(currPage), createItem(currPage)]);
};
const setUpHook = <T>(
  paginationRequest: (currPage: number) => Promise<T[]>
) => {
  const renderHookRes = renderHook(() => usePagination(paginationRequest));
  return renderHookRes;
};
describe("usePagination", () => {
  it("should be defined", () => {
    const { result, rerender } = setUpHook(() => Promise.resolve([]));
    expect(result.current).toBeDefined();
  });
  it("init should be with refresh once", async () => {
    const { result, rerender } = setUpHook(mockPaginationRequest);
    expect(result.current.data).toEqual([]);
    await act(async () => {});
    expect(result.current.data).toEqual([
      { id: 10001, name: "Page:1" },
      { id: 10002, name: "Page:1" },
    ]);
  });
  it("test run once", async () => {
    const { result, rerender } = setUpHook(mockPaginationRequest);
    expect(result.current.data).toEqual([]);
    await act(async () => {
      await result.current.run();
    });
    expect(result.current.data).toEqual([
      { id: 10001, name: "Page:1" },
      { id: 10002, name: "Page:1" },
      { id: 20002, name: "Page:2" },
      { id: 20003, name: "Page:2" },
    ]);
  });
  it("test run twice", async () => {
    const { result, rerender } = setUpHook(mockPaginationRequest);
    expect(result.current.data).toEqual([]);
    await act(async () => {
      await result.current.run();
      await result.current.run();
    });
    expect(result.current.data).toEqual([
      { id: 10001, name: "Page:1" },
      { id: 10002, name: "Page:1" },
      { id: 20002, name: "Page:2" },
      { id: 20003, name: "Page:2" },
      { id: 10003, name: "Page:3" },
      { id: 10004, name: "Page:3" },
    ]);
  });
});
