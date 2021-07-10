type Task<X extends unknown[]> = (...x: X) => (void | Promise<void>);

export function sequence<X extends unknown[]>(...tasks: Task<X>[]) {
  return async (...x: X) => {
    for (const task of tasks) {
      await task(...x);
    }
  };
}
