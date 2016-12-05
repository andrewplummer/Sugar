// Type definitions for Sugar edge
// Project: https://sugarjs.com/
// Definitions by: Andrew Plummer <plummer.andrew@gmail.com>

declare namespace sugarjs {

  type SugarDefaultChainable<RawValue> = Array.Chainable<any, RawValue> &
                                         Date.Chainable<RawValue> &
                                         Function.Chainable<RawValue> &
                                         Number.Chainable<RawValue> &
                                         Object.Chainable<RawValue> &
                                         RegExp.Chainable<RawValue> &
                                         String.Chainable<RawValue>;

  type NativeConstructor = ArrayConstructor |
                           DateConstructor |
                           FunctionConstructor |
                           NumberConstructor |
                           ObjectConstructor |
                           RegExpConstructor |
                           StringConstructor |
                           BooleanConstructor |
                           ErrorConstructor;

  interface Locale {
    addFormat(src:string, to?: Array<string>): void;
    getDuration(ms: number): string;
    getFirstDayOfWeek(): number;
    getFirstDayOfWeekYear(): number;
    getMonthName(n: number): string;
    getWeekdayName(n: number): string;
  }

  interface ExtendOptions {
    methods?: Array<string>;
    except?: Array<string|NativeConstructor>;
    namespaces?: Array<NativeConstructor>;
    enhance?: boolean;
    enhanceString?: boolean;
    enhanceArray?: boolean;
    objectPrototype?: boolean;
  }

  interface Sugar {
    (opts?: ExtendOptions): Sugar;
    createNamespace(name: string): SugarNamespace;
    extend(opts?: ExtendOptions): Sugar;
    Array: Array.Constructor;
    Date: Date.Constructor;
    Function: Function.Constructor;
    Number: Number.Constructor;
    Object: Object.Constructor;
    RegExp: RegExp.Constructor;
    String: String.Constructor;
  }

  interface Range {
    clamp<T>(el: T): T;
    clone(): sugarjs.Range;
    contains<T>(el: T): boolean;
    days(): number;
    every<T>(amount: string|number, everyFn?: (el: T, i: number, r: sugarjs.Range) => void): T[];
    hours(): number;
    intersect(range: sugarjs.Range): sugarjs.Range;
    isValid(): boolean;
    milliseconds(): number;
    minutes(): number;
    months(): number;
    seconds(): number;
    span(): number;
    toArray<T>(): T[];
    toString(): string;
    union(range: sugarjs.Range): sugarjs.Range;
    weeks(): number;
    years(): number;
  }

  interface SugarNamespace {
    alias(toName: string, from: string|Function): this;
    alias(toName: string, fn: undefined): this;
    defineInstance(methods: Object): this;
    defineInstance(methodName: string, methodFn: Function): this;
    defineInstanceAndStatic(methods: Object): this;
    defineInstanceAndStatic(methodName: string, methodFn: Function): this;
    defineInstancePolyfill(methods: Object): this;
    defineInstancePolyfill(methodName: string, methodFn: Function): this;
    defineInstanceWithArguments(methods: Object): this;
    defineInstanceWithArguments(methodName: string, methodFn: Function): this;
    defineStatic(methods: Object): this;
    defineStatic(methodName: string, methodFn: Function): this;
    defineStaticPolyfill(methods: Object): this;
    defineStaticPolyfill(methodName: string, methodFn: Function): this;
    defineStaticWithArguments(methods: Object): this;
    defineStaticWithArguments(methodName: string, methodFn: Function): this;
    extend(opts?: ExtendOptions): this;
  }

  namespace Array {

    type mapFn<T, U> = (el: T, i: number, arr: T[]) => U;
    type sortMapFn<T, U> = (el: T) => U;
    type searchFn<T> = (el: T, i: number, arr: T[]) => boolean;
    type Chainable<T, RawValue> = ChainableBase<T, RawValue> & Object.ChainableBase<RawValue>;

    interface ArrayOptions {
      sortIgnore?: RegExp;
      sortIgnoreCase?: boolean;
      sortNatural?: boolean;
      sortOrder?: string;
      sortEquivalents?: Object;
      sortCollate?: Function;
    }

    interface Constructor extends SugarNamespace {
      <T>(obj?: number|ArrayLike<T>, clone?: boolean): Chainable<T, T[]>;
      new<T>(obj?: number|ArrayLike<T>, clone?: boolean): Chainable<T, T[]>;
      construct<T>(n: number, indexMapFn: (i: number) => T): T[];
      create<T>(obj?: number|ArrayLike<T>, clone?: boolean): T[];
      add<T>(instance: T[], item: T|T[], index?: number): T[];
      append<T>(instance: T[], item: T|T[], index?: number): T[];
      at<T>(instance: T[], index: number|number[], loop?: boolean): T;
      average<T, U>(instance: T[], map?: string|mapFn<T, U>): number;
      clone<T>(instance: T[]): T[];
      compact<T>(instance: T[], all?: boolean): T[];
      count<T>(instance: T[], search: T|searchFn<T>, context?: any): number;
      every<T>(instance: T[], search: T|searchFn<T>, context?: any): boolean;
      everyFromIndex<T>(instance: T[], startIndex: number, loop?: boolean, ...args: any[]): T;
      everyFromIndex<T>(instance: T[], startIndex: number, ...args: any[]): T;
      exclude<T>(instance: T[], search: T|searchFn<T>): T[];
      filter<T>(instance: T[], search: T|searchFn<T>, context?: any): T[];
      filterFromIndex<T>(instance: T[], startIndex: number, loop?: boolean, ...args: any[]): T;
      filterFromIndex<T>(instance: T[], startIndex: number, ...args: any[]): T;
      find<T>(instance: T[], search: T|searchFn<T>, context?: any): T;
      findFromIndex<T>(instance: T[], startIndex: number, loop?: boolean, ...args: any[]): T;
      findFromIndex<T>(instance: T[], startIndex: number, ...args: any[]): T;
      findIndex<T>(instance: T[], search: T|searchFn<T>, context?: any): number;
      findIndexFromIndex<T>(instance: T[], startIndex: number, loop?: boolean, ...args: any[]): T;
      findIndexFromIndex<T>(instance: T[], startIndex: number, ...args: any[]): T;
      first<T>(instance: T[], num?: number): T;
      flatten<T>(instance: T[], limit?: number): T[];
      forEachFromIndex<T>(instance: T[], startIndex: number, loop?: boolean, ...args: any[]): T;
      forEachFromIndex<T>(instance: T[], startIndex: number, ...args: any[]): T;
      from<T>(instance: T[], index: number): T[];
      groupBy<T, U>(instance: T[], map: string|mapFn<T, U>, groupFn?: (arr: T[], key: string, obj: Object) => void): Object;
      inGroups<T>(instance: T[], num: number, padding?: any): T[];
      inGroupsOf<T>(instance: T[], num: number, padding?: any): T[];
      insert<T>(instance: T[], item: T|T[], index?: number): T[];
      intersect<T>(instance: T[], arr: T[]): T[];
      isEmpty<T>(instance: T[]): boolean;
      isEqual<T>(instance: T[], arr: T[]): boolean;
      last<T>(instance: T[], num?: number): T;
      least<T, U>(instance: T[], all?: boolean, map?: string|mapFn<T, U>): T[];
      least<T, U>(instance: T[], map?: string|mapFn<T, U>): T[];
      map<T, U>(instance: T[], map: string|mapFn<T, U>, context?: any): U[];
      mapFromIndex<T>(instance: T[], startIndex: number, loop?: boolean, ...args: any[]): T;
      mapFromIndex<T>(instance: T[], startIndex: number, ...args: any[]): T;
      max<T, U>(instance: T[], all?: boolean, map?: string|mapFn<T, U>): T;
      max<T, U>(instance: T[], map?: string|mapFn<T, U>): T;
      median<T, U>(instance: T[], map?: string|mapFn<T, U>): number;
      min<T, U>(instance: T[], all?: boolean, map?: string|mapFn<T, U>): T;
      min<T, U>(instance: T[], map?: string|mapFn<T, U>): T;
      most<T, U>(instance: T[], all?: boolean, map?: string|mapFn<T, U>): T[];
      most<T, U>(instance: T[], map?: string|mapFn<T, U>): T[];
      none<T>(instance: T[], search: T|searchFn<T>, context?: any): boolean;
      reduceFromIndex<T>(instance: T[], startIndex: number, loop?: boolean, ...args: any[]): T;
      reduceFromIndex<T>(instance: T[], startIndex: number, ...args: any[]): T;
      reduceRightFromIndex<T>(instance: T[], startIndex: number, loop?: boolean, ...args: any[]): T;
      reduceRightFromIndex<T>(instance: T[], startIndex: number, ...args: any[]): T;
      remove<T>(instance: T[], search: T|searchFn<T>): T[];
      removeAt<T>(instance: T[], start: number, end?: number): T[];
      sample<T>(instance: T[], num?: number, remove?: boolean): T;
      shuffle<T>(instance: T[]): T[];
      some<T>(instance: T[], search: T|searchFn<T>, context?: any): boolean;
      someFromIndex<T>(instance: T[], startIndex: number, loop?: boolean, ...args: any[]): T;
      someFromIndex<T>(instance: T[], startIndex: number, ...args: any[]): T;
      sortBy<T, U>(instance: T[], map?: string|sortMapFn<T, U>, desc?: boolean): T[];
      subtract<T>(instance: T[], item: T|T[]): T[];
      sum<T, U>(instance: T[], map?: string|mapFn<T, U>): number;
      to<T>(instance: T[], index: number): T[];
      union<T>(instance: T[], arr: T[]): T[];
      unique<T, U>(instance: T[], map?: string|mapFn<T, U>): T[];
      zip<T>(instance: T[], ...args: any[]): T[];
      getOption<T>(name: string): T;
      setOption(name: string, value: any): void;
      setOption(options: ArrayOptions): void;
    }

