import { useState, useReducer, useRef, useEffect } from "react";
import { beforeAll } from "vitest";
interface IDataItem<T> {
  id: number | string;
  item: T;
}
type IDataList<T> = IDataItem<T>[];

interface IAction<T> {
  type: string;
  payload: IDataList<T>;
}
function reducer<T>(state: IDataList<T>, action: IAction<T>): IDataList<T> {
  let res = [] as any[];
  switch (action.type) {
    case "ADD":
      res = [...state, ...action.payload];
      break;
    case "RESET":
      res = [...action.payload];
      break;
    case "CLEAR":
      return [];
    default:
      return state;
  }
  // remove duplication
  let idSet = new Set();
  return res
    .filter(i => {
    if (idSet.has(i.id)) {
      return false;
    } else {
      idSet.add(i.id);
      return true;
    }
  });
}
function formatItem<T>(item: T, idPropertyName = "id") {
  return {
    id: item[idPropertyName] as string | number,
    item: item,
  };
}
/**
 *
 * @param paginationRequest 请求函数，返回需要请求到的数组
 */
const usePagination = <T>(
  paginationRequest: (currPage: number) => Promise<T[]>,
  option = {
    idPropertyName: "id",
    initialPage: 1,
    beforeAllRequest: (currPage:number) => {}
  }
) => {
  const [list, dispatch] = useReducer(reducer<T>, [] as IDataList<T>);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { idPropertyName, initialPage,beforeAllRequest } = option;
  const page = useRef(initialPage);
  const fetchData = async (type:string) => {
    setLoading(true);
    try {
      const {currPage} = beforeAllRequest(page.current)??{currPage:page.current};
      const dataList = await paginationRequest(page.current);
      page.current++;
      const payload = dataList.map(item =>
        formatItem(item, idPropertyName)
      );
      dispatch({ type, payload });
      return payload;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const refresh = () => {
    page.current = initialPage;
    fetchData("RESET");
  };
  const run = (currPage: number = page.current) => {
    page.current = currPage;
    fetchData("ADD");
  };
  useEffect(() => { 
    refresh()
  },[])
  return {
    data:list.map(i=>i["item"]),
    loading,
    error,
    run,
    refresh,
    fetchData,
  };
};
export default usePagination;
export { usePagination };
