import { isArray, isFunction } from './typeChecks';
import { deepGetProperty } from './deepProperties';

export function mapWithShortcuts(el, map, context, mapArgs) {
  if (!map) {
    return el;
  } else if (map.apply) {
    return map.apply(context, mapArgs);
  } else if (isArray(map)) {
    return map.map((m) => {
      return mapWithShortcuts(el, m, context, mapArgs);
    });
  } else if (isFunction(el[map])) {
    return el[map].call(el);
  } else {
    return deepGetProperty(el, map);
  }
}