    interface ChainableBase<T, RawValue> {
      raw: RawValue;
      valueOf: () => RawValue;
      toString: () => string;
      add(item: T|T[], index?: number): SugarDefaultChainable<T[]>;
      append(item: T|T[], index?: number): SugarDefaultChainable<T[]>;
      at(index: number|number[], loop?: boolean): SugarDefaultChainable<T>;
      average<U>(map?: string|mapFn<T, U>): SugarDefaultChainable<number>;
      clone(): SugarDefaultChainable<T[]>;
      compact(all?: boolean): SugarDefaultChainable<T[]>;
      count(search: T|searchFn<T>, context?: any): SugarDefaultChainable<number>;
      every(search: T|searchFn<T>, context?: any): SugarDefaultChainable<boolean>;
      everyFromIndex(startIndex: number, loop?: boolean, ...args: any[]): SugarDefaultChainable<T>;
      everyFromIndex(startIndex: number, ...args: any[]): SugarDefaultChainable<T>;
      exclude(search: T|searchFn<T>): SugarDefaultChainable<T[]>;
      filter(search: T|searchFn<T>, context?: any): SugarDefaultChainable<T[]>;
      filterFromIndex(startIndex: number, loop?: boolean, ...args: any[]): SugarDefaultChainable<T>;
      filterFromIndex(startIndex: number, ...args: any[]): SugarDefaultChainable<T>;
      find(search: T|searchFn<T>, context?: any): SugarDefaultChainable<T>;
      findFromIndex(startIndex: number, loop?: boolean, ...args: any[]): SugarDefaultChainable<T>;
      findFromIndex(startIndex: number, ...args: any[]): SugarDefaultChainable<T>;
      findIndex(search: T|searchFn<T>, context?: any): SugarDefaultChainable<number>;
      findIndexFromIndex(startIndex: number, loop?: boolean, ...args: any[]): SugarDefaultChainable<T>;
      findIndexFromIndex(startIndex: number, ...args: any[]): SugarDefaultChainable<T>;
      first(num?: number): SugarDefaultChainable<T>;
      flatten(limit?: number): SugarDefaultChainable<T[]>;
      forEachFromIndex(startIndex: number, loop?: boolean, ...args: any[]): SugarDefaultChainable<T>;
      forEachFromIndex(startIndex: number, ...args: any[]): SugarDefaultChainable<T>;
      from(index: number): SugarDefaultChainable<T[]>;
      groupBy<U>(map: string|mapFn<T, U>, groupFn?: (arr: T[], key: string, obj: Object) => SugarDefaultChainable<void>): SugarDefaultChainable<Object>;
      inGroups(num: number, padding?: any): SugarDefaultChainable<T[]>;
      inGroupsOf(num: number, padding?: any): SugarDefaultChainable<T[]>;
      insert(item: T|T[], index?: number): SugarDefaultChainable<T[]>;
      intersect(arr: T[]): SugarDefaultChainable<T[]>;
      isEmpty(): SugarDefaultChainable<boolean>;
      isEqual(arr: T[]): SugarDefaultChainable<boolean>;
      last(num?: number): SugarDefaultChainable<T>;
      least<U>(all?: boolean, map?: string|mapFn<T, U>): SugarDefaultChainable<T[]>;
      least<U>(map?: string|mapFn<T, U>): SugarDefaultChainable<T[]>;
      map<U>(map: string|mapFn<T, U>, context?: any): SugarDefaultChainable<U[]>;
      mapFromIndex(startIndex: number, loop?: boolean, ...args: any[]): SugarDefaultChainable<T>;
      mapFromIndex(startIndex: number, ...args: any[]): SugarDefaultChainable<T>;
      max<U>(all?: boolean, map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      max<U>(map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      median<U>(map?: string|mapFn<T, U>): SugarDefaultChainable<number>;
      min<U>(all?: boolean, map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      min<U>(map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      most<U>(all?: boolean, map?: string|mapFn<T, U>): SugarDefaultChainable<T[]>;
      most<U>(map?: string|mapFn<T, U>): SugarDefaultChainable<T[]>;
      none(search: T|searchFn<T>, context?: any): SugarDefaultChainable<boolean>;
      reduceFromIndex(startIndex: number, loop?: boolean, ...args: any[]): SugarDefaultChainable<T>;
      reduceFromIndex(startIndex: number, ...args: any[]): SugarDefaultChainable<T>;
      reduceRightFromIndex(startIndex: number, loop?: boolean, ...args: any[]): SugarDefaultChainable<T>;
      reduceRightFromIndex(startIndex: number, ...args: any[]): SugarDefaultChainable<T>;
      remove(search: T|searchFn<T>): SugarDefaultChainable<T[]>;
      removeAt(start: number, end?: number): SugarDefaultChainable<T[]>;
      sample(num?: number, remove?: boolean): SugarDefaultChainable<T>;
      shuffle(): SugarDefaultChainable<T[]>;
      some(search: T|searchFn<T>, context?: any): SugarDefaultChainable<boolean>;
      someFromIndex(startIndex: number, loop?: boolean, ...args: any[]): SugarDefaultChainable<T>;
      someFromIndex(startIndex: number, ...args: any[]): SugarDefaultChainable<T>;
      sortBy<U>(map?: string|sortMapFn<T, U>, desc?: boolean): SugarDefaultChainable<T[]>;
      subtract(item: T|T[]): SugarDefaultChainable<T[]>;
      sum<U>(map?: string|mapFn<T, U>): SugarDefaultChainable<number>;
      to(index: number): SugarDefaultChainable<T[]>;
      union(arr: T[]): SugarDefaultChainable<T[]>;
      unique<U>(map?: string|mapFn<T, U>): SugarDefaultChainable<T[]>;
      zip(...args: any[]): SugarDefaultChainable<T[]>;
      concat(...items: (T | T[])[]): SugarDefaultChainable<T[]>;
      concat(...items: T[][]): SugarDefaultChainable<T[]>;
      copyWithin(target: number, start: number, end?: number): SugarDefaultChainable<this>;
      every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): SugarDefaultChainable<boolean>;
      fill(value: T, start?: number, end?: number): SugarDefaultChainable<this>;
      filter(callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): SugarDefaultChainable<T[]>;
      find(predicate: (value: T, index: number, obj: Array<T>) => boolean, thisArg?: any): SugarDefaultChainable<T | undefined>;
      findIndex(predicate: (value: T, index: number, obj: Array<T>) => boolean, thisArg?: any): SugarDefaultChainable<number>;
      forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): SugarDefaultChainable<void>;
      indexOf(searchElement: T, fromIndex?: number): SugarDefaultChainable<number>;
      join(separator?: string): SugarDefaultChainable<string>;
      lastIndexOf(searchElement: T, fromIndex?: number): SugarDefaultChainable<number>;
      map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): SugarDefaultChainable<U[]>;
      pop(): SugarDefaultChainable<T | undefined>;
      push(...items: T[]): SugarDefaultChainable<number>;
      reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): SugarDefaultChainable<T>;
      reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): SugarDefaultChainable<U>;
      reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): SugarDefaultChainable<T>;
      reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): SugarDefaultChainable<U>;
      reverse(): SugarDefaultChainable<T[]>;
      shift(): SugarDefaultChainable<T | undefined>;
      slice(start?: number, end?: number): SugarDefaultChainable<T[]>;
      some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): SugarDefaultChainable<boolean>;
      sort(compareFn?: (a: T, b: T) => number): SugarDefaultChainable<this>;
      splice(start: number): SugarDefaultChainable<T[]>;
      splice(start: number, deleteCount: number, ...items: T[]): SugarDefaultChainable<T[]>;
      toLocaleString(): SugarDefaultChainable<string>;
      unshift(...items: T[]): SugarDefaultChainable<number>;
    }

  }

  namespace Date {

    type Chainable<RawValue> = ChainableBase<RawValue> & Object.ChainableBase<RawValue>;

    interface DateOptions {
      newDateInternal: Function;
    }

    interface DateCreateOptions {
      locale?: string;
      past?: boolean;
      future?: boolean;
      fromUTC?: boolean;
      setUTC?: boolean;
      clone?: boolean;
      params?: Object;
    }

    interface Constructor extends SugarNamespace {
      (d?: string|number|Date, options?: DateCreateOptions): Chainable<Date>;
      new(d?: string|number|Date, options?: DateCreateOptions): Chainable<Date>;
      addLocale(localeCode: string, def: Object): Locale;
      create(d?: string|number|Date, options?: DateCreateOptions): Date;
      getAllLocaleCodes(): string[];
      getAllLocales(): Array<Locale>;
      getLocale(localeCode?: string): Locale;
      range(start?: string|Date, end?: string|Date): Range;
      removeLocale(localeCode: string): Locale;
      setLocale(localeCode: string): Locale;
      addDays(instance: Date, n: number, reset?: boolean): Date;
      addHours(instance: Date, n: number, reset?: boolean): Date;
      addMilliseconds(instance: Date, n: number, reset?: boolean): Date;
      addMinutes(instance: Date, n: number, reset?: boolean): Date;
      addMonths(instance: Date, n: number, reset?: boolean): Date;
      addSeconds(instance: Date, n: number, reset?: boolean): Date;
      addWeeks(instance: Date, n: number, reset?: boolean): Date;
      addYears(instance: Date, n: number, reset?: boolean): Date;
      advance(instance: Date, set: string|Object, reset?: boolean): Date;
      advance(instance: Date, milliseconds: number): Date;
      advance(instance: Date, year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, millliseconds?: undefined): Date;
      beginningOfDay(instance: Date, localeCode?: string): Date;
      beginningOfISOWeek(instance: Date): Date;
      beginningOfMonth(instance: Date, localeCode?: string): Date;
      beginningOfWeek(instance: Date, localeCode?: string): Date;
      beginningOfYear(instance: Date, localeCode?: string): Date;
      clone(instance: Date): Date;
      daysAgo(instance: Date): number;
      daysFromNow(instance: Date): number;
      daysInMonth(instance: Date): number;
      daysSince(instance: Date, d: string|number|Date, options?: DateCreateOptions): number;
      daysUntil(instance: Date, d?: string|number|Date, options?: DateCreateOptions): number;
      endOfDay(instance: Date, localeCode?: string): Date;
      endOfISOWeek(instance: Date): Date;
      endOfMonth(instance: Date, localeCode?: string): Date;
      endOfWeek(instance: Date, localeCode?: string): Date;
      endOfYear(instance: Date, localeCode?: string): Date;
      format(instance: Date, f?: string, localeCode?: string): string;
      full(instance: Date, localeCode?: string): string;
      get(instance: Date, d: string|number|Date, options?: DateCreateOptions): Date;
      getISOWeek(instance: Date): number;
      getUTCOffset(instance: Date, iso?: boolean): string;
      getUTCWeekday(instance: Date): number;
      getWeekday(instance: Date): number;
      hoursAgo(instance: Date): number;
      hoursFromNow(instance: Date): number;
      hoursSince(instance: Date, d: string|number|Date, options?: DateCreateOptions): number;
      hoursUntil(instance: Date, d?: string|number|Date, options?: DateCreateOptions): number;
      is(instance: Date, d: string|number|Date, margin?: number): boolean;
      isAfter(instance: Date, d: string|number|Date, margin?: number): boolean;
      isBefore(instance: Date, d: string|number|Date, margin?: number): boolean;
      isBetween(instance: Date, d1: string|number|Date, d2: string|number|Date, margin?: number): boolean;
      isFriday(instance: Date): boolean;
      isFuture(instance: Date): boolean;
      isLastMonth(instance: Date, localeCode?: string): boolean;
      isLastWeek(instance: Date, localeCode?: string): boolean;
      isLastYear(instance: Date, localeCode?: string): boolean;
      isLeapYear(instance: Date): boolean;
      isMonday(instance: Date): boolean;
      isNextMonth(instance: Date, localeCode?: string): boolean;
      isNextWeek(instance: Date, localeCode?: string): boolean;
      isNextYear(instance: Date, localeCode?: string): boolean;
      isPast(instance: Date): boolean;
      isSaturday(instance: Date): boolean;
      isSunday(instance: Date): boolean;
      isThisMonth(instance: Date, localeCode?: string): boolean;
      isThisWeek(instance: Date, localeCode?: string): boolean;
      isThisYear(instance: Date, localeCode?: string): boolean;
      isThursday(instance: Date): boolean;
      isToday(instance: Date): boolean;
      isTomorrow(instance: Date): boolean;
      isTuesday(instance: Date): boolean;
      isUTC(instance: Date): boolean;
      isValid(instance: Date): boolean;
      isWednesday(instance: Date): boolean;
      isWeekday(instance: Date): boolean;
      isWeekend(instance: Date): boolean;
      isYesterday(instance: Date): boolean;
      iso(instance: Date): string;
      long(instance: Date, localeCode?: string): string;
      medium(instance: Date, localeCode?: string): string;
      millisecondsAgo(instance: Date): number;
      millisecondsFromNow(instance: Date): number;
      millisecondsSince(instance: Date, d: string|number|Date, options?: DateCreateOptions): number;
      millisecondsUntil(instance: Date, d?: string|number|Date, options?: DateCreateOptions): number;
      minutesAgo(instance: Date): number;
      minutesFromNow(instance: Date): number;
      minutesSince(instance: Date, d: string|number|Date, options?: DateCreateOptions): number;
      minutesUntil(instance: Date, d?: string|number|Date, options?: DateCreateOptions): number;
      monthsAgo(instance: Date): number;
      monthsFromNow(instance: Date): number;
      monthsSince(instance: Date, d: string|number|Date, options?: DateCreateOptions): number;
      monthsUntil(instance: Date, d?: string|number|Date, options?: DateCreateOptions): number;
      relative(instance: Date, localeCode?: string, relativeFn?: (num: number, unit: number, ms: number, loc: Locale) => string): string;
      relative(instance: Date, relativeFn?: (num: number, unit: number, ms: number, loc: Locale) => string): string;
      relativeTo(instance: Date, d: string|number|Date, localeCode?: string): string;
      reset(instance: Date, unit?: string, localeCode?: string): Date;
      rewind(instance: Date, set: string|Object, reset?: boolean): Date;
      rewind(instance: Date, milliseconds: number): Date;
      rewind(instance: Date, year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, millliseconds?: undefined): Date;
      secondsAgo(instance: Date): number;
      secondsFromNow(instance: Date): number;
      secondsSince(instance: Date, d: string|number|Date, options?: DateCreateOptions): number;
      secondsUntil(instance: Date, d?: string|number|Date, options?: DateCreateOptions): number;
      set(instance: Date, set: Object, reset?: boolean): Date;
      set(instance: Date, milliseconds: number): Date;
      set(instance: Date, year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, millliseconds?: undefined): Date;
      setISOWeek(instance: Date, num: number): void;
      setUTC(instance: Date, on?: boolean): Date;
      setWeekday(instance: Date, dow: number): void;
      short(instance: Date, localeCode?: string): string;
      weeksAgo(instance: Date): number;
      weeksFromNow(instance: Date): number;
      weeksSince(instance: Date, d: string|number|Date, options?: DateCreateOptions): number;
      weeksUntil(instance: Date, d?: string|number|Date, options?: DateCreateOptions): number;
      yearsAgo(instance: Date): number;
      yearsFromNow(instance: Date): number;
      yearsSince(instance: Date, d: string|number|Date, options?: DateCreateOptions): number;
      yearsUntil(instance: Date, d?: string|number|Date, options?: DateCreateOptions): number;
      getOption<T>(name: string): T;
      setOption(name: string, value: any): void;
      setOption(options: DateOptions): void;
    }

    interface ChainableBase<RawValue> {
      raw: RawValue;
      valueOf: () => RawValue;
      toString: () => string;
      addDays(n: number, reset?: boolean): SugarDefaultChainable<Date>;
      addHours(n: number, reset?: boolean): SugarDefaultChainable<Date>;
      addMilliseconds(n: number, reset?: boolean): SugarDefaultChainable<Date>;
      addMinutes(n: number, reset?: boolean): SugarDefaultChainable<Date>;
      addMonths(n: number, reset?: boolean): SugarDefaultChainable<Date>;
      addSeconds(n: number, reset?: boolean): SugarDefaultChainable<Date>;
      addWeeks(n: number, reset?: boolean): SugarDefaultChainable<Date>;
      addYears(n: number, reset?: boolean): SugarDefaultChainable<Date>;
      advance(set: string|Object, reset?: boolean): SugarDefaultChainable<Date>;
      advance(milliseconds: number): SugarDefaultChainable<Date>;
      advance(year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, millliseconds?: undefined): SugarDefaultChainable<Date>;
      beginningOfDay(localeCode?: string): SugarDefaultChainable<Date>;
      beginningOfISOWeek(): SugarDefaultChainable<Date>;
      beginningOfMonth(localeCode?: string): SugarDefaultChainable<Date>;
      beginningOfWeek(localeCode?: string): SugarDefaultChainable<Date>;
      beginningOfYear(localeCode?: string): SugarDefaultChainable<Date>;
      clone(): SugarDefaultChainable<Date>;
      daysAgo(): SugarDefaultChainable<number>;
      daysFromNow(): SugarDefaultChainable<number>;
      daysInMonth(): SugarDefaultChainable<number>;
      daysSince(d: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      daysUntil(d?: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      endOfDay(localeCode?: string): SugarDefaultChainable<Date>;
      endOfISOWeek(): SugarDefaultChainable<Date>;
      endOfMonth(localeCode?: string): SugarDefaultChainable<Date>;
      endOfWeek(localeCode?: string): SugarDefaultChainable<Date>;
      endOfYear(localeCode?: string): SugarDefaultChainable<Date>;
      format(f?: string, localeCode?: string): SugarDefaultChainable<string>;
      full(localeCode?: string): SugarDefaultChainable<string>;
      get(d: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<Date>;
      getISOWeek(): SugarDefaultChainable<number>;
      getUTCOffset(iso?: boolean): SugarDefaultChainable<string>;
      getUTCWeekday(): SugarDefaultChainable<number>;
      getWeekday(): SugarDefaultChainable<number>;
      hoursAgo(): SugarDefaultChainable<number>;
      hoursFromNow(): SugarDefaultChainable<number>;
      hoursSince(d: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      hoursUntil(d?: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      is(d: string|number|Date, margin?: number): SugarDefaultChainable<boolean>;
      isAfter(d: string|number|Date, margin?: number): SugarDefaultChainable<boolean>;
      isBefore(d: string|number|Date, margin?: number): SugarDefaultChainable<boolean>;
      isBetween(d1: string|number|Date, d2: string|number|Date, margin?: number): SugarDefaultChainable<boolean>;
      isFriday(): SugarDefaultChainable<boolean>;
      isFuture(): SugarDefaultChainable<boolean>;
      isLastMonth(localeCode?: string): SugarDefaultChainable<boolean>;
      isLastWeek(localeCode?: string): SugarDefaultChainable<boolean>;
      isLastYear(localeCode?: string): SugarDefaultChainable<boolean>;
      isLeapYear(): SugarDefaultChainable<boolean>;
      isMonday(): SugarDefaultChainable<boolean>;
      isNextMonth(localeCode?: string): SugarDefaultChainable<boolean>;
      isNextWeek(localeCode?: string): SugarDefaultChainable<boolean>;
      isNextYear(localeCode?: string): SugarDefaultChainable<boolean>;
      isPast(): SugarDefaultChainable<boolean>;
      isSaturday(): SugarDefaultChainable<boolean>;
      isSunday(): SugarDefaultChainable<boolean>;
      isThisMonth(localeCode?: string): SugarDefaultChainable<boolean>;
      isThisWeek(localeCode?: string): SugarDefaultChainable<boolean>;
      isThisYear(localeCode?: string): SugarDefaultChainable<boolean>;
      isThursday(): SugarDefaultChainable<boolean>;
      isToday(): SugarDefaultChainable<boolean>;
      isTomorrow(): SugarDefaultChainable<boolean>;
      isTuesday(): SugarDefaultChainable<boolean>;
      isUTC(): SugarDefaultChainable<boolean>;
      isValid(): SugarDefaultChainable<boolean>;
      isWednesday(): SugarDefaultChainable<boolean>;
      isWeekday(): SugarDefaultChainable<boolean>;
      isWeekend(): SugarDefaultChainable<boolean>;
      isYesterday(): SugarDefaultChainable<boolean>;
      iso(): SugarDefaultChainable<string>;
      long(localeCode?: string): SugarDefaultChainable<string>;
      medium(localeCode?: string): SugarDefaultChainable<string>;
      millisecondsAgo(): SugarDefaultChainable<number>;
      millisecondsFromNow(): SugarDefaultChainable<number>;
      millisecondsSince(d: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      millisecondsUntil(d?: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      minutesAgo(): SugarDefaultChainable<number>;
      minutesFromNow(): SugarDefaultChainable<number>;
      minutesSince(d: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      minutesUntil(d?: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      monthsAgo(): SugarDefaultChainable<number>;
      monthsFromNow(): SugarDefaultChainable<number>;
      monthsSince(d: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      monthsUntil(d?: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      relative(localeCode?: string, relativeFn?: (num: number, unit: number, ms: number, loc: Locale) => SugarDefaultChainable<string>): SugarDefaultChainable<string>;
      relative(relativeFn?: (num: number, unit: number, ms: number, loc: Locale) => SugarDefaultChainable<string>): SugarDefaultChainable<string>;
      relativeTo(d: string|number|Date, localeCode?: string): SugarDefaultChainable<string>;
      reset(unit?: string, localeCode?: string): SugarDefaultChainable<Date>;
      rewind(set: string|Object, reset?: boolean): SugarDefaultChainable<Date>;
      rewind(milliseconds: number): SugarDefaultChainable<Date>;
      rewind(year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, millliseconds?: undefined): SugarDefaultChainable<Date>;
      secondsAgo(): SugarDefaultChainable<number>;
      secondsFromNow(): SugarDefaultChainable<number>;
      secondsSince(d: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      secondsUntil(d?: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      set(set: Object, reset?: boolean): SugarDefaultChainable<Date>;
      set(milliseconds: number): SugarDefaultChainable<Date>;
      set(year: number, month: number, day?: number, hour?: number, minute?: number, second?: number, millliseconds?: undefined): SugarDefaultChainable<Date>;
      setISOWeek(num: number): SugarDefaultChainable<void>;
      setUTC(on?: boolean): SugarDefaultChainable<Date>;
      setWeekday(dow: number): SugarDefaultChainable<void>;
      short(localeCode?: string): SugarDefaultChainable<string>;
      weeksAgo(): SugarDefaultChainable<number>;
      weeksFromNow(): SugarDefaultChainable<number>;
      weeksSince(d: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      weeksUntil(d?: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      yearsAgo(): SugarDefaultChainable<number>;
      yearsFromNow(): SugarDefaultChainable<number>;
      yearsSince(d: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      yearsUntil(d?: string|number|Date, options?: DateCreateOptions): SugarDefaultChainable<number>;
      getDate(): SugarDefaultChainable<number>;
      getDay(): SugarDefaultChainable<number>;
      getFullYear(): SugarDefaultChainable<number>;
      getHours(): SugarDefaultChainable<number>;
      getMilliseconds(): SugarDefaultChainable<number>;
      getMinutes(): SugarDefaultChainable<number>;
      getMonth(): SugarDefaultChainable<number>;
      getSeconds(): SugarDefaultChainable<number>;
      getTime(): SugarDefaultChainable<number>;
      getTimezoneOffset(): SugarDefaultChainable<number>;
      getUTCDate(): SugarDefaultChainable<number>;
      getUTCDay(): SugarDefaultChainable<number>;
      getUTCFullYear(): SugarDefaultChainable<number>;
      getUTCHours(): SugarDefaultChainable<number>;
      getUTCMilliseconds(): SugarDefaultChainable<number>;
      getUTCMinutes(): SugarDefaultChainable<number>;
      getUTCMonth(): SugarDefaultChainable<number>;
      getUTCSeconds(): SugarDefaultChainable<number>;
      setDate(date: number): SugarDefaultChainable<number>;
      setFullYear(year: number, month?: number, date?: number): SugarDefaultChainable<number>;
      setHours(hours: number, min?: number, sec?: number, ms?: number): SugarDefaultChainable<number>;
      setMilliseconds(ms: number): SugarDefaultChainable<number>;
      setMinutes(min: number, sec?: number, ms?: number): SugarDefaultChainable<number>;
      setMonth(month: number, date?: number): SugarDefaultChainable<number>;
      setSeconds(sec: number, ms?: number): SugarDefaultChainable<number>;
      setTime(time: number): SugarDefaultChainable<number>;
      setUTCDate(date: number): SugarDefaultChainable<number>;
      setUTCFullYear(year: number, month?: number, date?: number): SugarDefaultChainable<number>;
      setUTCHours(hours: number, min?: number, sec?: number, ms?: number): SugarDefaultChainable<number>;
      setUTCMilliseconds(ms: number): SugarDefaultChainable<number>;
      setUTCMinutes(min: number, sec?: number, ms?: number): SugarDefaultChainable<number>;
      setUTCMonth(month: number, date?: number): SugarDefaultChainable<number>;
      setUTCSeconds(sec: number, ms?: number): SugarDefaultChainable<number>;
      toDateString(): SugarDefaultChainable<string>;
      toISOString(): SugarDefaultChainable<string>;
      toJSON(key?: any): SugarDefaultChainable<string>;
      toLocaleDateString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): SugarDefaultChainable<string>;
      toLocaleDateString(): SugarDefaultChainable<string>;
      toLocaleString(): SugarDefaultChainable<string>;
      toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): SugarDefaultChainable<string>;
      toLocaleTimeString(): SugarDefaultChainable<string>;
      toLocaleTimeString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): SugarDefaultChainable<string>;
      toTimeString(): SugarDefaultChainable<string>;
      toUTCString(): SugarDefaultChainable<string>;
    }

  }

  namespace Function {

    type Chainable<RawValue> = ChainableBase<RawValue> & Object.ChainableBase<RawValue>;

    interface Constructor extends SugarNamespace {
      (raw?: Function): Chainable<Function>;
      new(raw?: Function): Chainable<Function>;
      after(instance: Function, n: number): Function;
      cancel(instance: Function): Function;
      debounce(instance: Function, ms?: number): Function;
      delay(instance: Function, ms?: number, ...args: any[]): Function;
      every(instance: Function, ms?: number, ...args: any[]): Function;
      lazy(instance: Function, ms?: number, immediate?: boolean, limit?: number): Function;
      lock(instance: Function, n?: number): Function;
      memoize(instance: Function, hashFn?: string|Function, limit?: number): Function;
      once(instance: Function): Function;
      partial(instance: Function, ...args: any[]): Function;
      throttle(instance: Function, ms?: number): Function;
    }

    interface ChainableBase<RawValue> {
      raw: RawValue;
      valueOf: () => RawValue;
      toString: () => string;
      after(n: number): SugarDefaultChainable<Function>;
      cancel(): SugarDefaultChainable<Function>;
      debounce(ms?: number): SugarDefaultChainable<Function>;
      delay(ms?: number, ...args: any[]): SugarDefaultChainable<Function>;
      every(ms?: number, ...args: any[]): SugarDefaultChainable<Function>;
      lazy(ms?: number, immediate?: boolean, limit?: number): SugarDefaultChainable<Function>;
      lock(n?: number): SugarDefaultChainable<Function>;
      memoize(hashFn?: string|Function, limit?: number): SugarDefaultChainable<Function>;
      once(): SugarDefaultChainable<Function>;
      partial(...args: any[]): SugarDefaultChainable<Function>;
      throttle(ms?: number): SugarDefaultChainable<Function>;
      apply(thisArg: any, argArray?: any): SugarDefaultChainable<any>;
      bind(thisArg: any, ...argArray: any[]): SugarDefaultChainable<any>;
      call(thisArg: any, ...argArray: any[]): SugarDefaultChainable<any>;
    }

  }

  namespace Number {

    type Chainable<RawValue> = ChainableBase<RawValue> & Object.ChainableBase<RawValue>;

    interface NumberOptions {
      decimal: string;
      thousands: string;
    }

    interface Constructor extends SugarNamespace {
      (raw?: number): Chainable<number>;
      new(raw?: number): Chainable<number>;
      random(n1?: number, n2?: number): number;
      range(start?: number, end?: number): Range;
      abbr(instance: number, precision?: number): string;
      abs(instance: number): number;
      acos(instance: number): number;
      asin(instance: number): number;
      atan(instance: number): number;
      bytes(instance: number, precision?: number, binary?: boolean, units?: string): string;
      cap(instance: number, max?: number): number;
      ceil(instance: number, precision?: number): number;
      chr(instance: number): string;
      clamp(instance: number, start?: number, end?: number): number;
      cos(instance: number): number;
      day(instance: number): number;
      dayAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      dayAgo(instance: number): Date;
      dayBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      dayFromNow(instance: number): Date;
      days(instance: number): number;
      daysAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      daysAgo(instance: number): Date;
      daysBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      daysFromNow(instance: number): Date;
      downto<T>(instance: number, num: number, step?: number, everyFn?: (el: T, i: number, r: Range) => void): T[];
      downto<T>(instance: number, num: number, everyFn?: (el: T, i: number, r: Range) => void): T[];
      duration(instance: number, localeCode?: string): string;
      exp(instance: number): number;
      floor(instance: number, precision?: number): number;
      format(instance: number, place?: number): string;
      hex(instance: number, pad?: number): string;
      hour(instance: number): number;
      hourAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      hourAgo(instance: number): Date;
      hourBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      hourFromNow(instance: number): Date;
      hours(instance: number): number;
      hoursAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      hoursAgo(instance: number): Date;
      hoursBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      hoursFromNow(instance: number): Date;
      isEven(instance: number): boolean;
      isInteger(instance: number): boolean;
      isMultipleOf(instance: number, num: number): boolean;
      isOdd(instance: number): boolean;
      log(instance: number, base?: number): number;
      metric(instance: number, precision?: number, units?: string): string;
      millisecond(instance: number): number;
      millisecondAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      millisecondAgo(instance: number): Date;
      millisecondBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      millisecondFromNow(instance: number): Date;
      milliseconds(instance: number): number;
      millisecondsAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      millisecondsAgo(instance: number): Date;
      millisecondsBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      millisecondsFromNow(instance: number): Date;
      minute(instance: number): number;
      minuteAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      minuteAgo(instance: number): Date;
      minuteBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      minuteFromNow(instance: number): Date;
      minutes(instance: number): number;
      minutesAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      minutesAgo(instance: number): Date;
      minutesBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      minutesFromNow(instance: number): Date;
      month(instance: number): number;
      monthAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      monthAgo(instance: number): Date;
      monthBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      monthFromNow(instance: number): Date;
      months(instance: number): number;
      monthsAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      monthsAgo(instance: number): Date;
      monthsBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      monthsFromNow(instance: number): Date;
      ordinalize(instance: number): string;
      pad(instance: number, place?: number, sign?: boolean, base?: number): string;
      pow(instance: number): number;
      round(instance: number, precision?: number): number;
      second(instance: number): number;
      secondAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      secondAgo(instance: number): Date;
      secondBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      secondFromNow(instance: number): Date;
      seconds(instance: number): number;
      secondsAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      secondsAgo(instance: number): Date;
      secondsBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      secondsFromNow(instance: number): Date;
      sin(instance: number): number;
      sqrt(instance: number): number;
      tan(instance: number): number;
      times<T>(instance: number, indexMapFn: (i: number) => any): T;
      toNumber(instance: number): number;
      upto<T>(instance: number, num: number, step?: number, everyFn?: (el: T, i: number, r: Range) => void): T[];
      upto<T>(instance: number, num: number, everyFn?: (el: T, i: number, r: Range) => void): T[];
      week(instance: number): number;
      weekAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      weekAgo(instance: number): Date;
      weekBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      weekFromNow(instance: number): Date;
      weeks(instance: number): number;
      weeksAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      weeksAgo(instance: number): Date;
      weeksBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      weeksFromNow(instance: number): Date;
      year(instance: number): number;
      yearAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      yearAgo(instance: number): Date;
      yearBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      yearFromNow(instance: number): Date;
      years(instance: number): number;
      yearsAfter(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      yearsAgo(instance: number): Date;
      yearsBefore(instance: number, d: string|number|Date, options?: Date.DateCreateOptions): Date;
      yearsFromNow(instance: number): Date;
      getOption<T>(name: string): T;
      setOption(name: string, value: any): void;
      setOption(options: NumberOptions): void;
    }

    interface ChainableBase<RawValue> {
      raw: RawValue;
      valueOf: () => RawValue;
      toString: () => string;
      abbr(precision?: number): SugarDefaultChainable<string>;
      abs(): SugarDefaultChainable<number>;
      acos(): SugarDefaultChainable<number>;
      asin(): SugarDefaultChainable<number>;
      atan(): SugarDefaultChainable<number>;
      bytes(precision?: number, binary?: boolean, units?: string): SugarDefaultChainable<string>;
      cap(max?: number): SugarDefaultChainable<number>;
      ceil(precision?: number): SugarDefaultChainable<number>;
      chr(): SugarDefaultChainable<string>;
      clamp(start?: number, end?: number): SugarDefaultChainable<number>;
      cos(): SugarDefaultChainable<number>;
      day(): SugarDefaultChainable<number>;
      dayAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      dayAgo(): SugarDefaultChainable<Date>;
      dayBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      dayFromNow(): SugarDefaultChainable<Date>;
      days(): SugarDefaultChainable<number>;
      daysAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      daysAgo(): SugarDefaultChainable<Date>;
      daysBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      daysFromNow(): SugarDefaultChainable<Date>;
      downto<T>(num: number, step?: number, everyFn?: (el: T, i: number, r: Range) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      downto<T>(num: number, everyFn?: (el: T, i: number, r: Range) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      duration(localeCode?: string): SugarDefaultChainable<string>;
      exp(): SugarDefaultChainable<number>;
      floor(precision?: number): SugarDefaultChainable<number>;
      format(place?: number): SugarDefaultChainable<string>;
      hex(pad?: number): SugarDefaultChainable<string>;
      hour(): SugarDefaultChainable<number>;
      hourAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      hourAgo(): SugarDefaultChainable<Date>;
      hourBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      hourFromNow(): SugarDefaultChainable<Date>;
      hours(): SugarDefaultChainable<number>;
      hoursAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      hoursAgo(): SugarDefaultChainable<Date>;
      hoursBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      hoursFromNow(): SugarDefaultChainable<Date>;
      isEven(): SugarDefaultChainable<boolean>;
      isInteger(): SugarDefaultChainable<boolean>;
      isMultipleOf(num: number): SugarDefaultChainable<boolean>;
      isOdd(): SugarDefaultChainable<boolean>;
      log(base?: number): SugarDefaultChainable<number>;
      metric(precision?: number, units?: string): SugarDefaultChainable<string>;
      millisecond(): SugarDefaultChainable<number>;
      millisecondAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      millisecondAgo(): SugarDefaultChainable<Date>;
      millisecondBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      millisecondFromNow(): SugarDefaultChainable<Date>;
      milliseconds(): SugarDefaultChainable<number>;
      millisecondsAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      millisecondsAgo(): SugarDefaultChainable<Date>;
      millisecondsBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      millisecondsFromNow(): SugarDefaultChainable<Date>;
      minute(): SugarDefaultChainable<number>;
      minuteAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      minuteAgo(): SugarDefaultChainable<Date>;
      minuteBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      minuteFromNow(): SugarDefaultChainable<Date>;
      minutes(): SugarDefaultChainable<number>;
      minutesAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      minutesAgo(): SugarDefaultChainable<Date>;
      minutesBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      minutesFromNow(): SugarDefaultChainable<Date>;
      month(): SugarDefaultChainable<number>;
      monthAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      monthAgo(): SugarDefaultChainable<Date>;
      monthBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      monthFromNow(): SugarDefaultChainable<Date>;
      months(): SugarDefaultChainable<number>;
      monthsAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      monthsAgo(): SugarDefaultChainable<Date>;
      monthsBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      monthsFromNow(): SugarDefaultChainable<Date>;
      ordinalize(): SugarDefaultChainable<string>;
      pad(place?: number, sign?: boolean, base?: number): SugarDefaultChainable<string>;
      pow(): SugarDefaultChainable<number>;
      round(precision?: number): SugarDefaultChainable<number>;
      second(): SugarDefaultChainable<number>;
      secondAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      secondAgo(): SugarDefaultChainable<Date>;
      secondBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      secondFromNow(): SugarDefaultChainable<Date>;
      seconds(): SugarDefaultChainable<number>;
      secondsAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      secondsAgo(): SugarDefaultChainable<Date>;
      secondsBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      secondsFromNow(): SugarDefaultChainable<Date>;
      sin(): SugarDefaultChainable<number>;
      sqrt(): SugarDefaultChainable<number>;
      tan(): SugarDefaultChainable<number>;
      times<T>(indexMapFn: (i: number) => SugarDefaultChainable<any>): SugarDefaultChainable<T>;
      toNumber(): SugarDefaultChainable<number>;
      upto<T>(num: number, step?: number, everyFn?: (el: T, i: number, r: Range) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      upto<T>(num: number, everyFn?: (el: T, i: number, r: Range) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      week(): SugarDefaultChainable<number>;
      weekAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      weekAgo(): SugarDefaultChainable<Date>;
      weekBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      weekFromNow(): SugarDefaultChainable<Date>;
      weeks(): SugarDefaultChainable<number>;
      weeksAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      weeksAgo(): SugarDefaultChainable<Date>;
      weeksBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      weeksFromNow(): SugarDefaultChainable<Date>;
      year(): SugarDefaultChainable<number>;
      yearAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      yearAgo(): SugarDefaultChainable<Date>;
      yearBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      yearFromNow(): SugarDefaultChainable<Date>;
      years(): SugarDefaultChainable<number>;
      yearsAfter(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      yearsAgo(): SugarDefaultChainable<Date>;
      yearsBefore(d: string|number|Date, options?: Date.DateCreateOptions): SugarDefaultChainable<Date>;
      yearsFromNow(): SugarDefaultChainable<Date>;
      toExponential(fractionDigits?: number): SugarDefaultChainable<string>;
      toFixed(fractionDigits?: number): SugarDefaultChainable<string>;
      toLocaleString(locales?: string | string[], options?: Intl.NumberFormatOptions): SugarDefaultChainable<string>;
      toPrecision(precision?: number): SugarDefaultChainable<string>;
    }

  }

  namespace Object {

    type resolveFn<T> = (key: string, targetVal: T, sourceVal: T, target: Object, source: Object) => boolean;
    type searchFn<T> = (key: string, val: T, obj: Object) => boolean;
    type mapFn<T, U> = (val: T, key: string, obj: Object) => U;
    type Chainable<RawValue> = ChainableBase<RawValue>;

    interface QueryStringParseOptions<T, U> {
      deep?: boolean;
      auto?: boolean;
      transform?: (key: string, val: T, obj: Object) => U;
      separator?: string;
    }

    interface QueryStringOptions<T, U> {
      deep?: boolean;
      prefix?: string;
      transform?: (key: string, val: T, obj: Object) => U;
      separator?: string;
    }

    interface ObjectMergeOptions<T> {
      deep?: boolean;
      hidden?: boolean;
      descriptor?: boolean;
      resolve?: boolean|resolveFn<T>;
    }

    interface Constructor extends SugarNamespace {
      (raw?: Object): Chainable<Object>;
      new(raw?: Object): Chainable<Object>;
      fromQueryString<T, U>(str: string, options?: QueryStringParseOptions<T, U>): Object;
      add<T>(instance: Object, obj: Object, options?: ObjectMergeOptions<T>): Object;
      addAll<T>(instance: Object, sources: Array<Object>, options?: ObjectMergeOptions<T>): Object;
      average<T, U>(instance: Object, map?: string|mapFn<T, U>): number;
      clone(instance: Object, deep?: boolean): Object;
      count<T>(instance: Object, search: T|searchFn<T>): number;
      defaults<T>(instance: Object, sources: Array<Object>, options?: ObjectMergeOptions<T>): Object;
      every<T>(instance: Object, search: T|searchFn<T>): boolean;
      exclude<T>(instance: Object, search: T|searchFn<T>): Object;
      filter<T>(instance: Object, search: T|searchFn<T>): T[];
      find<T>(instance: Object, search: T|searchFn<T>): boolean;
      forEach<T>(instance: Object, eachFn: (val: T, key: string, obj: Object) => void): Object;
      get<T>(instance: Object, key: string, inherited?: boolean): T;
      has(instance: Object, key: string, inherited?: boolean): boolean;
      intersect(instance: Object, obj: Object): Object;
      invert(instance: Object, multi?: boolean): Object;
      isArguments(instance: Object): boolean;
      isArray(instance: any): instance is Array<any>;
      isBoolean(instance: any): instance is boolean;
      isDate(instance: any): instance is Date;
      isEmpty(instance: Object): boolean;
      isEqual(instance: Object, obj: Object): boolean;
      isError(instance: any): instance is Error;
      isFunction(instance: any): instance is Function;
      isMap(instance: any): instance is Map<any, any>;
      isNumber(instance: any): instance is number;
      isObject(instance: Object): boolean;
      isRegExp(instance: any): instance is RegExp;
      isSet(instance: any): instance is Set<any>;
      isString(instance: any): instance is string;
      keys<T>(instance: Object): T[];
      least<T, U>(instance: Object, all?: boolean, map?: string|mapFn<T, U>): T;
      least<T, U>(instance: Object, map?: string|mapFn<T, U>): T;
      map<T, U>(instance: Object, map: string|mapFn<T, U>): Object;
      max<T, U>(instance: Object, all?: boolean, map?: string|mapFn<T, U>): T;
      max<T, U>(instance: Object, map?: string|mapFn<T, U>): T;
      median<T, U>(instance: Object, map?: string|mapFn<T, U>): number;
      merge<T>(instance: Object, source: Object, options?: ObjectMergeOptions<T>): Object;
      mergeAll<T>(instance: Object, sources: Array<Object>, options?: ObjectMergeOptions<T>): Object;
      min<T, U>(instance: Object, all?: boolean, map?: string|mapFn<T, U>): T;
      min<T, U>(instance: Object, map?: string|mapFn<T, U>): T;
      most<T, U>(instance: Object, all?: boolean, map?: string|mapFn<T, U>): T;
      most<T, U>(instance: Object, map?: string|mapFn<T, U>): T;
      none<T>(instance: Object, search: T|searchFn<T>): boolean;
      reduce<T>(instance: Object, reduceFn: (acc: T, val: T, key: string, obj: Object) => void, init?: any): T;
      reject(instance: Object, find: string|RegExp|Array<string>|Object): Object;
      remove<T>(instance: Object, search: T|searchFn<T>): Object;
      select(instance: Object, find: string|RegExp|Array<string>|Object): Object;
      set<T>(instance: Object, key: string, val: T): Object;
      size(instance: Object): number;
      some<T>(instance: Object, search: T|searchFn<T>): boolean;
      subtract(instance: Object, obj: Object): Object;
      sum<T, U>(instance: Object, map?: string|mapFn<T, U>): number;
      tap(instance: Object, tapFn: (obj: Object) => any): Object;
      toQueryString<T, U>(instance: Object, options?: QueryStringOptions<T, U>): Object;
      values<T>(instance: Object): T[];
    }

    interface ChainableBase<RawValue> {
      raw: RawValue;
      valueOf: () => RawValue;
      toString: () => string;
      add<T>(obj: Object, options?: ObjectMergeOptions<T>): SugarDefaultChainable<Object>;
      addAll<T>(sources: Array<Object>, options?: ObjectMergeOptions<T>): SugarDefaultChainable<Object>;
      average<T, U>(map?: string|mapFn<T, U>): SugarDefaultChainable<number>;
      clone(deep?: boolean): SugarDefaultChainable<Object>;
      count<T>(search: T|searchFn<T>): SugarDefaultChainable<number>;
      defaults<T>(sources: Array<Object>, options?: ObjectMergeOptions<T>): SugarDefaultChainable<Object>;
      every<T>(search: T|searchFn<T>): SugarDefaultChainable<boolean>;
      exclude<T>(search: T|searchFn<T>): SugarDefaultChainable<Object>;
      filter<T>(search: T|searchFn<T>): SugarDefaultChainable<T[]>;
      find<T>(search: T|searchFn<T>): SugarDefaultChainable<boolean>;
      forEach<T>(eachFn: (val: T, key: string, obj: Object) => SugarDefaultChainable<void>): SugarDefaultChainable<Object>;
      get<T>(key: string, inherited?: boolean): SugarDefaultChainable<T>;
      has(key: string, inherited?: boolean): SugarDefaultChainable<boolean>;
      intersect(obj: Object): SugarDefaultChainable<Object>;
      invert(multi?: boolean): SugarDefaultChainable<Object>;
      isArguments(): SugarDefaultChainable<boolean>;
      isArray(): SugarDefaultChainable<boolean>;
      isBoolean(): SugarDefaultChainable<boolean>;
      isDate(): SugarDefaultChainable<boolean>;
      isEmpty(): SugarDefaultChainable<boolean>;
      isEqual(obj: Object): SugarDefaultChainable<boolean>;
      isError(): SugarDefaultChainable<boolean>;
      isFunction(): SugarDefaultChainable<boolean>;
      isMap(): SugarDefaultChainable<boolean>;
      isNumber(): SugarDefaultChainable<boolean>;
      isObject(): SugarDefaultChainable<boolean>;
      isRegExp(): SugarDefaultChainable<boolean>;
      isSet(): SugarDefaultChainable<boolean>;
      isString(): SugarDefaultChainable<boolean>;
      keys<T>(): SugarDefaultChainable<T[]>;
      least<T, U>(all?: boolean, map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      least<T, U>(map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      map<T, U>(map: string|mapFn<T, U>): SugarDefaultChainable<Object>;
      max<T, U>(all?: boolean, map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      max<T, U>(map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      median<T, U>(map?: string|mapFn<T, U>): SugarDefaultChainable<number>;
      merge<T>(source: Object, options?: ObjectMergeOptions<T>): SugarDefaultChainable<Object>;
      mergeAll<T>(sources: Array<Object>, options?: ObjectMergeOptions<T>): SugarDefaultChainable<Object>;
      min<T, U>(all?: boolean, map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      min<T, U>(map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      most<T, U>(all?: boolean, map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      most<T, U>(map?: string|mapFn<T, U>): SugarDefaultChainable<T>;
      none<T>(search: T|searchFn<T>): SugarDefaultChainable<boolean>;
      reduce<T>(reduceFn: (acc: T, val: T, key: string, obj: Object) => SugarDefaultChainable<void>, init?: any): SugarDefaultChainable<T>;
      reject(find: string|RegExp|Array<string>|Object): SugarDefaultChainable<Object>;
      remove<T>(search: T|searchFn<T>): SugarDefaultChainable<Object>;
      select(find: string|RegExp|Array<string>|Object): SugarDefaultChainable<Object>;
      set<T>(key: string, val: T): SugarDefaultChainable<Object>;
      size(): SugarDefaultChainable<number>;
      some<T>(search: T|searchFn<T>): SugarDefaultChainable<boolean>;
      subtract(obj: Object): SugarDefaultChainable<Object>;
      sum<T, U>(map?: string|mapFn<T, U>): SugarDefaultChainable<number>;
      tap(tapFn: (obj: Object) => SugarDefaultChainable<any>): SugarDefaultChainable<Object>;
      toQueryString<T, U>(options?: QueryStringOptions<T, U>): SugarDefaultChainable<Object>;
      values<T>(): SugarDefaultChainable<T[]>;
    }

  }

  namespace RegExp {

    type Chainable<RawValue> = ChainableBase<RawValue> & Object.ChainableBase<RawValue>;

    interface Constructor extends SugarNamespace {
      (raw?: RegExp): Chainable<RegExp>;
      new(raw?: RegExp): Chainable<RegExp>;
      escape(str?: string): string;
      addFlags(instance: RegExp, flags: string): RegExp;
      getFlags(instance: RegExp): string;
      removeFlags(instance: RegExp, flags: string): RegExp;
      setFlags(instance: RegExp, flags: string): RegExp;
    }

    interface ChainableBase<RawValue> {
      raw: RawValue;
      valueOf: () => RawValue;
      toString: () => string;
      addFlags(flags: string): SugarDefaultChainable<RegExp>;
      getFlags(): SugarDefaultChainable<string>;
      removeFlags(flags: string): SugarDefaultChainable<RegExp>;
      setFlags(flags: string): SugarDefaultChainable<RegExp>;
      exec(string: string): SugarDefaultChainable<RegExpExecArray | null>;
      test(string: string): SugarDefaultChainable<boolean>;
    }

  }

  namespace String {

    type replaceFn = (tag: string, inner: string, attr: string, outer: string) => string;
    type Chainable<RawValue> = ChainableBase<RawValue> & Object.ChainableBase<RawValue>;

    interface Constructor extends SugarNamespace {
      (raw?: string): Chainable<string>;
      new(raw?: string): Chainable<string>;
      range(start?: string, end?: string): Range;
      at<T>(instance: string, index: number|Array<number>, loop?: boolean): T;
      camelize(instance: string, upper?: boolean): string;
      capitalize(instance: string, lower?: boolean, all?: boolean): string;
      chars<T>(instance: string, eachCharFn?: (char: string, i: number, arr: Array<string>) => void): T[];
      codes<T>(instance: string, eachCodeFn?: (code: number, i: number, str: string) => void): T[];
      compact(instance: string): string;
      dasherize(instance: string): string;
      decodeBase64(instance: string): string;
      encodeBase64(instance: string): string;
      escapeHTML(instance: string): string;
      escapeURL(instance: string, param?: boolean): string;
      first(instance: string, n?: number): string;
      forEach<T>(instance: string, search?: string|RegExp, eachFn?: (match: string, i: number, arr: Array<string>) => void): T[];
      forEach<T>(instance: string, eachFn: (match: string, i: number, arr: Array<string>) => void): T[];
      format(instance: string, ...args: any[]): string;
      from(instance: string, index?: number): string;
      insert(instance: string, str: string, index?: number): string;
      isBlank(instance: string): boolean;
      isEmpty(instance: string): boolean;
      last(instance: string, n?: number): string;
      lines<T>(instance: string, eachLineFn?: (line: string, i: number, arr: Array<string>) => void): T[];
      pad(instance: string, num: number, padding?: string): string;
      padLeft(instance: string, num: number, padding?: string): string;
      padRight(instance: string, num: number, padding?: string): string;
      parameterize(instance: string): string;
      remove(instance: string, f: string|RegExp): string;
      removeAll(instance: string, f: string|RegExp): string;
      removeTags(instance: string, tag?: string, replace?: string|replaceFn): string;
      replaceAll(instance: string, f: string|RegExp, ...args: any[]): string;
      reverse(instance: string): string;
      shift<T>(instance: string, n: number): T[];
      spacify(instance: string): string;
      stripTags(instance: string, tag?: string, replace?: string|replaceFn): string;
      titleize(instance: string): string;
      to(instance: string, index?: number): string;
      toNumber(instance: string, base?: number): number;
      trimLeft(instance: string): string;
      trimRight(instance: string): string;
      truncate(instance: string, length: number, from?: string, ellipsis?: string): string;
      truncateOnWord(instance: string, length: number, from?: string, ellipsis?: string): string;
      underscore(instance: string): string;
      unescapeHTML(instance: string): string;
      unescapeURL(instance: string, partial?: boolean): string;
      words<T>(instance: string, eachWordFn?: (word: string, i: number, arr: Array<string>) => void): T[];
    }

    interface ChainableBase<RawValue> {
      raw: RawValue;
      valueOf: () => RawValue;
      toString: () => string;
      at<T>(index: number|Array<number>, loop?: boolean): SugarDefaultChainable<T>;
      camelize(upper?: boolean): SugarDefaultChainable<string>;
      capitalize(lower?: boolean, all?: boolean): SugarDefaultChainable<string>;
      chars<T>(eachCharFn?: (char: string, i: number, arr: Array<string>) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      codes<T>(eachCodeFn?: (code: number, i: number, str: string) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      compact(): SugarDefaultChainable<string>;
      dasherize(): SugarDefaultChainable<string>;
      decodeBase64(): SugarDefaultChainable<string>;
      encodeBase64(): SugarDefaultChainable<string>;
      escapeHTML(): SugarDefaultChainable<string>;
      escapeURL(param?: boolean): SugarDefaultChainable<string>;
      first(n?: number): SugarDefaultChainable<string>;
      forEach<T>(search?: string|RegExp, eachFn?: (match: string, i: number, arr: Array<string>) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      forEach<T>(eachFn: (match: string, i: number, arr: Array<string>) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      format(...args: any[]): SugarDefaultChainable<string>;
      from(index?: number): SugarDefaultChainable<string>;
      insert(str: string, index?: number): SugarDefaultChainable<string>;
      isBlank(): SugarDefaultChainable<boolean>;
      isEmpty(): SugarDefaultChainable<boolean>;
      last(n?: number): SugarDefaultChainable<string>;
      lines<T>(eachLineFn?: (line: string, i: number, arr: Array<string>) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      pad(num: number, padding?: string): SugarDefaultChainable<string>;
      padLeft(num: number, padding?: string): SugarDefaultChainable<string>;
      padRight(num: number, padding?: string): SugarDefaultChainable<string>;
      parameterize(): SugarDefaultChainable<string>;
      remove(f: string|RegExp): SugarDefaultChainable<string>;
      removeAll(f: string|RegExp): SugarDefaultChainable<string>;
      removeTags(tag?: string, replace?: string|replaceFn): SugarDefaultChainable<string>;
      replaceAll(f: string|RegExp, ...args: any[]): SugarDefaultChainable<string>;
      reverse(): SugarDefaultChainable<string>;
      shift<T>(n: number): SugarDefaultChainable<T[]>;
      spacify(): SugarDefaultChainable<string>;
      stripTags(tag?: string, replace?: string|replaceFn): SugarDefaultChainable<string>;
      titleize(): SugarDefaultChainable<string>;
      to(index?: number): SugarDefaultChainable<string>;
      toNumber(base?: number): SugarDefaultChainable<number>;
      trimLeft(): SugarDefaultChainable<string>;
      trimRight(): SugarDefaultChainable<string>;
      truncate(length: number, from?: string, ellipsis?: string): SugarDefaultChainable<string>;
      truncateOnWord(length: number, from?: string, ellipsis?: string): SugarDefaultChainable<string>;
      underscore(): SugarDefaultChainable<string>;
      unescapeHTML(): SugarDefaultChainable<string>;
      unescapeURL(partial?: boolean): SugarDefaultChainable<string>;
      words<T>(eachWordFn?: (word: string, i: number, arr: Array<string>) => SugarDefaultChainable<void>): SugarDefaultChainable<T[]>;
      anchor(name: string): SugarDefaultChainable<string>;
      big(): SugarDefaultChainable<string>;
      blink(): SugarDefaultChainable<string>;
      bold(): SugarDefaultChainable<string>;
      charAt(pos: number): SugarDefaultChainable<string>;
      charCodeAt(index: number): SugarDefaultChainable<number>;
      codePointAt(pos: number): SugarDefaultChainable<number | undefined>;
      concat(...strings: string[]): SugarDefaultChainable<string>;
      endsWith(searchString: string, endPosition?: number): SugarDefaultChainable<boolean>;
      fixed(): SugarDefaultChainable<string>;
      fontcolor(color: string): SugarDefaultChainable<string>;
      fontsize(size: number): SugarDefaultChainable<string>;
      fontsize(size: string): SugarDefaultChainable<string>;
      includes(searchString: string, position?: number): SugarDefaultChainable<boolean>;
      indexOf(searchString: string, position?: number): SugarDefaultChainable<number>;
      italics(): SugarDefaultChainable<string>;
      lastIndexOf(searchString: string, position?: number): SugarDefaultChainable<number>;
      link(url: string): SugarDefaultChainable<string>;
      localeCompare(that: string): SugarDefaultChainable<number>;
      localeCompare(that: string, locales?: string | string[], options?: Intl.CollatorOptions): SugarDefaultChainable<number>;
      match(regexp: RegExp): SugarDefaultChainable<RegExpMatchArray | null>;
      match(regexp: string): SugarDefaultChainable<RegExpMatchArray | null>;
      normalize(form?: string): SugarDefaultChainable<string>;
      normalize(form: "NFC" | "NFD" | "NFKC" | "NFKD"): SugarDefaultChainable<string>;
      repeat(count: number): SugarDefaultChainable<string>;
      replace(searchValue: string, replaceValue: string): SugarDefaultChainable<string>;
      replace(searchValue: string, replacer: (substring: string, ...args: any[]) => string): SugarDefaultChainable<string>;
      replace(searchValue: RegExp, replaceValue: string): SugarDefaultChainable<string>;
      replace(searchValue: RegExp, replacer: (substring: string, ...args: any[]) => string): SugarDefaultChainable<string>;
      search(regexp: RegExp): SugarDefaultChainable<number>;
      search(regexp: string): SugarDefaultChainable<number>;
      slice(start?: number, end?: number): SugarDefaultChainable<string>;
      small(): SugarDefaultChainable<string>;
      split(separator: string, limit?: number): SugarDefaultChainable<string[]>;
      split(separator: RegExp, limit?: number): SugarDefaultChainable<string[]>;
      startsWith(searchString: string, position?: number): SugarDefaultChainable<boolean>;
      strike(): SugarDefaultChainable<string>;
      sub(): SugarDefaultChainable<string>;
      substr(from: number, length?: number): SugarDefaultChainable<string>;
      substring(start: number, end?: number): SugarDefaultChainable<string>;
      sup(): SugarDefaultChainable<string>;
      toLocaleLowerCase(): SugarDefaultChainable<string>;
      toLocaleUpperCase(): SugarDefaultChainable<string>;
      toLowerCase(): SugarDefaultChainable<string>;
      toUpperCase(): SugarDefaultChainable<string>;
      trim(): SugarDefaultChainable<string>;
    }

  }

}

declare module "sugar" {
  const Sugar: sugarjs.Sugar;
  export = Sugar;
}

declare var Sugar: sugarjs.Sugar;