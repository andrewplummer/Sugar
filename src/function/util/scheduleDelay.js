import { assertNonNegativeInteger } from '../../util/assertions';

export default function scheduleDelay(fn, ms, args = []) {
  assertNonNegativeInteger(ms);

  if (!fn.timers) {
    fn.timers = [];
  }

  if (!fn.cancel) {
    fn.cancel = () => {
      for (let timer of fn.timers) {
        clearTimeout(timer);
      }
      fn.timers = [];
    };
  }

  fn.timers.push(
    setTimeout(() => {
      fn.apply(null, args);
    }, ms)
  );

  return fn;
}
