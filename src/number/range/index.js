import Range from '../../util/Range';

export default function(start, end) {
  return new NumberRange(start, end);
}

class NumberRange extends Range {
}

