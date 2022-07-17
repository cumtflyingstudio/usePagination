type IRequestFn<P extends unknown[], R> = (...args: P) => Promise<R>;
interface ITask<T> {
  value?: T
  reject: (err: Error) => void
  (Val: T): void
}
function wrapperSchedular<P extends unknown[], R>(
  requestFn: IRequestFn<P, R>,
  option?: {
    type: 'latest' | 'fastest' | 'list'
  },
) {
  const { type = 'fastest' } = option ?? {};
  const st: ITask<R>[] = [];
  return async function (this: unknown, ...args: P) {
    return new Promise<R>((resolve, reject) => {
      const task: ITask<R> = (_res: R) => {
        resolve(_res);
      };
      task.reject = reject
      st.push(task);

      if (type === 'fastest') {
        requestFn.apply(this, args).then((res) => {
          st.forEach(t => t(res));
          st.length = 0;
        }).catch((err) => {
          console.error('usePagination handled error:', err)
        });
      }
      else if (type === 'latest') {
        requestFn.apply(this, args).then((res) => {
          if (task === st[st.length - 1]) {
            st.forEach(t => t(res));
            st.length = 0;
          }
          else {
            task.value = res;
          }
        }).catch((err) => {
          const index = st.indexOf(task);
          if (index === st.length - 1) {
            for (let i = index; i >= 0; i--) {
              const value = st[i].value
              if (value !== undefined) {
                st.forEach(t => t(value))
                console.error('usePagination handled error:', err)
                return;
              }
              if (i === 0) {
                st.forEach(t => t.reject(err))
                st.length = 0;
              }
            }
          }
        });
      }
      else if (type === 'list') {
        requestFn.apply(this, args).then((res) => {
          task.value = res;
          while (st.length && st[0]?.value !== undefined) {
            const t = st.shift()!;
            t(t.value!);
          }
        }).catch((err) => {
          const index = st.indexOf(task);
          st.shift()
          reject(err)
          if (index === 0) {
            while (st.length && st[0]?.value !== undefined) {
              const t = st.shift()!;
              t(t.value!);
            }
          }
        });
      }
    });
  };
}
export default wrapperSchedular;
