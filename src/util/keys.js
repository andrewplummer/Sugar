import { isRegExp } from './typeChecks';

export function getKeyMatcher(args) {
  args = args.flat();
  return (key) => {
    return args.some((arg) => {
      if (isRegExp(arg)) {
        return arg.test(key);
      } else {
        return arg == key;
      }
    });
  };
}
