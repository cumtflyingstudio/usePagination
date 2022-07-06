# usePagination

```javascript
import usePagination from "@flying-studio/use-pagination";
const { data, loading, error, run, refresh, fetchData } = usePagination(
  (currPage) => request(currPage)
);
```

## quick start

```shell
npm i @flying-studio/use-pagination
yarn add @flying-studio/use-pagination
pnpm add @flying-studio/use-pagination
```

## API
```typescript
declare const usePagination: <T>(paginationRequest: (currPage: number) => Promise<T[]>, option?: {
    idPropertyName: string;
    initialPage: number;
    beforeAllRequest: (currPage: number) => number;
    afterAllRequest: (list: T[]) => void;
} | undefined) => {
    data: T[];
    loading: boolean;
    error: boolean;
    run: (currPage?: number) => void; // with page++
    refresh: () => void; // reload the list with page 1
    fetchData: (type: string) => Promise<{
        id: any;
        item: T;
    }[] | undefined>; 
};
```
