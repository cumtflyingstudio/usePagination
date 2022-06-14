// 先返回优先 后发出优先
// all functions return who backs first
// all functions return the latest request`s result

function wrapperSchedular<F, R>(
  requestFn: F extends (...args: unknown[]) => Promise<R> ? F : never,
  option?: {
    type?: "fastest" | "latest";
  }
) {
  // do with params
  const { type = "latest" } = option ?? {};

  // some variables in closure
  const taskQueue = new Set<Function>();
  let latestTask = null;

  return function (...args: any[]) {
    return new Promise((resolve, reject) => {
      const task = (res) => {
        resolve(res);
        taskQueue.delete(task);
      };
      taskQueue.add(task);
      latestTask = task;
      requestFn(...args).then((res) => {
        if (type === "fastest") {
          if (taskQueue.size === 0) return res;
          taskQueue.forEach((task) => task(res));
        } else if (type === "latest") {
          if (taskQueue.size === 0) return res;
          if (latestTask === task) {
            taskQueue.forEach((task) => task(res));
          }
        }
      });
    }) as Promise<R>;
  };
}
export default wrapperSchedular;
