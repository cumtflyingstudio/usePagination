/**
 *
 * @param request
 * @returns
 * @example
 * const request = () => Promise.resolve(1)
 * const myRequest = withThen(request,()=>{
 *  console.log("hello")
 * });
 */
function withThen(request: (...args: unknown[]) => Promise<unknown>, callback) {
  return function (...args: unknown[]) {
    return request.apply(this, args).then(callback);
  };
}
export default withThen;
