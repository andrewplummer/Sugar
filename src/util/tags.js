export const TYPED_ARRAY_CLASS_TAGS = getClassTags([
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'ArrayBuffer',
]);

// Known serializable classes notably include typed arrays, arguments, and errors,
// and exclude functions.
export const SERIALIZABLE_CLASS_TAGS = new Set([
  ...TYPED_ARRAY_CLASS_TAGS,
  ...getClassTags([
    'Arguments',
    'Boolean',
    'Number',
    'String',
    'Date',
    'RegExp',
    'Error',
    'Array',
    'Set',
    'Map',
  ]),
]);

function getClassTags(names) {
  return new Set(names.map((name) => {
    return `[object ${name}]`;
  }));
}
