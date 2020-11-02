"use strict";
/* eslint-disable no-sparse-arrays */

namespace("Array", () => {

  describeStatic("construct", (construct) => {
    it("should handle basic construction", () => {
      assertArrayEqual(
        construct(3, (n) => n * n),
        [0, 1, 4]
      );
    });

    it("should work with parseInt", () => {
      assertArrayEqual(construct(3, parseInt), [0, 1, 2]);
    });

    it("should handle irregular input", () => {
      assertArrayEqual(
        construct(0, (i) => i),
        []
      );
      assertError(() => {
        construct();
      });
      assertError(() => {
        construct(-1, (i) => i);
      });
      assertError(() => {
        construct(2.2, (i) => i);
      });
      assertError(() => {
        construct("3", (i) => i);
      });
      assertError(() => {
        construct(NaN, (i) => i);
      });
      assertError(() => {
        construct(null, (i) => i);
      });
      assertError(() => {
        construct(undefined, (i) => i);
      });
    });
  });

  describeInstance("groupBy", (groupBy) => {
    var basic = [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 2, b: 3 },
    ];

    var people = [
      { name: { first: "Jim", last: "Beam" }, age: 52 },
      { name: { first: "Edmund", last: "Edgar" }, age: 27 },
      { name: { first: "Jim", last: "Croche" }, age: 27 },
      { name: { first: "Ron", last: "Howard" }, age: 13 },
    ];

    it("should group empty arrays", () => {
      assertObjectEqual(groupBy([]), {});
    });

    it("should group by function", () => {
      assertObjectEqual(
        groupBy(basic, (el) => {
          return el["a"];
        }),
        {
          1: [
            { a: 1, b: 2 },
            { a: 1, b: 3 },
          ],
          2: [{ a: 2, b: 3 }],
        }
      );
      assertObjectEqual(
        groupBy(people, (person) => {
          return person.age;
        }),
        {
          52: [people[0]],
          27: [people[1], people[2]],
          13: [people[3]],
        }
      );
    });

    it("should group by identity", () => {
      assertObjectEqual(groupBy([1, 1, 2, 2, 3, 3, 4]), {
        1: [1, 1],
        2: [2, 2],
        3: [3, 3],
        4: [4],
      });
      assertObjectEqual(groupBy(["a", "b", "a", "e"]), {
        a: ["a", "a"],
        b: ["b"],
        e: ["e"],
      });
    });

    it("should group by string shortcut", () => {
      assertObjectEqual(groupBy(basic, "a"), {
        1: [
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        2: [{ a: 2, b: 3 }],
      });
      assertObjectEqual(groupBy(["one", "two", "three"], "length"), {
        3: ["one", "two"],
        5: ["three"],
      });
    });

    it("should group by deep shortcut", () => {
      assertObjectEqual(groupBy(people, "name.first"), {
        Jim: [
          { name: { first: "Jim", last: "Beam" }, age: 52 },
          { name: { first: "Jim", last: "Croche" }, age: 27 },
        ],
        Edmund: [{ name: { first: "Edmund", last: "Edgar" }, age: 27 }],
        Ron: [{ name: { first: "Ron", last: "Howard" }, age: 13 }],
      });
    });

    it("should call a function if necessary", () => {
      const obj = {
        name: function () {
          assertEqual(this, obj);
          return "Jim";
        },
      };
      assertObjectEqual(groupBy([obj], "name"), {
        Jim: [obj],
      });
    });

    it("should have correct arguments", () => {
      groupBy(["a"], function (el, i, arr) {
        assertEqual(el, "a");
        assertEqual(i, 0);
        assertArrayEqual(arr, ["a"]);
        assertArrayEqual(this, ["a"]);
      });
    });
  });

  describeInstance("at", (at) => {
    it("should work with normal indexes", () => {
      assertEqual(at(["a", "b", "c"], 0), "a");
      assertEqual(at(["a", "b", "c"], 1), "b");
      assertEqual(at(["a", "b", "c"], 2), "c");
      assertUndefined(at(["a", "b", "c"], 3));
    });

    it("should work with negative indexes", () => {
      assertEqual(at(["a", "b", "c"], -1), "c");
      assertEqual(at(["a", "b", "c"], -2), "b");
      assertEqual(at(["a", "b", "c"], -3), "a");
      assertUndefined(at(["a", "b", "c"], -4));
    });

    it("should allow looping with positive indexes", () => {
      assertEqual(at(["a", "b", "c"], 3, true), "a");
      assertEqual(at(["a", "b", "c"], 4, true), "b");
      assertEqual(at(["a", "b", "c"], 5, true), "c");
      assertEqual(at(["a", "b", "c"], 6, true), "a");
      assertEqual(at(["a", "b", "c"], 6000, true), "a");
    });

    it("should allow looping with negative indexes", () => {
      assertEqual(at(["a", "b", "c"], -4, true), "c");
      assertEqual(at(["a", "b", "c"], -5, true), "b");
      assertEqual(at(["a", "b", "c"], -6, true), "a");
      assertEqual(at(["a", "b", "c"], -7, true), "c");
      assertEqual(at(["a", "b", "c"], -7000, true), "c");
    });

    it("should return multiple elements with an array", () => {
      assertArrayEqual(at(["a", "b", "c"], [0, 2]), ["a", "c"]);
      assertArrayEqual(at(["a", "b", "c"], [1, 2]), ["b", "c"]);
      assertArrayEqual(at(["a", "b", "c"], [1, 3]), ["b", undefined]);
    });

    it("should return multiple elements with negative indexes", () => {
      assertArrayEqual(at(["a", "b", "c"], [-1, -2]), ["c", "b"]);
      assertArrayEqual(at(["a", "b", "c"], [-1, -3]), ["c", "a"]);
      assertArrayEqual(at(["a", "b", "c"], [-1, -4]), ["c", undefined]);
    });

    it("should return multiple elements with mixed indexes", () => {
      assertArrayEqual(at(["a", "b", "c"], [-1, 1]), ["c", "b"]);
      assertArrayEqual(at(["a", "b", "c"], [1, -1]), ["b", "c"]);
    });

    it("should return multiple elements with looping", () => {
      assertArrayEqual(at(["a", "b", "c"], [1, 3], true), ["b", "a"]);
      assertArrayEqual(at(["a", "b", "c"], [-1, -4], true), ["c", "c"]);
      assertArrayEqual(at(["a", "b", "c"], [-4000, 5000], true), ["c", "c"]);
    });

    it("should have no issues with sparse arrays", () => {
      assertEqual(at(["a", , "c"], 0), "a");
      assertUndefined(at(["a", , "c"], 1));
      assertEqual(at(["a", , "c"], 2), "c");
      assertUndefined(at(["a", , "c"], 3));
      assertEqual(at(["a", , "c"], 3, true), "a");
      assertEqual(at(["a", , "c"], -1), "c");
      assertUndefined(at(["a", , "c"], -2));
      assertEqual(at(["a", , "c"], -3), "a");
      assertUndefined(at(["a", , "c"], -4));
      assertEqual(at(["a", , "c"], -4, true), "c");
    });

    it("should handle irregular input", () => {
      assertEqual(at(["a", "b", "c"], "0"), "a");
      assertEqual(at(["a", "b", "c"], "1"), "b");
      assertEqual(at(["a", "b", "c"], "-1"), "c");
      assertEqual(at(["a", "b", "c"], "-0"), "a");
      assertEqual(at(["a", "b", "c"], null), "a");
      assertEqual(at(["a", "b", "c"], true), "b");
      assertEqual(at(["a", "b", "c"], false), "a");
      assertUndefined(at(["a", "b", "c"]));
      assertUndefined(at(["a", "b", "c"], undefined));
    });
  });

  describeInstance("remove", (remove) => {
    it("should modify the array", () => {
      var arr1 = ["a", "b", "c"];
      var arr2 = remove(arr1, "c");
      assertEqual(arr1.length, 2);
      assertEqual(arr2, arr1);
    });

    it("should remove array members", () => {
      assertArrayEqual(remove([1, 2, 2, 3], 2), [1, 3]);
      assertArrayEqual(remove([0, 1], 0), [1]);
    });

    it("should remove by regex", () => {
      assertArrayEqual(remove(["a", "b", "c"], /[ac]/), ["b"]);
      assertArrayEqual(remove([1, 2, 3, 4], /[2-3]/), [1, 4]);
    });

    it("should remove by date", () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertArrayEqual(remove([d1, d2], new Date(2020, 7, 28)), [d2]);
    });

    it("should remove by function", () => {
      assertArrayEqual(
        remove([1, 2, 3, 4], (n) => n % 2 === 0),
        [1, 3]
      );
      assertArrayEqual(
        remove([1, 2, 3, 4], (n) => n > 5),
        [1, 2, 3, 4]
      );
      assertArrayEqual(
        remove([1, 2, 3, 4], (n) => n > 2),
        [1, 2]
      );
    });

    it("should remove by function when strictly equal", () => {
      var fn1 = () => {};
      var fn2 = () => {};
      assertArrayEqual(remove([fn1, fn2], fn2), [fn1]);
    });

    it("should remove by fuzzy matching", () => {
      assertArrayEqual(
        remove(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 1 }
        ),
        [{ a: 2, b: 2 }]
      );
      assertArrayEqual(
        remove([{ name: "Frank" }, { name: "James" }], { name: /^[A-F]/ }),
        [{ name: "James" }]
      );
    });

    it("should pass correct arguments", () => {
      remove(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      remove(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertArrayEqual(remove([1, 2, 2, 3]), [1, 2, 2, 3]);
      assertArrayEqual(remove([1, 2, 2, 3], null), [1, 2, 2, 3]);
      assertArrayEqual(remove([1, 2, 2, 3], NaN), [1, 2, 2, 3]);
      assertError(() => {
        remove(null);
      });
      assertError(() => {
        remove("a");
      });
      assertError(() => {
        remove(1);
      });
    });
  });

  describeInstance("exclude", (exclude) => {
    it("should not modify the array", () => {
      var arr1 = ["a", "b", "c"];
      var arr2 = exclude(arr1, "c");
      assertEqual(arr1.length, 3);
      assertEqual(arr2.length, 2);
    });

    it("should exclude array members", () => {
      assertArrayEqual(exclude([1, 2, 2, 3], 2), [1, 3]);
      assertArrayEqual(exclude([0, 1], 0), [1]);
    });

    it("should exclude by regex", () => {
      assertArrayEqual(exclude(["a", "b", "c"], /[ac]/), ["b"]);
      assertArrayEqual(exclude([1, 2, 3, 4], /[2-3]/), [1, 4]);
    });

    it("should exclude by date", () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertArrayEqual(exclude([d1, d2], new Date(2020, 7, 28)), [d2]);
    });

    it("should exclude by function", () => {
      assertArrayEqual(
        exclude([1, 2, 3, 4], (n) => n % 2 === 0),
        [1, 3]
      );
      assertArrayEqual(
        exclude([1, 2, 3, 4], (n) => n > 5),
        [1, 2, 3, 4]
      );
      assertArrayEqual(
        exclude([1, 2, 3, 4], (n) => n > 2),
        [1, 2]
      );
    });

    it("should exclude by function when strictly equal", () => {
      var fn1 = () => {};
      var fn2 = () => {};
      assertArrayEqual(exclude([fn1, fn2], fn2), [fn1]);
    });

    it("should exclude by fuzzy matching", () => {
      assertArrayEqual(
        exclude(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 1 }
        ),
        [{ a: 2, b: 2 }]
      );
      assertArrayEqual(
        exclude([{ name: "Frank" }, { name: "James" }], { name: /^[A-F]/ }),
        [{ name: "James" }]
      );
    });

    it("should pass correct arguments", () => {
      exclude(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      exclude(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertArrayEqual(exclude([1, 2, 2, 3]), [1, 2, 2, 3]);
      assertArrayEqual(exclude([1, 2, 2, 3], null), [1, 2, 2, 3]);
      assertArrayEqual(exclude([1, 2, 2, 3], NaN), [1, 2, 2, 3]);
      assertError(() => {
        exclude(null);
      });
      assertError(() => {
        exclude("a");
      });
      assertError(() => {
        exclude(1);
      });
    });
  });

  describeInstance("map", (map) => {
    it("should map with function mapper", () => {
      assertArrayEqual(
        map([1, 2, 3, 4], (n) => n * 2),
        [2, 4, 6, 8]
      );
      assertArrayEqual(
        map([1, 2, 3, 4], (n) => (n % 2 === 0 ? n : 0)),
        [0, 2, 0, 4]
      );
      assertArrayEqual(
        map([1, 2, 3, 4], (n) => (n > 5 ? n : 0)),
        [0, 0, 0, 0]
      );
      assertArrayEqual(
        map([1, 2, 3, 4], (n) => (n > 2 ? n : 0)),
        [0, 0, 3, 4]
      );
    });

    it("should map with string mapper", () => {
      assertArrayEqual(map([{ age: 2 }, { age: 5 }], "age"), [2, 5]);
      assertArrayEqual(map([{ age: 2 }, { age: 5 }], "height"), [
        undefined,
        undefined,
      ]);
    });

    it("should handle deep properties", () => {
      assertArrayEqual(
        map(
          [
            { profile: { likes: 20 } },
            { profile: { likes: 17 } },
            { profile: { likes: 36 } },
          ],
          "profile.likes"
        ),
        [20, 17, 36]
      );
      assertArrayEqual(
        map(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[0].views"
        ),
        [80, 97, 12]
      );
      assertArrayEqual(
        map(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[-1].views"
        ),
        [80, 97, 12]
      );
      assertArrayEqual(
        map(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts.0.views"
        ),
        [80, 97, 12]
      );
    });

    it("should be able multiple properties with an array", () => {
      // Issue #386
      assertArrayEqual(
        map(
          [
            { name: "John", age: 25 },
            { name: "Fred", age: 85 },
            { name: "Kirk", age: 17 },
          ],
          ["name", "age"]
        ),
        [
          ["John", 25],
          ["Fred", 85],
          ["Kirk", 17],
        ]
      );
    });

    it("should be able to map with array range syntax", () => {
      assertArrayEqual(
        map(
          [
            { posts: [{ views: 80 }, { views: 40 }, { views: 20 }] },
            { posts: [{ views: 97 }, { views: 13 }, { views: 52 }] },
            { posts: [{ views: 11 }, { views: 45 }, { views: 81 }] },
          ],
          "posts[1..2].views"
        ),
        [
          [40, 20],
          [13, 52],
          [45, 81],
        ]
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      map(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should be able to use built-in properties", () => {
      assertArrayEqual(map(["a", "aa", "aaa"], "length"), [1, 2, 3]);
    });

    it("should be able to use built-in functions", () => {
      assertArrayEqual(map([1, 4, 9], Math.sqrt), [1, 2, 3]);
    });

    it("should handle issue #525", () => {
      assertArrayEqual(map([{ foo: "foo" }, { bar: "bar" }], Object.keys), [
        ["foo"],
        ["bar"],
      ]);
    });

    it("should pass correct arguments", () => {
      map(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should handle irregular input", () => {
      assertArrayEqual(map([1, 2, 3], null), [1, 2, 3]);
      assertArrayEqual(map([1, 2], "."), [undefined, undefined]);
      assertArrayEqual(map([1, 2], 4), [undefined, undefined]);
      assertError(() => {
        map();
      });
      assertError(() => {
        map("..");
      });
      assertError(() => {
        map([]);
      });
      assertError(() => {
        map(null);
      });
      assertError(() => {
        map(1);
      });
      assertError(() => {
        map("a");
      });
    });
  });

  describeInstance("some", (some) => {
    it("should match by primitive matchers", () => {
      assertEqual(some(["a", "b", "c"], "a"), true);
      assertEqual(some(["a", "b", "c"], "d"), false);
      assertEqual(some([3, 1, 2, 3], 7), false);
      assertEqual(some([true, true, false, true], true), true);
      assertEqual(some([false, false, false], true), false);
    });

    it("should match by regex", () => {
      assertEqual(some(["a", "b", "c"], /[ac]/), true);
      assertEqual(some(["a", "b", "c"], /[AC]/), false);
    });

    it("should match by date", () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(some([d1, d2], new Date(2020, 7, 28)), true);
      assertEqual(some([d1, d2], new Date(2020, 7, 30)), false);
    });

    it("should match by function", () => {
      assertEqual(
        some([1, 2, 3, 4], (n) => n % 2 === 0),
        true
      );
      assertEqual(
        some([2, 4, 6, 8], (n) => n % 2 === 1),
        false
      );
      assertEqual(
        some([1, 2, 3, 4], (n) => n > 5),
        false
      );
      assertEqual(
        some([1, 2, 3, 4], (n) => n > 2),
        true
      );
    });

    it("should match by function when strictly equal", () => {
      var fn1 = () => {};
      var fn2 = () => {};
      assertEqual(some([fn1, fn2], fn2), true);
      assertEqual(some([fn1], fn2), false);
    });

    it("should match by fuzzy matching", () => {
      assertEqual(
        some(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 1 }
        ),
        true
      );
      assertEqual(
        some(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 5 }
        ),
        false
      );
      assertEqual(
        some([{ name: "Frank" }, { name: "James" }], { name: /^[A-F]/ }),
        true
      );
      assertEqual(
        some([{ name: "Frank" }, { name: "James" }], { name: /^[N-Z]/ }),
        false
      );
    });

    it("should pass correct arguments", () => {
      some(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var n = 0;
      var arr = ["a"];
      arr[8000] = "b";
      some(arr, () => {
        n++;
      });
      assertEqual(n, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(some([1, 2, 2, 3], null), false);
      assertEqual(some([1, 2, 2, 3], NaN), false);
      assertError(() => {
        some([1]);
      });
      assertError(() => {
        some(null);
      });
      assertError(() => {
        some("a");
      });
      assertError(() => {
        some(1);
      });
    });
  });

  describeInstance("none", (none) => {
    it("should match by primitive matchers", () => {
      assertEqual(none(["a", "b", "c"], "a"), false);
      assertEqual(none(["a", "b", "c"], "d"), true);
      assertEqual(none([3, 1, 2, 3], 7), true);
      assertEqual(none([true, true, false, true], true), false);
      assertEqual(none([false, false, false], true), true);
    });

    it("should match by regex", () => {
      assertEqual(none(["a", "b", "c"], /[ac]/), false);
      assertEqual(none(["a", "b", "c"], /[AC]/), true);
    });

    it("should match by date", () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(none([d1, d2], new Date(2020, 7, 28)), false);
      assertEqual(none([d1, d2], new Date(2020, 7, 30)), true);
    });

    it("should match by function", () => {
      assertEqual(
        none([1, 2, 3, 4], (n) => n % 2 === 0),
        false
      );
      assertEqual(
        none([2, 4, 6, 8], (n) => n % 2 === 1),
        true
      );
      assertEqual(
        none([1, 2, 3, 4], (n) => n > 5),
        true
      );
      assertEqual(
        none([1, 2, 3, 4], (n) => n > 2),
        false
      );
    });

    it("should match by function when strictly equal", () => {
      var fn1 = () => {};
      var fn2 = () => {};
      assertEqual(none([fn1, fn2], fn2), false);
      assertEqual(none([fn1], fn2), true);
    });

    it("should match by fuzzy matching", () => {
      assertEqual(
        none(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 1 }
        ),
        false
      );
      assertEqual(
        none(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 7 }
        ),
        true
      );
      assertEqual(
        none([{ name: "Frank" }, { name: "James" }], { name: /^[A-F]/ }),
        false
      );
      assertEqual(
        none([{ name: "Frank" }, { name: "James" }], { name: /^[N-Z]/ }),
        true
      );
    });

    it("should pass correct arguments", () => {
      none(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var n = 0;
      var arr = ["a"];
      arr[8000] = "b";
      none(arr, () => {
        n++;
      });
      assertEqual(n, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(none([1, 2, 2, 3], null), true);
      assertEqual(none([1, 2, 2, 3], NaN), true);
      assertError(() => {
        none([1]);
      });
      assertError(() => {
        none(null);
      });
      assertError(() => {
        none("a");
      });
      assertError(() => {
        none(1);
      });
    });
  });

  describeInstance("every", (every) => {
    it("should match by primitive matchers", () => {
      assertEqual(every(["a", "b", "c"], "a"), false);
      assertEqual(every(["a", "a", "a"], "a"), true);
      assertEqual(every([1, 1, 1], 2), false);
      assertEqual(every([1, 1, 1], 1), true);
      assertEqual(every([false, false, true], false), false);
      assertEqual(every([false, false, false], false), true);
    });

    it("should match by regex", () => {
      assertEqual(every(["a", "b", "c"], /[ac]/), false);
      assertEqual(every(["a", "b", "c"], /[a-c]/), true);
    });

    it("should match by date", () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(every([d1, d2], new Date(2020, 7, 28)), false);
      assertEqual(every([d1, d1], new Date(2020, 7, 28)), true);
    });

    it("should match by function", () => {
      assertEqual(
        every([1, 2, 3, 4], (n) => n % 2 === 0),
        false
      );
      assertEqual(
        every([2, 4, 6, 8], (n) => n % 2 === 0),
        true
      );
      assertEqual(
        every([1, 2, 3, 4], (n) => n > 5),
        false
      );
      assertEqual(
        every([1, 2, 3, 4], (n) => n > 0),
        true
      );
    });

    it("should match by function when strictly equal", () => {
      var fn1 = () => {};
      var fn2 = () => {};
      assertEqual(every([fn1, fn2], fn2), false);
      assertEqual(every([fn2, fn2], fn2), true);
    });

    it("should match by fuzzy matching", () => {
      assertEqual(
        every(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 1 }
        ),
        false
      );
      assertEqual(
        every(
          [
            { a: 1, b: 1 },
            { a: 1, b: 2 },
          ],
          { a: 1 }
        ),
        true
      );
      assertEqual(
        every([{ name: "Frank" }, { name: "James" }], { name: /^[A-F]/ }),
        false
      );
      assertEqual(
        every([{ name: "Frank" }, { name: "James" }], { name: /^[A-J]/ }),
        true
      );
    });

    it("should pass correct arguments", () => {
      every(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var n = 0;
      var arr = ["a"];
      arr[8000] = "b";
      every(arr, () => {
        n++;
        return true;
      });
      assertEqual(n, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(every([1, 2, 2, 3], null), false);
      assertEqual(every([1, 2, 2, 3], NaN), false);
      assertError(() => {
        every([1]);
      });
      assertError(() => {
        every(null);
      });
      assertError(() => {
        every("a");
      });
      assertError(() => {
        every(1);
      });
    });
  });

  describeInstance("filter", (filter) => {
    it("should filter array members", () => {
      assertArrayEqual(filter([1, 2, 2, 3], 2), [2, 2]);
      assertArrayEqual(filter([0, 1], 0), [0]);
    });

    it("should filter by regex", () => {
      assertArrayEqual(filter(["a", "b", "c"], /[ac]/), ["a", "c"]);
      assertArrayEqual(filter([1, 2, 3, 4], /[2-3]/), [2, 3]);
    });

    it("should filter by date", () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertArrayEqual(filter([d1, d2], new Date(2020, 7, 28)), [d1]);
    });

    it("should filter by function", () => {
      assertArrayEqual(
        filter([1, 2, 3, 4], (n) => n % 2 === 0),
        [2, 4]
      );
      assertArrayEqual(
        filter([1, 2, 3, 4], (n) => n > 5),
        []
      );
      assertArrayEqual(
        filter([1, 2, 3, 4], (n) => n > 2),
        [3, 4]
      );
    });

    it("should filter by function when strictly equal", () => {
      var fn1 = () => {};
      var fn2 = () => {};
      assertArrayEqual(filter([fn1, fn2], fn2), [fn2]);
    });

    it("should filter by fuzzy matching", () => {
      assertArrayEqual(
        filter(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 1 }
        ),
        [{ a: 1, b: 1 }]
      );
      assertArrayEqual(
        filter([{ name: "Frank" }, { name: "James" }], { name: /^[A-F]/ }),
        [{ name: "Frank" }]
      );
    });

    it("should allow fuzzy matches on non-plain objects", () => {
      // Issue #157
      function Foo(a) {
        this.a = a;
      }
      assertArrayEqual(filter([{ a: 1 }, { b: 2 }], new Foo(1)), [{ a: 1 }]);
      assertArrayEqual(filter([{ a: "a" }, { a: "b" }], new Foo("a")), [
        { a: "a" },
      ]);
      assertArrayEqual(filter([{ a: "a" }, { a: "b" }], new Foo(/b/)), [
        { a: "b" },
      ]);
    });

    it("should pass correct arguments", () => {
      filter(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      filter(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertArrayEqual(filter([1, 2, 2, 3]), []);
      assertArrayEqual(filter([1, 2, 2, 3], null), []);
      assertArrayEqual(filter([1, 2, 2, 3], NaN), []);
      assertError(() => {
        filter(null);
      });
      assertError(() => {
        filter("a");
      });
      assertError(() => {
        filter(1);
      });
    });
  });

  describeInstance("find", (find) => {
    it("should find array members", () => {
      assertEqual(find([1, 2, 2, 3], 2), 2);
      assertEqual(find([0, 1], 0), 0);
    });

    it("should find by regex", () => {
      assertEqual(find(["a", "b", "c"], /[ac]/), "a");
      assertEqual(find([1, 2, 3, 4], /[2-3]/), 2);
    });

    it("should find by date", () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertDateEqual(find([d1, d2], new Date(2020, 7, 28)), d1);
    });

    it("should find by function", () => {
      assertEqual(
        find([1, 2, 3, 4], (n) => n % 2 === 0),
        2
      );
      assertEqual(
        find([1, 2, 3, 4], (n) => n > 5),
        undefined
      );
      assertEqual(
        find([1, 2, 3, 4], (n) => n > 2),
        3
      );
    });

    it("should find by function when strictly equal", () => {
      var fn1 = () => {};
      var fn2 = () => {};
      assertEqual(find([fn1, fn2], fn2), fn2);
    });

    it("should find by fuzzy matching", () => {
      assertObjectEqual(
        find(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 1 }
        ),
        { a: 1, b: 1 }
      );
      assertObjectEqual(
        find([{ name: "Frank" }, { name: "James" }], { name: /^[A-F]/ }),
        { name: "Frank" }
      );
    });

    it("should pass correct arguments", () => {
      find(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      find(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(find([1, 2, 2, 3]), undefined);
      assertEqual(find([1, 2, 2, 3], null), undefined);
      assertEqual(find([1, 2, 2, 3], NaN), undefined);
      assertError(() => {
        find(null);
      });
      assertError(() => {
        find("a");
      });
      assertError(() => {
        find(1);
      });
    });
  });

  describeInstance("findIndex", (findIndex) => {
    it("should find array members", () => {
      assertEqual(findIndex([1, 2, 2, 3], 2), 1);
      assertEqual(findIndex([0, 1], 0), 0);
    });

    it("should find by regex", () => {
      assertEqual(findIndex(["a", "b", "c"], /[ac]/), 0);
      assertEqual(findIndex([1, 2, 3, 4], /[2-3]/), 1);
    });

    it("should find by date", () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(findIndex([d1, d2], new Date(2020, 7, 28)), 0);
    });

    it("should find by function", () => {
      assertEqual(
        findIndex([1, 2, 3, 4], (n) => n % 2 === 0),
        1
      );
      assertEqual(
        findIndex([1, 2, 3, 4], (n) => n > 5),
        -1
      );
      assertEqual(
        findIndex([1, 2, 3, 4], (n) => n > 2),
        2
      );
    });

    it("should find by function when strictly equal", () => {
      var fn1 = () => {};
      var fn2 = () => {};
      assertEqual(findIndex([fn1, fn2], fn2), 1);
    });

    it("should find by fuzzy matching", () => {
      assertEqual(
        findIndex(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 1 }
        ),
        0
      );
      assertEqual(
        findIndex([{ name: "Frank" }, { name: "James" }], { name: /^[A-F]/ }),
        0
      );
    });

    it("should pass correct arguments", () => {
      findIndex(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      findIndex(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(findIndex([1, 2, 2, 3]), -1);
      assertEqual(findIndex([1, 2, 2, 3], null), -1);
      assertEqual(findIndex([1, 2, 2, 3], NaN), -1);
      assertError(() => {
        findIndex(null);
      });
      assertError(() => {
        findIndex("a");
      });
      assertError(() => {
        findIndex(1);
      });
    });
  });

  describeInstance("count", (count) => {
    it("should count all elements with no arguments", () => {
      assertEqual(count(["a", "b", "c"]), 3);
    });

    it("should count by primitive matchers", () => {
      assertEqual(count(["a", "b", "c"], "a"), 1);
      assertEqual(count([3, 1, 2, 3], 3), 2);
      assertEqual(count([true, true, false, true], true), 3);
    });

    it("should match by regex", () => {
      assertEqual(count(["a", "b", "c"], /[ac]/), 2);
      assertEqual(count([1, 2, 3, 4], /[3]/), 1);
    });

    it("should count by date", () => {
      var d1 = new Date(2020, 7, 28);
      var d2 = new Date(2020, 7, 29);
      assertEqual(count([d1, d2], new Date(2020, 7, 28)), 1);
    });

    it("should count by function", () => {
      assertEqual(
        count([1, 2, 3, 4], (n) => n % 2 === 0),
        2
      );
      assertEqual(
        count([1, 2, 3, 4], (n) => n > 5),
        0
      );
      assertEqual(
        count([1, 2, 3, 4], (n) => n > 2),
        2
      );
    });

    it("should count by function when strictly equal", () => {
      var fn1 = () => {};
      var fn2 = () => {};
      assertEqual(count([fn1, fn2], fn2), 1);
    });

    it("should count by fuzzy matching", () => {
      assertEqual(
        count(
          [
            { a: 1, b: 1 },
            { a: 2, b: 2 },
          ],
          { a: 1 }
        ),
        1
      );
      assertEqual(
        count([{ name: "Frank" }, { name: "James" }], { name: /^[A-F]/ }),
        1
      );
    });

    it("should pass correct arguments", () => {
      count(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var n = 0;
      var arr = ["a"];
      arr[8000] = "b";
      count(arr, () => {
        n++;
      });
      assertEqual(n, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(count([1, 2, 2, 3], null), 0);
      assertEqual(count([1, 2, 2, 3], NaN), 0);
      assertError(() => {
        count(null);
      });
      assertError(() => {
        count("a");
      });
      assertError(() => {
        count(1);
      });
    });
  });

  describeInstance("sum", (sum) => {
    it("should sum all elements with no arguments", () => {
      assertEqual(sum([1, 2, 3]), 6);
      assertEqual(sum([0, 0, 0]), 0);
    });

    it("should sum with function mapper", () => {
      assertEqual(
        sum([1, 2, 3, 4], (n) => n * 2),
        20
      );
      assertEqual(
        sum([1, 2, 3, 4], (n) => (n % 2 === 0 ? n : 0)),
        6
      );
      assertEqual(
        sum([1, 2, 3, 4], (n) => (n > 5 ? n : 0)),
        0
      );
      assertEqual(
        sum([1, 2, 3, 4], (n) => (n > 2 ? n : 0)),
        7
      );
    });

    it("should sum with string mapper", () => {
      assertEqual(sum([{ age: 2 }, { age: 5 }], "age"), 7);
      assertNaN(sum([{ age: 2 }, { age: 5 }], "height"));
    });

    it("should handle deep properties", () => {
      assertEqual(
        sum(
          [
            { profile: { likes: 20 } },
            { profile: { likes: 17 } },
            { profile: { likes: 36 } },
          ],
          "profile.likes"
        ),
        73
      );
      assertEqual(
        sum(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[0].views"
        ),
        189
      );
      assertEqual(
        sum(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts.0.views"
        ),
        189
      );
    });

    it("should pass correct arguments", () => {
      sum(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      sum(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(sum([]), 0);
      assertEqual(sum([null, false]), 0);
      assertError(() => {
        sum();
      });
      assertError(() => {
        sum(null);
      });
      assertError(() => {
        sum(1);
      });
      assertError(() => {
        sum("a");
      });
    });
  });

  describeInstance("average", (average) => {
    it("should average all elements with no arguments", () => {
      assertEqual(average([1, 2, 3]), 2);
      assertEqual(average([0, 0, 0]), 0);
    });

    it("should average with function mapper", () => {
      assertEqual(
        average([1, 2, 3, 4], (n) => n * 2),
        5
      );
      assertEqual(
        average([1, 2, 3, 4], (n) => (n % 2 === 0 ? n : 0)),
        1.5
      );
      assertEqual(
        average([1, 2, 3, 4], (n) => (n > 5 ? n : 0)),
        0
      );
      assertEqual(
        average([1, 2, 3, 4], (n) => (n > 2 ? n : 0)),
        1.75
      );
    });

    it("should average with string mapper", () => {
      assertEqual(average([{ age: 2 }, { age: 5 }], "age"), 3.5);
      assertNaN(average([{ age: 2 }, { age: 5 }], "height"));
    });

    it("should handle deep properties", () => {
      assertEqual(
        average(
          [
            { profile: { likes: 20 } },
            { profile: { likes: 17 } },
            { profile: { likes: 38 } },
          ],
          "profile.likes"
        ),
        25
      );
      assertEqual(
        average(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[0].views"
        ),
        63
      );
      assertEqual(
        average(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts.0.views"
        ),
        63
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      average(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(average([]), 0);
      assertEqual(average([null, false]), 0);
      assertNaN(average([NaN, NaN]));
      assertError(() => {
        average();
      });
      assertError(() => {
        average(null);
      });
      assertError(() => {
        average(1);
      });
      assertError(() => {
        average("a");
      });
    });
  });

  describeInstance("median", (median) => {
    it("should median average all elements with no arguments", () => {
      assertEqual(median([1, 2, 5, 6, 7]), 5);
      assertEqual(median([1, 2, 5, 6, 7, 8]), 5.5);
      assertEqual(median([8, 7, 6, 5, 2, 1]), 5.5);
      assertEqual(median([1, 2, 80, 81, 82]), 80);
      assertEqual(median([0, 0, 0]), 0);
    });

    it("should median average with function mapper", () => {
      assertEqual(
        median([1, 2, 3, 4], (n) => n * 2),
        5
      );
      assertEqual(
        median([1, 2, 3, 4], (n) => (n % 2 === 0 ? n : 0)),
        1
      );
      assertEqual(
        median([1, 2, 3, 4], (n) => (n > 5 ? n : 0)),
        0
      );
      assertEqual(
        median([1, 2, 3, 4], (n) => (n > 2 ? n : 0)),
        1.5
      );
    });

    it("should average with string mapper", () => {
      assertEqual(median([{ age: 2 }, { age: 5 }], "age"), 3.5);
      assertNaN(median([{ age: 2 }, { age: 5 }], "height"));
    });

    it("should handle deep properties", () => {
      assertEqual(
        median(
          [
            { profile: { likes: 10 } },
            { profile: { likes: 17 } },
            { profile: { likes: 38 } },
            { profile: { likes: 18 } },
          ],
          "profile.likes"
        ),
        17.5
      );
      assertEqual(
        median(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[0].views"
        ),
        80
      );
      assertEqual(
        median(
          [
            { posts: [{ views: 20 }] },
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts.0.views"
        ),
        50
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      median(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(median([]), 0);
      assertEqual(median([null, false]), 0);
      assertNaN(median([NaN, NaN]));
      assertError(() => {
        median();
      });
      assertError(() => {
        median(null);
      });
      assertError(() => {
        median(1);
      });
      assertError(() => {
        median("a");
      });
    });
  });

  describeInstance("min", (min) => {
    it("should work with no arguments", () => {
      assertEqual(min([1, 2, 3]), 1);
      assertEqual(min([0, 0, 0]), 0);
    });

    it("should allow a function mapper", () => {
      assertEqual(
        min([1, 2, 3, 4], (n) => 1 / n),
        4
      );
    });

    it("should allow a string mapper", () => {
      assertObjectEqual(min([{ age: 5 }, { age: 2 }], "age"), { age: 2 });
      assertObjectEqual(min([{ age: 2 }, { age: 5 }], "height"), { age: 2 });
    });

    it("should handle deep properties", () => {
      assertObjectEqual(
        min(
          [
            { profile: { likes: 20 } },
            { profile: { likes: 17 } },
            { profile: { likes: 36 } },
          ],
          "profile.likes"
        ),
        { profile: { likes: 17 } }
      );
      assertObjectEqual(
        min(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[0].views"
        ),
        { posts: [{ views: 12 }] }
      );
      assertObjectEqual(
        min(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts.0.views"
        ),
        { posts: [{ views: 12 }] }
      );
    });

    it("should handle infinite values", () => {
      assertEqual(min([Infinity]), Infinity);
      assertEqual(min([-Infinity]), -Infinity);
    });

    it("should pass correct arguments", () => {
      min(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      min(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(min([]), undefined);
      assertEqual(min(["c", "b", "a"]), "a");
      assertEqual(min([null, false]), null);
      assertError(() => {
        min();
      });
      assertError(() => {
        min(null);
      });
      assertError(() => {
        min(1);
      });
      assertError(() => {
        min("a");
      });
    });
  });

  describeInstance("minAll", (minAll) => {
    it("should work with no arguments", () => {
      assertArrayEqual(minAll([1, 2, 3]), [1]);
      assertArrayEqual(minAll([1, 1, 2, 3]), [1, 1]);
      assertArrayEqual(minAll([0, 0, 0]), [0, 0, 0]);
    });

    it("should allow a function mapper", () => {
      assertArrayEqual(
        minAll([1, 2, 3, 4], (n) => 1 / n),
        [4]
      );
    });

    it("should allow a string mapper", () => {
      assertArrayEqual(minAll([{ age: 5 }, { age: 2 }], "age"), [{ age: 2 }]);
      assertArrayEqual(minAll([{ age: 2 }, { age: 5 }], "height"), [
        { age: 2 },
        { age: 5 },
      ]);
    });

    it("should handle deep properties", () => {
      assertArrayEqual(
        minAll(
          [
            { profile: { likes: 20 } },
            { profile: { likes: 17 } },
            { profile: { likes: 36 } },
          ],
          "profile.likes"
        ),
        [{ profile: { likes: 17 } }]
      );
      assertArrayEqual(
        minAll(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[0].views"
        ),
        [{ posts: [{ views: 12 }] }]
      );
      assertArrayEqual(
        minAll(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts.0.views"
        ),
        [{ posts: [{ views: 12 }] }]
      );
    });

    it("should handle infinite values", () => {
      assertArrayEqual(minAll([Infinity]), [Infinity]);
      assertArrayEqual(minAll([-Infinity]), [-Infinity]);
    });

    it("should pass correct arguments", () => {
      minAll(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      minAll(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertArrayEqual(minAll([]), []);
      assertArrayEqual(minAll(["c", "b", "a"]), ["a"]);
      assertArrayEqual(minAll([null, false]), [null]);
      assertError(() => {
        minAll();
      });
      assertError(() => {
        minAll(null);
      });
      assertError(() => {
        minAll(1);
      });
      assertError(() => {
        minAll("a");
      });
    });
  });

  describeInstance("max", (max) => {
    it("should work with no arguments", () => {
      assertEqual(max([1, 2, 3]), 3);
      assertEqual(max([0, 0, 0]), 0);
    });

    it("should allow a function mapper", () => {
      assertEqual(
        max([1, 2, 3, 4], (n) => 1 / n),
        1
      );
    });

    it("should allow a string mapper", () => {
      assertObjectEqual(max([{ age: 5 }, { age: 2 }], "age"), { age: 5 });
      assertObjectEqual(max([{ age: 2 }, { age: 5 }], "height"), { age: 2 });
    });

    it("should handle deep properties", () => {
      assertObjectEqual(
        max(
          [
            { profile: { likes: 20 } },
            { profile: { likes: 17 } },
            { profile: { likes: 36 } },
          ],
          "profile.likes"
        ),
        { profile: { likes: 36 } }
      );
      assertObjectEqual(
        max(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[0].views"
        ),
        { posts: [{ views: 97 }] }
      );
      assertObjectEqual(
        max(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts.0.views"
        ),
        { posts: [{ views: 97 }] }
      );
    });

    it("should handle infinite values", () => {
      assertEqual(max([Infinity]), Infinity);
      assertEqual(max([-Infinity]), -Infinity);
    });

    it("should pass correct arguments", () => {
      max(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      max(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertEqual(max([]), undefined);
      assertEqual(max(["c", "b", "a"]), "c");
      assertEqual(max([null, false]), null);
      assertError(() => {
        max();
      });
      assertError(() => {
        max(null);
      });
      assertError(() => {
        max(1);
      });
      assertError(() => {
        max("a");
      });
    });
  });

  describeInstance("maxAll", (maxAll) => {
    it("should work with no arguments", () => {
      assertArrayEqual(maxAll([1, 2, 3]), [3]);
      assertArrayEqual(maxAll([1, 2, 3, 3]), [3, 3]);
      assertArrayEqual(maxAll([0, 0, 0]), [0, 0, 0]);
    });

    it("should allow a function mapper", () => {
      assertArrayEqual(
        maxAll([1, 2, 3, 4], (n) => 1 / n),
        [1]
      );
    });

    it("should allow a string mapper", () => {
      assertArrayEqual(maxAll([{ age: 5 }, { age: 2 }], "age"), [{ age: 5 }]);
      assertArrayEqual(maxAll([{ age: 2 }, { age: 5 }], "height"), [
        { age: 2 },
        { age: 5 },
      ]);
    });

    it("should handle deep properties", () => {
      assertArrayEqual(
        maxAll(
          [
            { profile: { likes: 20 } },
            { profile: { likes: 17 } },
            { profile: { likes: 36 } },
          ],
          "profile.likes"
        ),
        [{ profile: { likes: 36 } }]
      );
      assertArrayEqual(
        maxAll(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[0].views"
        ),
        [{ posts: [{ views: 97 }] }]
      );
      assertArrayEqual(
        maxAll(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts.0.views"
        ),
        [{ posts: [{ views: 97 }] }]
      );
    });

    it("should handle infinite values", () => {
      assertArrayEqual(maxAll([Infinity]), [Infinity]);
      assertArrayEqual(maxAll([-Infinity]), [-Infinity]);
    });

    it("should pass correct arguments", () => {
      maxAll(
        ["a"],
        function (el, i, arr) {
          assertEqual(el, "a");
          assertEqual(i, 0);
          assertArrayEqual(arr, ["a"]);
          assertEqual(this, "context");
        },
        "context"
      );
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      maxAll(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should handle irregular input", () => {
      assertArrayEqual(maxAll([]), []);
      assertArrayEqual(maxAll(["c", "b", "a"]), ["c"]);
      assertArrayEqual(maxAll([null, false]), [null]);
      assertError(() => {
        maxAll();
      });
      assertError(() => {
        maxAll(null);
      });
      assertError(() => {
        maxAll(1);
      });
      assertError(() => {
        maxAll("a");
      });
    });
  });

  describeInstance("shuffle", (shuffle) => {
    function assertRandomized(arr, fn) {
      var result = fn(arr);
      assertTrue(
        result.some((el, i) => {
          return el !== arr[i];
        })
      );
    }

    it("should randomize a basic array", () => {
      assertRandomized([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (arr) => {
        return shuffle(arr);
      });
    });

    it("should handle irregular input", () => {
      assertArrayEqual(shuffle([]), []);
      assertError(() => {
        shuffle();
      });
      assertError(() => {
        shuffle(null);
      });
      assertError(() => {
        shuffle(1);
      });
      assertError(() => {
        shuffle("a");
      });
    });
  });

  describeInstance("sample", (sample) => {
    function assertRandom(arr, fn) {
      var last;
      var equal = true;
      for (var i = 0; i < 10; i++) {
        var result = fn(arr);
        if (i === 0) {
          last = result;
        } else if (result !== last) {
          equal = false;
        }
      }
      assertFalse(equal);
    }

    it("should sample from a basic array", () => {
      assertRandom([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (arr) => {
        return sample(arr);
      });
    });

    it("should optionally allow removal from the array", () => {
      var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      var len = arr.length;
      var sampled = sample(arr, true);
      assertFalse(
        arr.some((el) => {
          return el === sampled;
        })
      );
      assertEqual(arr.length, len - 1);
    });

    it("should handle irregular input", () => {
      assertEqual(sample([]), undefined);
      assertError(() => {
        sample();
      });
      assertError(() => {
        sample(null);
      });
      assertError(() => {
        sample(1);
      });
      assertError(() => {
        sample("a");
      });
    });
  });

  describeInstance("isEmpty", (isEmpty) => {
    it("should report true for empty arrays", () => {
      assertTrue(isEmpty([]));
    });

    it("should report false for non-empty arrays", () => {
      assertFalse(isEmpty([1]));
      assertFalse(isEmpty([null]));
      assertFalse(isEmpty([undefined]));
    });

    it("should report false for sparse arrays", () => {
      assertFalse(isEmpty([,]));
    });

    it("should handle irregular input", () => {
      assertError(() => {
        isEmpty(null);
      });
      assertError(() => {
        isEmpty("8");
      });
      assertError(() => {
        isEmpty(8);
      });
    });
  });

  describeInstance("sortBy", (sortBy) => {
    it("should sort basic values without an argument", () => {
      assertArrayEqual(sortBy([3, 4, 1, 2]), [1, 2, 3, 4]);
      assertArrayEqual(sortBy(["c", "a", "b", "d"]), ["a", "b", "c", "d"]);
    });

    it("should sort in descending order", () => {
      assertArrayEqual(
        sortBy([3, 4, 1, 2], {
          desc: true,
        }),
        [4, 3, 2, 1]
      );
      assertArrayEqual(
        sortBy(["c", "a", "b", "d"], {
          desc: true,
        }),
        ["d", "c", "b", "a"]
      );
    });

    it("should sort by mapping function", () => {
      assertArrayEqual(
        sortBy([{ age: 24 }, { age: 12 }], (obj) => obj.age),
        [{ age: 12 }, { age: 24 }]
      );
    });

    it("should sort by a string shortcut", () => {
      assertArrayEqual(sortBy([{ age: 24 }, { age: 12 }], "age"), [
        { age: 12 },
        { age: 24 },
      ]);
    });

    it("should handle deep properties", () => {
      assertArrayEqual(
        sortBy(
          [
            { profile: { likes: 20 } },
            { profile: { likes: 17 } },
            { profile: { likes: 36 } },
          ],
          "profile.likes"
        ),
        [
          { profile: { likes: 17 } },
          { profile: { likes: 20 } },
          { profile: { likes: 36 } },
        ]
      );
      assertArrayEqual(
        sortBy(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[0].views"
        ),
        [
          { posts: [{ views: 12 }] },
          { posts: [{ views: 80 }] },
          { posts: [{ views: 97 }] },
        ]
      );
      assertArrayEqual(
        sortBy(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts[-1].views"
        ),
        [
          { posts: [{ views: 12 }] },
          { posts: [{ views: 80 }] },
          { posts: [{ views: 97 }] },
        ]
      );
      assertArrayEqual(
        sortBy(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 12 }] },
          ],
          "posts.0.views"
        ),
        [
          { posts: [{ views: 12 }] },
          { posts: [{ views: 80 }] },
          { posts: [{ views: 97 }] },
        ]
      );
    });

    it("should be able to sort multiple fields", () => {
      assertArrayEqual(
        sortBy(
          [
            { age: 24, likes: 20 },
            { age: 24, likes: 12 },
            { age: 22, likes: 10 },
          ],
          "age",
          "likes"
        ),
        [
          { age: 22, likes: 10 },
          { age: 24, likes: 12 },
          { age: 24, likes: 20 },
        ]
      );
      assertArrayEqual(
        sortBy(
          [
            { age: 24, likes: 20 },
            { age: 24, likes: 12 },
            { age: 22, likes: 10 },
          ],
          "age",
          {
            map: "likes",
            desc: true,
          }
        ),
        [
          { age: 22, likes: 10 },
          { age: 24, likes: 20 },
          { age: 24, likes: 12 },
        ]
      );
      assertArrayEqual(
        sortBy(
          [
            { age: 24, likes: 20 },
            { age: 24, likes: 12 },
            { age: 22, likes: 10 },
          ],
          {
            map: "age",
            desc: true,
          },
          {
            map: "likes",
            desc: true,
          }
        ),
        [
          { age: 24, likes: 20 },
          { age: 24, likes: 12 },
          { age: 22, likes: 10 },
        ]
      );
    });

    it("should allow collator option", () => {
      assertArrayEqual(
        sortBy(["1", "2", "9", "10"], {
          collator: new Intl.Collator("en", {
            numeric: true,
          }),
        }),
        ["1", "2", "9", "10"]
      );
      assertArrayEqual(
        sortBy(["*C", "#B", "#A", "@D"], {
          collator: new Intl.Collator("en", {
            ignorePunctuation: true,
          }),
        }),
        ["#A", "#B", "*C", "@D"]
      );
      assertArrayEqual(
        sortBy(["jose", "josy", "Josy", "Jose", "José"], {
          collator: new Intl.Collator("en", {
            sensitivity: "case",
            caseFirst: "upper",
          }),
        }),
        ["Jose", "José", "jose", "Josy", "josy"]
      );
    });

    it("should allow collator for French", () => {
      assertArrayEqual(
        sortBy(
          [
            "adélie",
            "adélaïde",
            "adeline",
            "adelphe",
            "adelle",
            "adèle",
            "adelais",
          ],
          {
            collator: new Intl.Collator("fr"),
          }
        ),
        getIntlCollatedArray("fr", [
          "adélaïde",
          "adelais",
          "adèle",
          "adélie",
          "adeline",
          "adelle",
          "adelphe",
        ])
      );
    });

    it("should allow collator for Czech/Lithuanian", () => {
      assertArrayEqual(
        sortBy(
          [
            "zwect",
            "čweet",
            "žweat",
            "cweat",
            "sweat",
            "swect",
            "šweet",
            "cwect",
            "čweat",
            "zweat",
            "šweat",
            "žweet",
          ],
          {
            collator: new Intl.Collator("cs"),
          }
        ),
        getIntlCollatedArray("cs", [
          "cweat",
          "cwect",
          "čweat",
          "čweet",
          "sweat",
          "swect",
          "šweat",
          "šweet",
          "zweat",
          "zwect",
          "žweat",
          "žweet",
        ])
      );
    });

    it("should allow collator for Swedish", () => {
      assertArrayEqual(
        sortBy(
          [
            "få",
            "fästa",
            "brinna",
            "byta",
            "duga",
            "fängsla",
            "bygga",
            "fara",
            "fånga",
            "bränna",
          ],
          {
            collator: new Intl.Collator("sv"),
          }
        ),
        getIntlCollatedArray("sv", [
          "brinna",
          "bränna",
          "bygga",
          "byta",
          "duga",
          "fara",
          "få",
          "fånga",
          "fängsla",
          "fästa",
        ])
      );
    });

    it("should handle issue #282", () => {
      assertArrayEqual(
        sortBy(["andere", "ändere", "cote", "cotÉ", "cÔte", "cÔtÉ"]),
        ["andere", "ändere", "cote", "cotÉ", "cÔte", "cÔtÉ"]
      );
    });

    it("should handle special cases", () => {
      assertArrayEqual(
        sortBy(["1.528535047e5", "1.528535047e7", "1.528535047e10"], {
          collator: new Intl.Collator("en", {
            numeric: true,
          }),
        }),
        ["1.528535047e5", "1.528535047e7", "1.528535047e10"]
      );
      assertArrayEqual(
        sortBy(
          [
            "192.168.1.1",
            "192.168.0.2",
            "192.168.100.1",
            "192.168.0.1",
            "192.168.0.100",
          ],
          {
            collator: new Intl.Collator("en", {
              numeric: true,
            }),
          }
        ),
        [
          "192.168.0.1",
          "192.168.0.2",
          "192.168.0.100",
          "192.168.1.1",
          "192.168.100.1",
        ]
      );
      assertArrayEqual(
        sortBy(["$10002.00", "$10001.02", "$10001.01", "$999.00"], {
          collator: new Intl.Collator("en", {
            numeric: true,
          }),
        }),
        ["$999.00", "$10001.01", "$10001.02", "$10002.00"]
      );
    });

    it("should be able to map instance values", () => {
      function Foo(a) {
        this.valueOf = () => a;
      }
      const a = new Foo(5);
      const b = new Foo(2);
      const c = new Foo(3);
      const d = new Foo(1);
      const e = new Foo(2);
      assertArrayEqual(sortBy([a, b, c, d, e]), [d, b, e, c, a]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        sortBy(null);
      });
      assertError(() => {
        sortBy("8");
      });
      assertError(() => {
        sortBy(8);
      });
    });
  });

  describeInstance("unique", (unique) => {
    it("should unique basic values without an argument", () => {
      assertArrayEqual(unique([1, 2, 3]), [1, 2, 3]);
      assertArrayEqual(unique([1, 2, 2, 3]), [1, 2, 3]);
      assertArrayEqual(unique([0, 0, 0]), [0]);
      assertArrayEqual(unique([-0, -0, -0]), [-0]);
      assertArrayEqual(unique([NaN, NaN, NaN]), [NaN]);
      assertArrayEqual(unique([null, null, null]), [null]);
      assertArrayEqual(unique([undefined, undefined, undefined]), [undefined]);
      assertArrayEqual(unique(["a", "b", "c"]), ["a", "b", "c"]);
      assertArrayEqual(unique(["a", "b", "c", "c"]), ["a", "b", "c"]);
    });

    it("should unique objects with a mapper function", () => {
      assertArrayEqual(
        unique([{ a: 1 }, { a: 1 }], (el) => el.a),
        [{ a: 1 }]
      );
    });

    it("should unique objects with a string shortcut", () => {
      assertArrayEqual(unique([{ a: 1 }, { a: 1 }], "a"), [{ a: 1 }]);
      assertArrayEqual(unique([{ age: 24 }, { age: 12 }, { age: 12 }], "age"), [
        { age: 24 },
        { age: 12 },
      ]);
    });

    it("should unique objects by deep equality by default", () => {
      assertArrayEqual(unique([{ a: 1 }, { a: 1 }]), [{ a: 1 }]);
    });

    it("should treat objects with reversed keys as unique", () => {
      assertArrayEqual(
        unique([
          { a: 1, b: 2 },
          { b: 2, a: 1 },
        ]),
        [{ a: 1, b: 2 }]
      );
    });

    it("should treat symbol keys as unique", () => {
      const sym = Symbol();
      const result = unique([{ [sym]: 1 }, { [sym]: 2 }]);
      assertEqual(result.length, 2);
    });

    it("should treat objects with reversed symbol keys as unique", () => {
      const sym1 = Symbol(1);
      const sym2 = Symbol(2);
      assertArrayEqual(
        unique([
          { [sym1]: 1, [sym2]: 2 },
          { [sym2]: 2, [sym1]: 1 },
        ]),
        [{ [sym1]: 1, [sym2]: 2 }]
      );
    });

    it("should handle deep properties", () => {
      assertArrayEqual(
        unique(
          [
            { profile: { likes: 17 } },
            { profile: { likes: 17 } },
            { profile: { likes: 36 } },
          ],
          "profile.likes"
        ),
        [{ profile: { likes: 17 } }, { profile: { likes: 36 } }]
      );
      assertArrayEqual(
        unique(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 97 }] },
          ],
          "posts[0].views"
        ),
        [{ posts: [{ views: 80 }] }, { posts: [{ views: 97 }] }]
      );
      assertArrayEqual(
        unique(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 97 }] },
          ],
          "posts[-1].views"
        ),
        [{ posts: [{ views: 80 }] }, { posts: [{ views: 97 }] }]
      );
      assertArrayEqual(
        unique(
          [
            { posts: [{ views: 80 }] },
            { posts: [{ views: 97 }] },
            { posts: [{ views: 97 }] },
          ],
          "posts.0.views"
        ),
        [{ posts: [{ views: 80 }] }, { posts: [{ views: 97 }] }]
      );
    });

    it("should handle sparse arrays", () => {
      const arr = ["a"];
      arr[8000] = "b";
      assertArrayEqual(unique(arr), ["a", "b"]);
    });

    it("should not iterate over non-members of sparse arrays", () => {
      var count = 0;
      var arr = ["a"];
      arr[8000] = "b";
      unique(arr, () => {
        count++;
      });
      assertEqual(count, 2);
    });

    it("should pass correct arguments", () => {
      unique(["a"], function (el, i, arr) {
        assertEqual(el, "a");
        assertEqual(i, 0);
        assertArrayEqual(arr, ["a"]);
      });
    });

    it("should treat array-like structures as separate", () => {
      assertArrayEqual(unique([["a"], { 0: "a" }, ["a"], { 0: "a" }]), [
        ["a"],
        { 0: "a" },
      ]);
    });

    it("should handle class instances", () => {
      function Foo() {}
      const o1 = new Foo();
      const o2 = new Foo();
      assertArrayEqual(unique([o1, o1]), [o1]);
      assertArrayEqual(unique([o1, o2]), [o1, o2]);
      assertArrayEqual(unique([{ a: o1 }, { a: o1 }]), [{ a: o1 }]);
      assertArrayEqual(unique([{ a: o1 }, { a: o2 }]), [{ a: o1 }, { a: o2 }]);
    });

    it("should handle cyclic structures", () => {
      const obj1 = {};
      const obj2 = {};
      obj1.a = obj1;
      obj2.a = obj2;
      assertArrayEqual(unique([obj1, obj1]), [obj1]);
      assertArrayEqual(unique([obj1, obj2]), [obj1]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        unique(null);
      });
      assertError(() => {
        unique("8");
      });
      assertError(() => {
        unique(8);
      });
    });
  });

  describeInstance("union", (union) => {
    it("should merge basic values", () => {
      assertArrayEqual(union([1, 2], [2, 3]), [1, 2, 3]);
      assertArrayEqual(union(["a", "b"], ["b", "c"]), ["a", "b", "c"]);
      assertArrayEqual(union([0, 0], [0, 0]), [0]);
    });

    it("should accept multiple arguments", () => {
      assertArrayEqual(union([1, 2], [2, 3], [3, 4], [4, 5]), [1, 2, 3, 4, 5]);
    });

    it("should accept object values", () => {
      assertArrayEqual(union([{ a: 1 }, { b: 2 }], [{ b: 2 }, { c: 3 }]), [
        { a: 1 },
        { b: 2 },
        { c: 3 },
      ]);
    });

    it("should not affect the passed arrays", () => {
      const arr1 = [1, 2];
      const arr2 = [2, 3];
      const result = union(arr1, arr2);
      assertFalse(result === arr1);
      assertFalse(result === arr2);
    });

    it("should distinguish between strings and numbers", () => {
      assertArrayEqual(union([1, 2, 3], ["1", "2", "3"]), [
        1,
        2,
        3,
        "1",
        "2",
        "3",
      ]);
    });

    it("should work on nested arrays", () => {
      assertArrayEqual(
        union(
          [[1, 2]],
          [
            [1, 2],
            [2, 3],
          ]
        ),
        [
          [1, 2],
          [2, 3],
        ]
      );
    });

    it("should work on nested booleans", () => {
      assertArrayEqual(union([true, false], [false, true]), [true, false]);
    });

    it("should match functions by reference", () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const fn3 = () => {};
      assertArrayEqual(union([fn1, fn2], [fn2, fn3]), [fn1, fn2, fn3]);
    });

    it("should handle complex nested objects", () => {
      let obj1, obj2, obj3;

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(union([obj1, obj2], [obj2, obj3]), [obj1]);

      obj1 = {
        text: "foo1",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo2",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo3",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(union([obj1, obj2], [obj2, obj3]), [obj1, obj2, obj3]);

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo1/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo2/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo3/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(union([obj1, obj2], [obj2, obj3]), [obj1, obj2, obj3]);

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c", "1"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c", "2"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c", "3"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(union([obj1, obj2], [obj2, obj3]), [obj1, obj2, obj3]);

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 16),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 17),
      };
      assertArrayEqual(union([obj1, obj2], [obj2, obj3]), [obj1, obj2, obj3]);

      const fn1 = () => {};
      const fn2 = () => {};
      const fn3 = () => {};

      obj1 = {
        fn: fn1,
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        fn: fn2,
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 16),
      };
      obj3 = {
        fn: fn3,
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 17),
      };
      assertArrayEqual(union([obj1, obj2], [obj2, obj3]), [obj1, obj2, obj3]);
    });

    it("should handle class instances", () => {
      function Foo() {}
      const f1 = new Foo();
      const f2 = new Foo();
      const f3 = new Foo();

      assertArrayEqual(union([f1, f2], [f2, f3]), [f1, f2, f3]);
      assertArrayEqual(union([{ a: f1 }, { a: f2 }], [{ a: f2 }, { a: f3 }]), [
        { a: f1 },
        { a: f2 },
        { a: f3 },
      ]);
    });

    it("should work on sparse arrays", () => {
      const arr1 = [1];
      arr1[10] = 2;
      const arr2 = [];
      arr2[20] = 2;
      arr2[30] = 3;
      assertArrayEqual(union(arr1, arr2), [1, 2, 3]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        union([1, 2], null);
      });
      assertError(() => {
        union(null);
      });
      assertError(() => {
        union("8");
      });
      assertError(() => {
        union(8);
      });
    });
  });

  describeInstance("intersect", (intersect) => {
    it("should merge basic values", () => {
      assertArrayEqual(intersect([1, 2], [2, 3]), [2]);
      assertArrayEqual(intersect(["a", "b"], ["b", "c"]), ["b"]);
      assertArrayEqual(intersect([0, 0], [0, 0]), [0]);
    });

    it("should accept multiple arguments", () => {
      assertArrayEqual(intersect([1, 2], [2, 3], [2, 4], [2, 5]), [2]);
    });

    it("should accept object values", () => {
      assertArrayEqual(intersect([{ a: 1 }, { b: 2 }], [{ b: 2 }, { c: 3 }]), [
        { b: 2 },
      ]);
    });

    it("should not affect the passed arrays", () => {
      const arr1 = [1, 2];
      const arr2 = [2, 3];
      const result = intersect(arr1, arr2);
      assertFalse(result === arr1);
      assertFalse(result === arr2);
    });

    it("should distinguish between strings and numbers", () => {
      assertArrayEqual(intersect([1, 2, 3], ["1", "2", "3"]), []);
    });

    it("should work on nested arrays", () => {
      assertArrayEqual(
        intersect(
          [[1, 2]],
          [
            [1, 2],
            [2, 3],
          ]
        ),
        [[1, 2]]
      );
    });

    it("should work on nested booleans", () => {
      assertArrayEqual(intersect([true, false], [false]), [false]);
    });

    it("should match functions by reference", () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const fn3 = () => {};
      assertArrayEqual(intersect([fn1, fn2], [fn2, fn3]), [fn2]);
    });

    it("should handle complex nested objects", () => {
      let obj1, obj2, obj3;

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(intersect([obj1, obj2], [obj2, obj3]), [obj1]);

      obj1 = {
        text: "foo1",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo2",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo3",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(intersect([obj1, obj2], [obj2, obj3]), [obj2]);

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo1/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo2/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo3/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(intersect([obj1, obj2], [obj2, obj3]), [obj2]);

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c", "1"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c", "2"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c", "3"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(intersect([obj1, obj2], [obj2, obj3]), [obj2]);

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 16),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 17),
      };
      assertArrayEqual(intersect([obj1, obj2], [obj2, obj3]), [obj2]);

      const fn1 = () => {};
      const fn2 = () => {};
      const fn3 = () => {};

      obj1 = {
        fn: fn1,
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        fn: fn2,
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 16),
      };
      obj3 = {
        fn: fn3,
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 17),
      };
      assertArrayEqual(intersect([obj1, obj2], [obj2, obj3]), [obj2]);
    });

    it("should handle class instances", () => {
      function Foo() {}
      const f1 = new Foo();
      const f2 = new Foo();
      const f3 = new Foo();

      assertArrayEqual(intersect([f1, f2], [f2, f3]), [f2]);
      assertArrayEqual(
        intersect([{ a: f1 }, { a: f2 }], [{ a: f2 }, { a: f3 }]),
        [{ a: f2 }]
      );
    });

    it("should work on sparse arrays", () => {
      const arr1 = [1];
      arr1[10] = 2;
      const arr2 = [];
      arr2[20] = 2;
      arr2[30] = 3;
      assertArrayEqual(intersect(arr1, arr2), [2]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        intersect([1, 2], null);
      });
      assertError(() => {
        intersect(null);
      });
      assertError(() => {
        intersect("8");
      });
      assertError(() => {
        intersect(8);
      });
    });
  });

  describeInstance("subtract", (subtract) => {
    it("should subtract basic values", () => {
      assertArrayEqual(subtract([1, 2], [2, 3]), [1]);
      assertArrayEqual(subtract(["a", "b"], ["b", "c"]), ["a"]);
      assertArrayEqual(subtract([0, 0], [0, 0]), []);
    });

    it("should accept object values", () => {
      assertArrayEqual(subtract([{ a: 1 }, { b: 2 }], [{ b: 2 }, { c: 3 }]), [
        { a: 1 },
      ]);
    });

    it("should not affect the passed arrays", () => {
      const arr1 = [1, 2];
      const arr2 = [2, 3];
      const result = subtract(arr1, arr2);
      assertFalse(result === arr1);
      assertFalse(result === arr2);
    });

    it("should distinguish between strings and numbers", () => {
      assertArrayEqual(subtract([1, 2, 3], ["1", "2", "3"]), [1, 2, 3]);
    });

    it("should work on nested arrays", () => {
      assertArrayEqual(
        subtract(
          [
            [1, 2],
            [2, 3],
          ],
          [[1, 2]]
        ),
        [[2, 3]]
      );
    });

    it("should work on nested booleans", () => {
      assertArrayEqual(subtract([true, false], [false]), [true]);
    });

    it("should match functions by reference", () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const fn3 = () => {};
      assertArrayEqual(subtract([fn1, fn2], [fn2, fn3]), [fn1]);
    });

    it("should handle complex nested objects", () => {
      let obj1, obj2, obj3;

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(subtract([obj1, obj2], [obj2, obj3]), []);

      obj1 = {
        text: "foo1",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo2",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo3",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(subtract([obj1, obj2], [obj2, obj3]), [obj1]);

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo1/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo2/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo3/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(subtract([obj1, obj2], [obj2, obj3]), [obj1]);

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c", "1"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c", "2"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c", "3"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      assertArrayEqual(subtract([obj1, obj2], [obj2, obj3]), [obj1]);

      obj1 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 16),
      };
      obj3 = {
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 17),
      };
      assertArrayEqual(subtract([obj1, obj2], [obj2, obj3]), [obj1]);

      const fn1 = () => {};
      const fn2 = () => {};
      const fn3 = () => {};

      obj1 = {
        fn: fn1,
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 15),
      };
      obj2 = {
        fn: fn2,
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 16),
      };
      obj3 = {
        fn: fn3,
        text: "foo",
        arr: ["a", "b", "c"],
        reg: /foo/,
        date: new Date(2001, 5, 17),
      };
      assertArrayEqual(subtract([obj1, obj2], [obj2, obj3]), [obj1]);
    });

    it("should handle class instances", () => {
      function Foo() {}
      const f1 = new Foo();
      const f2 = new Foo();
      const f3 = new Foo();

      assertArrayEqual(subtract([f1, f2], [f2, f3]), [f1]);
      assertArrayEqual(
        subtract([{ a: f1 }, { a: f2 }], [{ a: f2 }, { a: f3 }]),
        [{ a: f1 }]
      );
    });

    it("should work on sparse arrays", () => {
      const arr1 = [1];
      arr1[10] = 2;
      const arr2 = [];
      arr2[20] = 2;
      arr2[30] = 3;
      assertArrayEqual(subtract(arr1, arr2), [1]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        subtract([1, 2], null);
      });
      assertError(() => {
        subtract(null);
      });
      assertError(() => {
        subtract("8");
      });
      assertError(() => {
        subtract(8);
      });
    });
  });

  describeInstance("add", (add) => {
    it("should add basic values", () => {
      assertArrayEqual(add([1, 2], [2, 3]), [1, 2, 2, 3]);
      assertArrayEqual(add(["a", "b"], ["b", "c"]), ["a", "b", "b", "c"]);
      assertArrayEqual(add([0, 0], [0, 0]), [0, 0, 0, 0]);
    });

    it("should add object values", () => {
      assertArrayEqual(add([{ a: 1 }, { b: 2 }], [{ b: 2 }, { c: 3 }]), [
        { a: 1 },
        { b: 2 },
        { b: 2 },
        { c: 3 },
      ]);
    });

    it("should add falsy values", () => {
      assertArrayEqual(add([null], [null]), [null, null]);
      assertArrayEqual(add([NaN], [NaN]), [NaN, NaN]);
      assertArrayEqual(add([undefined], [undefined]), [undefined, undefined]);
      assertArrayEqual(add([false], [false]), [false, false]);
      assertArrayEqual(add([""], [""]), ["", ""]);
    });

    it("should not affect the passed arrays", () => {
      const arr1 = [1, 2];
      const arr2 = [2, 3];
      const result = add(arr1, arr2);
      assertFalse(result === arr1);
      assertFalse(result === arr2);
    });

    it("should work as expected on sparse arrays", () => {
      const arr1 = [1];
      arr1[2] = 2;
      const arr2 = [2];
      arr2[2] = 3;
      assertArrayEqual(add(arr1, arr2), [1, undefined, 2, 2, undefined, 3]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        add([1, 2], null);
      });
      assertError(() => {
        add(null);
      });
      assertError(() => {
        add("8");
      });
      assertError(() => {
        add(8);
      });
    });
  });

  describeInstance("append", (append) => {
    it("should append basic values", () => {
      assertArrayEqual(append([1, 2], [2, 3]), [1, 2, 2, 3]);
      assertArrayEqual(append(["a", "b"], ["b", "c"]), ["a", "b", "b", "c"]);
      assertArrayEqual(append([0, 0], [0, 0]), [0, 0, 0, 0]);
    });

    it("should append object values", () => {
      assertArrayEqual(append([{ a: 1 }, { b: 2 }], [{ b: 2 }, { c: 3 }]), [
        { a: 1 },
        { b: 2 },
        { b: 2 },
        { c: 3 },
      ]);
    });

    it("should append falsy values", () => {
      assertArrayEqual(append([null], [null]), [null, null]);
      assertArrayEqual(append([NaN], [NaN]), [NaN, NaN]);
      assertArrayEqual(append([undefined], [undefined]), [
        undefined,
        undefined,
      ]);
      assertArrayEqual(append([false], [false]), [false, false]);
      assertArrayEqual(append([""], [""]), ["", ""]);
    });

    it("should modify the original array", () => {
      const arr1 = [1, 2];
      const arr2 = [2, 3];
      const result = append(arr1, arr2);
      assertTrue(result === arr1);
    });

    it("should work as expected on sparse arrays", () => {
      const arr1 = [1];
      arr1[2] = 2;
      const arr2 = [2];
      arr2[2] = 3;
      assertArrayEqual(append(arr1, arr2), [1, , 2, 2, undefined, 3]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        append([1, 2], null);
      });
      assertError(() => {
        append(null);
      });
      assertError(() => {
        append("8");
      });
      assertError(() => {
        append(8);
      });
    });
  });

  describeInstance("insert", (insert) => {
    it("should insert element at a specific index", () => {
      assertArrayEqual(insert([1, 2], 3, 0), [3, 1, 2]);
      assertArrayEqual(insert([1, 2], 3, 1), [1, 3, 2]);
      assertArrayEqual(insert([1, 2], 3, 2), [1, 2, 3]);
      assertArrayEqual(insert([1, 2], 3, 3), [1, 2, 3]);
    });

    it("should insert multiple elements at a specific index", () => {
      assertArrayEqual(insert([1, 4], [2, 3], 0), [2, 3, 1, 4]);
      assertArrayEqual(insert([1, 4], [2, 3], 1), [1, 2, 3, 4]);
      assertArrayEqual(insert([1, 4], [2, 3], 2), [1, 4, 2, 3]);
      assertArrayEqual(insert([1, 4], [2, 3], 3), [1, 4, 2, 3]);
    });

    it("should handle irregular input", () => {
      assertArrayEqual(insert([1, 2], 3), [1, 2, 3]);
      assertArrayEqual(insert([1, 2], 3, null), [3, 1, 2]);
      assertArrayEqual(insert([1, 2], 3, undefined), [1, 2, 3]);
      assertError(() => {
        insert(null);
      });
      assertError(() => {
        insert("8");
      });
      assertError(() => {
        insert(8);
      });
    });
  });

  describeInstance("compact", (compact) => {
    it("should remove null and undefined", () => {
      assertArrayEqual(compact([1, null, 2]), [1, 2]);
      assertArrayEqual(compact([1, undefined, 2]), [1, 2]);
      assertArrayEqual(compact([null, null]), []);
      assertArrayEqual(compact([undefined, undefined]), []);
    });

    it("should remove NaN", () => {
      assertArrayEqual(compact([NaN]), []);
      assertArrayEqual(compact([0, NaN, 1]), [0, 1]);
    });

    it("should not remove false, 0, or empty strings", () => {
      assertArrayEqual(compact([""]), [""]);
      assertArrayEqual(compact([0]), [0]);
      assertArrayEqual(compact([false]), [false]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        compact(null);
      });
      assertError(() => {
        compact("8");
      });
      assertError(() => {
        compact(8);
      });
    });
  });

  describeInstance("zip", (zip) => {
    it("should handle basic functionality", () => {
      assertArrayEqual(zip([1, 2, 3]), [[1], [2], [3]]);
      assertArrayEqual(zip([1, 2, 3], [4, 5, 6]), [
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
      assertArrayEqual(zip([1, 2, 3], [4, 5, 6], [7, 8, 9]), [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
      ]);
      assertArrayEqual(zip([1, 2], [4, 5, 6], [7, 8, 9]), [
        [1, 4, 7],
        [2, 5, 8],
      ]);
      assertArrayEqual(zip([4, 5, 6], [1, 2], [8]), [
        [4, 1, 8],
        [5, 2, null],
        [6, null, null],
      ]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        zip(null);
      });
      assertError(() => {
        zip("8");
      });
      assertError(() => {
        zip(8);
      });
    });
  });

  describeInstance("inGroups", (inGroups) => {
    it("should group elements", () => {
      assertArrayEqual(inGroups([1, 2, 3, 4, 5, 6], 1), [[1, 2, 3, 4, 5, 6]]);
      assertArrayEqual(inGroups([1, 2, 3, 4, 5, 6], 2), [
        [1, 2, 3],
        [4, 5, 6],
      ]);
      assertArrayEqual(inGroups([1, 2, 3, 4, 5, 6], 3), [
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
      assertArrayEqual(inGroups([1, 2, 3, 4, 5], 2), [
        [1, 2, 3],
        [4, 5],
      ]);
      assertArrayEqual(inGroups([1, 2], 1), [[1, 2]]);
      assertArrayEqual(inGroups([1], 1), [[1]]);
      assertArrayEqual(inGroups([], 1), [[]]);
      assertArrayEqual(inGroups([], 2), [[], []]);
    });

    it("should group elements with padding", () => {
      assertArrayEqual(inGroups([1, 2, 3, 4, 5], 2, null), [
        [1, 2, 3],
        [4, 5, null],
      ]);
      assertArrayEqual(inGroups([1, 2, 3, 4, 5], 3, null), [
        [1, 2],
        [3, 4],
        [5, null],
      ]);
      assertArrayEqual(inGroups([1], 2, null), [[1], [null]]);
    });

    it("should work as expected on sparse arrays", () => {
      const arr = [1];
      arr[3] = 3;
      assertArrayEqual(inGroups(arr, 2, null), [
        [1, null],
        [null, 3],
      ]);
    });

    it("should handle issue #142", () => {
      const arr = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
      ];
      inGroups(arr, 3);
      assertEqual(arr.length, 20);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        inGroups([], null);
      });
      assertError(() => {
        inGroups([], -1);
      });
      assertError(() => {
        inGroups([], 0);
      });
      assertError(() => {
        inGroups(null);
      });
      assertError(() => {
        inGroups("8");
      });
      assertError(() => {
        inGroups(8);
      });
    });
  });

  describeInstance("inGroupsOf", (inGroupsOf) => {
    it("should group elements", () => {
      assertArrayEqual(inGroupsOf([1, 2, 3, 4, 5, 6], 2), [
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
      assertArrayEqual(inGroupsOf([1, 2, 3, 4, 5, 6], 3), [
        [1, 2, 3],
        [4, 5, 6],
      ]);
      assertArrayEqual(inGroupsOf([1, 2, 3], 1), [[1], [2], [3]]);
      assertArrayEqual(inGroupsOf([1, 2], 1), [[1], [2]]);
      assertArrayEqual(inGroupsOf([1], 1), [[1]]);
      assertArrayEqual(inGroupsOf([], 1), []);
      assertArrayEqual(inGroupsOf([], 2), []);
      assertArrayEqual(inGroupsOf([], 100), []);
    });

    it("should group elements with padding", () => {
      assertArrayEqual(inGroupsOf([1, 2, 3, 4, 5], 3, null), [
        [1, 2, 3],
        [4, 5, null],
      ]);
      assertArrayEqual(inGroupsOf([1, 2, 3, 4, 5], 2, null), [
        [1, 2],
        [3, 4],
        [5, null],
      ]);
      assertArrayEqual(inGroupsOf([1], 3, null), [[1, null, null]]);
    });

    it("should work as expected on sparse arrays", () => {
      const arr = [1];
      arr[3] = 3;
      assertArrayEqual(inGroupsOf(arr, 2, null), [
        [1, null],
        [null, 3],
      ]);
    });

    it("should handle issue #142", () => {
      const arr = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
      ];
      inGroupsOf(arr, 3);
      assertEqual(arr.length, 20);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        inGroupsOf([], null);
      });
      assertError(() => {
        inGroupsOf([], -1);
      });
      assertError(() => {
        inGroupsOf([], 0);
      });
      assertError(() => {
        inGroupsOf(null);
      });
      assertError(() => {
        inGroupsOf("8");
      });
      assertError(() => {
        inGroupsOf(8);
      });
    });
  });

  describeInstance("first", (first) => {
    it("should get the first element with no argument", () => {
      assertEqual(first(["a", "b", "c"]), "a");
    });

    it("should get the first n elements by argument", () => {
      assertArrayEqual(first(["a", "b", "c"], 1), ["a"]);
      assertArrayEqual(first(["a", "b", "c"], 2), ["a", "b"]);
      assertArrayEqual(first(["a", "b", "c"], 3), ["a", "b", "c"]);
      assertArrayEqual(first(["a", "b", "c"], 4), ["a", "b", "c"]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        first([], null);
      });
      assertError(() => {
        first([], -1);
      });
      assertError(() => {
        first([], 0);
      });
      assertError(() => {
        first(null);
      });
      assertError(() => {
        first("8");
      });
      assertError(() => {
        first(8);
      });
    });
  });

  describeInstance("last", (last) => {
    it("should get the last element with no argument", () => {
      assertEqual(last(["a", "b", "c"]), "c");
    });

    it("should get the last n elements by argument", () => {
      assertArrayEqual(last(["a", "b", "c"], 1), ["c"]);
      assertArrayEqual(last(["a", "b", "c"], 2), ["b", "c"]);
      assertArrayEqual(last(["a", "b", "c"], 3), ["a", "b", "c"]);
      assertArrayEqual(last(["a", "b", "c"], 4), ["a", "b", "c"]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        last([], null);
      });
      assertError(() => {
        last([], -1);
      });
      assertError(() => {
        last([], 0);
      });
      assertError(() => {
        last(null);
      });
      assertError(() => {
        last("8");
      });
      assertError(() => {
        last(8);
      });
    });
  });

  describeInstance("from", (from) => {
    it("should get elements from an index", () => {
      assertArrayEqual(from(["a", "b", "c"], 0), ["a", "b", "c"]);
      assertArrayEqual(from(["a", "b", "c"], 1), ["b", "c"]);
      assertArrayEqual(from(["a", "b", "c"], 2), ["c"]);
      assertArrayEqual(from(["a", "b", "c"], 3), []);
      assertArrayEqual(from(["a", "b", "c"], 4), []);
      assertArrayEqual(from(["a", "b", "c"], -1), ["c"]);
      assertArrayEqual(from(["a", "b", "c"], -2), ["b", "c"]);
      assertArrayEqual(from(["a", "b", "c"], -3), ["a", "b", "c"]);
      assertArrayEqual(from(["a", "b", "c"], -4), ["a", "b", "c"]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        from([]);
      });
      assertError(() => {
        from([], null);
      });
      assertError(() => {
        from(null);
      });
      assertError(() => {
        from("8");
      });
      assertError(() => {
        from(8);
      });
    });
  });

  describeInstance("to", (to) => {
    it("should get elements to an index", () => {
      assertArrayEqual(to(["a", "b", "c"], 0), []);
      assertArrayEqual(to(["a", "b", "c"], 1), ["a"]);
      assertArrayEqual(to(["a", "b", "c"], 2), ["a", "b"]);
      assertArrayEqual(to(["a", "b", "c"], 3), ["a", "b", "c"]);
      assertArrayEqual(to(["a", "b", "c"], 4), ["a", "b", "c"]);
      assertArrayEqual(to(["a", "b", "c"], -1), ["a", "b"]);
      assertArrayEqual(to(["a", "b", "c"], -2), ["a"]);
      assertArrayEqual(to(["a", "b", "c"], -3), []);
      assertArrayEqual(to(["a", "b", "c"], -4), []);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        to([]);
      });
      assertError(() => {
        to([], null);
      });
      assertError(() => {
        to(null);
      });
      assertError(() => {
        to("8");
      });
      assertError(() => {
        to(8);
      });
    });
  });

  describeInstance("removeAt", (removeAt) => {
    it("should remove a single element", () => {
      assertArrayEqual(removeAt([1, 2, 2, 3], 0), [2, 2, 3]);
      assertArrayEqual(removeAt([1, 2, 2, 3], 1), [1, 2, 3]);
      assertArrayEqual(removeAt([1, 2, 2, 3], 2), [1, 2, 3]);
      assertArrayEqual(removeAt([1, 2, 2, 3], 3), [1, 2, 2]);
      assertArrayEqual(removeAt([1, 2, 2, 3], 4), [1, 2, 2, 3]);
    });

    it("should remove multiple elements", () => {
      assertArrayEqual(removeAt([1, 2, 2, 3], 0, 1), [2, 3]);
      assertArrayEqual(removeAt([1, 2, 2, 3], 0, 2), [3]);
      assertArrayEqual(removeAt([1, 2, 2, 3], 1, 2), [1, 3]);
      assertArrayEqual(removeAt([1, 2, 2, 3], 1, 5), [1]);
      assertArrayEqual(removeAt([1, 2, 2, 3], 0, 5), []);
    });

    it("should accept negative indexes", () => {
      assertArrayEqual(removeAt([1, 2, 2, 3], -1), [1, 2, 2]);
      assertArrayEqual(removeAt([1, 2, 2, 3], -2), [1, 2, 3]);
      assertArrayEqual(removeAt([1, 2, 2, 3], -3, -2), [1, 3]);
      assertArrayEqual(removeAt([1, 2, 2, 3], -2, 0), [1, 2]);
      assertArrayEqual(removeAt([1, 2, 2, 3], -1, 1), [2, 2]);
      assertArrayEqual(removeAt([1, 2, 2, 3], -2, 2), []);
      assertArrayEqual(removeAt([1, 2, 3, 4, 5, 6], -2, 2), [3, 4]);
    });

    it("should modify the array", () => {
      const arr = [1];
      removeAt(arr, 0);
      assertEqual(arr.length, 0);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        removeAt([]);
      });
      assertError(() => {
        removeAt([], null);
      });
      assertError(() => {
        removeAt([], 0, null);
      });
      assertError(() => {
        removeAt(null);
      });
      assertError(() => {
        removeAt("8");
      });
      assertError(() => {
        removeAt(8);
      });
    });
  });

  describeInstance("isEqual", (isEqual) => {
    // Note comprehensive tests are run through Object#isEqual.

    it("should handle basic array equality", () => {
      assertEqual(isEqual([], []), true);
      assertEqual(isEqual([1], [1]), true);
      assertEqual(isEqual([1], [2]), false);
      assertEqual(isEqual([2], [1]), false);
      assertEqual(isEqual([1], [1, 2]), false);
      assertEqual(isEqual([1, 2], [1]), false);
    });

    it("should function as expected for nested cases", () => {
      assertEqual(isEqual([[1, 2, 3]], [[1, 2, 3]]), true);
      assertEqual(isEqual([[1, 2, 3]], [[1, 2, 4]]), false);
      assertEqual(isEqual([1], { 0: 1, length: 1 }), false);
      assertEqual(isEqual([1, "a", { a: 1 }], [1, "a", { a: 1 }]), true);
      assertEqual(isEqual([1, "a", { a: 1 }], [1, "a", { a: 2 }]), false);
      assertEqual(isEqual([1, "a", { a: 1 }], [1, "b", { a: 1 }]), false);
    });

    it("should distinguish sparse and dense arrays", () => {
      assertEqual(isEqual(new Array(3), new Array(3)), true);
      assertEqual(isEqual(new Array(3), new Array(6)), false);
      assertEqual(isEqual(new Array(6), new Array(3)), false);
      assertEqual(isEqual([, 1], [undefined, 1]), false);
    });
  });

  describeInstance("clone", (clone) => {
    it("should handle basic arrays", () => {
      assertArrayEqual(clone([]), []);
      assertArrayEqual(clone([1, 2, 3]), [1, 2, 3]);
    });

    it("should clone nested arrays", () => {
      assertArrayEqual(clone([{ a: 1 }]), [{ a: 1 }]);
    });

    it("should clone typed arrays", () => {
      assertArrayEqual(
        clone(new Int8Array([1, 2, 3])),
        new Int8Array([1, 2, 3])
      );
      assertArrayEqual(
        clone(new Int16Array([1, 2, 3])),
        new Int16Array([1, 2, 3])
      );
      assertArrayEqual(
        clone(new Int32Array([1, 2, 3])),
        new Int32Array([1, 2, 3])
      );
      assertArrayEqual(
        clone(new Float32Array([1, 2, 3])),
        new Float32Array([1, 2, 3])
      );
      assertArrayEqual(
        clone(new Float64Array([1, 2, 3])),
        new Float64Array([1, 2, 3])
      );
    });

    it("should be shallow", () => {
      const obj = {};
      assertEqual(clone([obj])[0], obj);
    });

    it("should work as expected on shallow arrays", () => {
      assertArrayEqual(clone([, ,]), [, ,]);
    });

    it("should handle irregular input", () => {
      assertError(() => {
        clone(null);
      });
      assertError(() => {
        clone("8");
      });
      assertError(() => {
        clone(8);
      });
    });
  });
});
