export function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  delay: number,
) {
  let timer: number | undefined;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
