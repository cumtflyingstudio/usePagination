import usePagination from "../src/react/usePagination";

function request() {
  return new Promise<number[]>((resolve) => {
    setTimeout(() => {
      resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });
}
const { data } = usePagination(request);
