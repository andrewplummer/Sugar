// Compiles an optimized regex source from alternates in an array.
//
// Expected input is relatively well structured, for example:
//
// 1. "NUM days ago", "NUM months from now", "in NUM weeks", etc.
// 2. "NUM 日前", "NUM ヶ月後", "NUM 週前", etc.
//
// Basic approach:
//
// - Build a simple trie of tokens from each space-split string in the array.
//
// - Traverse the trie from the leaf nodes, reducing each branch into a string
//   using the following steps:
//
//   1. If there are no nodes in the branch then return an empty string.
//
//   2. If there is one node in the branch, then return the "join" of it's key
//      and value where a "join" is a string that will match the exact phrase
//     when used inside a regex without causing alternation.
//
//   3. Otherwise, check each node for duplicates and remove them from the trie,
//      joining both keys as an "alternation" which will match either token. If
//      the branch has changed as a result of this operation, then recursively
//      check it to continue removing duplicates.
//
//   4. When no more optimization is possible, take all nodes, "join" their keys
//      and values together, and take the entire result as alternates.
//
//   5. Return the entire reduced value as the regex source.
//
// Notes:
//
// - CJK languages like Japanese and Chinese do not benefit as much as they do
//   not use spaces but tend to be more structured anyway, so this method still
//   works well.
//
// - The "alternation" algorithm will check to see if either string matches the
//   other by slicing 1 character from the end. If it does, it will return the
//   longest string with a "?" token at the end. This allows heavy optimization
//   for English plurals and other inflections. This may slice non-BMP tokens,
//   however the result will not match the other string, in which case a normal
//   alternation with a "|" character will be returned.

export function compileRegExpAlternates(arr, sep) {
  const trie = buildTokenTrie(arr);
  return reduceTrie(trie, (branch) => {
    return reduceBranch(branch, sep);
  });
}

function buildTokenTrie(arr) {
  const trie = {};
  for (let str of arr) {
    const tokens = str.split(' ');
    let branch = trie;
    for (let token of tokens) {
      if (!branch[token]) {
        branch[token] = {};
      }
      branch = branch[token];
    }
  }
  return trie;
}

function reduceTrie(trie, fn) {
  for (let [key, branch] of Object.entries(trie)) {
    trie[key] = reduceTrie(branch, fn);
  }
  return fn(trie);
}

function reduceBranch(branch, sep) {
  const keys = Object.keys(branch);
  if (keys.length === 0) {
    return '';
  } else if (keys.length === 1) {
    const [token] = keys;
    return joinTokenSource(token, branch[token], sep);
  } else {
    let changed = false;
    for (let key1 of keys) {
      for (let key2 of keys) {
        if (key1 === key2) {
          continue;
        }
        if (key1 in branch && branch[key1] === branch[key2]) {
          const src = alternateTokenSource(key1, key2);
          branch[src] = branch[key1];
          delete branch[key1];
          delete branch[key2];
          changed = true;
        }
      }
    }
    if (changed) {
      return reduceBranch(branch, sep);
    } else {
      return keys.map((key) => {
        return joinTokenSource(key, branch[key], sep);
      }).join('|');
    }
  }
}

// Join regex tokens in a way that will match the exact phase without
// alternation.  Must accept its own output as potential input.
//
// Examples:
//
//   "" + "day"
// = "day"
//
//   "day" + ""
// = "day"
//
//   "day" + "ago"
// = "day ago"
//
//   "day" + "from now"
// = "day from now"
//
//   "day|year" + "ago|from now"
// = "(?:day|year) (?:ago|from now)"
//
//   "one|two" + "(?:days?|years?) (?:ago|from now)"
// = "(?:one|two) (?:day|year) (?:ago|from now)"
function joinTokenSource(str1, str2, separator = ' ') {
  if (!str1 || !str2) {
    return str1 || str2;
  }
  str1 = getNonCapturingGroup(str1);
  str2 = getNonCapturingGroup(str2);
  return [str1, str2].join(separator);
}

// Join regex tokens in a way that will alternate the phrases.
// Must accept its own output as potential input. Can potentially
// make a single character optional.
//
// Examples:
//
//   "" + ""
// = ""
//
//   "" + "day"
// = "day"
//
//   "day" + ""
// = "day"
//
//   "one" + "two"
// = "one|two"
//
//   "ago" + "from now"
// = "ago|from now"
//
//   "day" + "days"
// = "days?"
//
//   "days" + "day"
// = "days?"
//
//   "days?" + "years?"
// = "days?|years?"
//
//   "days?" + "days?"
// = "days?"
//
//   "one|two" + "six|ten"
// = "one|two|six|ten"
//
//   "next (?:week|month)" + "Jan|Feb"
// = "next (?:week|month)|Jan|Feb"
function alternateTokenSource(str1, str2) {
  if (str1 === str2 || !str1 || !str2) {
    return str1 || str2;
  }
  const [min, max] = str1.length > str2.length ? [str2, str1] : [str1, str2];
  if (max.slice(0, -1) === min) {
    return max + '?';
  }
  return [str1, str2].join('|');
}

function getNonCapturingGroup(str) {
  if (str.includes('|')) {
    str = `(?:${str})`;
  }
  return str;
}
