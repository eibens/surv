export type Func<X, Y> = (x: X) => Y | Promise<Y>;

export type Predicate<X> = Func<X, boolean>;

export function rule<X, Y>(
  match: Predicate<X>,
  apply: Func<X, Y>,
) {
  return async (x: X) => {
    if (await match(x)) {
      await apply(x);
    }
  };
}

export function and<X>(...fs: Predicate<X>[]): Predicate<X> {
  return async (x: X) => {
    return (await evaluate(...fs)(x))
      .reduce((a, b) => a && b, true);
  };
}

export function or<X>(...fs: Predicate<X>[]): Predicate<X> {
  return async (x: X) => {
    return (await evaluate(...fs)(x))
      .reduce((a, b) => a || b, false);
  };
}

export function not<X>(f: Predicate<X>): Predicate<X> {
  return async (x: X) => {
    return !(await f(x));
  };
}

function evaluate<X>(...fs: Predicate<X>[]) {
  return async (x: X): Promise<boolean[]> => {
    return await Promise.all(fs.map((f) => f(x)));
  };
}
