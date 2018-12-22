(function($) {

  function hasOwnProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function arrayEach(arr, fn) {
    for(var i = 0; i < arr.length; i++) {
      fn(arr[i], i, arr);
    }
  }

  function arrayEvery(arr, fn) {
    for(var i = 0; i < arr.length; i++) {
      if(!fn(arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  }

  function capitalize(str) {
    if (str.match(/^es\d$/)) {
      return str.toUpperCase();
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function commaSeparate(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function getSplitPath() {
    var match = document.location.pathname.match(/(\w+)\/(\w+)\/([\w-]+)(\.html|\/)?$/);
    return [match[1], match[2], match[3]];
  }

  function getTestName() {
    return window.parent === window ? '' : getSplitPath().join(' | ');
  }

  function createHTML() {
    var testName = getTestName();
    var testLink = '<a target="_top" href="' + document.location.pathname + '">' + testName + '</a>';
    document.title = testName;
    $(document.body).append([
      '<div class="set">',
        '<h4 class="name">' + testLink + '</h4>',
        '<div class="loading">Running tests.</div>',
        '<ul id="tests" class="tests"></ul>',
        '<p id="stats" class="stats"></p>',
      '</div>'
    ].join(''));
  }

  function escapeHTML(str) {
    return str ? str.replace(/</g, '&lt;').replace(/>/g, '&gt;').valueOf() : '';
  }

  function getFailureHTML(f) {
    var expected, actual, message = escapeHTML(f.message);
    if(f.warning) {
      return '<p class="warning">Warning: ' + message + '</p>';
    } else {
      var html = '<p class="fail">' + message;
      if (hasOwnProperty(f, 'expected') && hasOwnProperty(f, 'actual')) {
        expected = getStringified(f.expected);
        actual = getStringified(f.actual);
        html += ' | expected: ' + escapeHTML(expected) + ' actual: ' + escapeHTML(actual);
      }
      html += '</p>';
      return html;
    }
  };

  function getStringified(p, stack) {
    var str, arr, isArray = p && p.join, arrayHasUndefined, isCyc;
    if (p && p.getTime && p.setHours) {
      return p.toString();
    }
    arrayHasUndefined = isArray && $.inArray(undefined, p) !== -1;
    if(p && p.length > 5000) return 'One BIG ass array of length ' + p.length;
    if(typeof p === 'function') return 'function';
    if(typeof p !== 'object') return String(p);
    str = isArray ? '[' : '{';
    arr = [];
    stack = stack || [];

    stringify:
    for(var key in p){
      if(!hasOwnProperty(p, key)) continue;
      if(p[key] === undefined) {
        arr.push(key + ': undefined');
      } else {
        var val = p[key];
        if (typeof val === 'string') {
          val = '"' + val + '"';
        }
        isCyc = false;

        // Cyclic structure check
        if (stack.length > 1) {
          var i = stack.length;
          while (i--) {
            if (stack[i] === val) {
              arr.push(key + ':CYC');
              continue stringify;
            }
          }
        }

        stack.push(val);
        arr.push((isArray ? '' : key + ': ') + getStringified(val, stack));
      }
    }
    str += arr.join(',');
    str += isArray ? ']' : '}';
    return str;
  };

  function testsFinished(runtime, namespaces) {
    var testHtml = '', tipHtml = '';

    var totalTests = 0;
    var totalAssertions = 0;
    var totalSkipped = 0;
    var totalFailed = 0;

    arrayEach(namespaces, function(p) {
      var li = '', tip = '', className = '';

      totalTests++;
      totalAssertions += p.assertions;
      totalFailed += p.failures.length;
      totalSkipped += p.skipped.length;
      tip += '<h5>' + p.name + (p.subname ? ' | ' + p.subname : '') + '</h5>';
      if(p.failures.length > 0) {
        arrayEach(p.failures, function(f) {
          tip += getFailureHTML(f);
          if(f.warning) {
            totalFailed--;
          }

        });
        var warning = arrayEvery(p.failures, function(f){ return f.warning; });
        if(warning) {
          className += 'warning';
          li += '.';
        } else {
          className += 'fail';
          li += 'F';
          tip += '<p class="fail">Fail (' + commaSeparate(p.assertions) + ' assertions)</p>';
        }
      } else {
        className += 'pass';
        li += '.';
        tip += '<p class="pass">Pass (' + commaSeparate(p.assertions) + ' assertions)</p>';
      }

      tipHtml += '<div class="hidden" id="tip_'+ totalTests +'">'+ tip +'</div>'
      testHtml += '<li class="test '+ className +'" title="#tip_'+ totalTests +'">'+ li +'</li>';
    });

    $('#stats').html([
      '<span class="failures">' + totalFailed + ' ' + (totalFailed == 1 ? 'failure' : 'failures') + '</span>',
      '<span class="assertions">' + commaSeparate(totalAssertions) + ' ' + (totalAssertions == 1 ? 'assertion' : 'assertions') + '</span>',
      '<span class="tests">' + totalTests + ' ' + (totalTests == 1 ? 'test' : 'tests') + '</span>',
      '<span class="skipped">' + (totalSkipped > 0 ? '(' + totalSkipped + ' skipped)' : '') + '</span>',
      '<span class="runtime">Completed in ' + runtime / 1000 + ' seconds</span>'
    ].join(''));
    $('#tests').html(testHtml);
    $(document.body).addClass('finished').append(tipHtml);
    $('#tests [title]').tooltip({ color: 'black' });
  }

  $(document).ready(function() {
    createHTML();
  });

  window.testsFinished = testsFinished;

})(jQuery);
