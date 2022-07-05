type IRequestFn<P extends unknown[], R> = (...args: P) => Promise<R>
interface ITask<T> {
  value?: T
  (Val: T): void
}
function wrapperSchedular<P extends unknown[], R>(
  requestFn: IRequestFn<P, R>,
  option?: {
    type: 'latest' | 'fastest' | 'list'
  },
) {
  const { type = 'fastest' } = option ?? {}
  const st: ITask<R>[] = []
  return async function (this: unknown, ...args: P) {
    return new Promise<R>((resolve) => {
      const task: ITask<R> = (_res: R) => {
        resolve(_res)
      }
      st.push(task)

      if (type === 'fastest') {
        requestFn.apply(this, args).then((res) => {
          st.forEach(t => t(res))
          st.length = 0
        })
      }
      else if (type === 'latest') {
        requestFn.apply(this, args).then((res) => {
          const index = st.indexOf(task)
          if (index === st.length - 1) {
            st.forEach(t => t(res))
            st.length = 0
          }
        })
      }
      else if (type === 'list') {
        requestFn.apply(this, args).then((res) => {
          task.value = res
          const index = st.indexOf(task)
          if (index === 0) {
            while (st.length && st[0]?.value !== undefined) {
              const t = st.shift()!
              t(t.value!)
            }
          }
        })
      }
    })
  }
}
export default wrapperSchedular
