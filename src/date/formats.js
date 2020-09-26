import { defineStatic } from '../core/date';

const DATE = {
  year: 'numeric',
  day: 'numeric',
};

const TIME = {
  hour: 'numeric',
  minute: 'numeric',
};

const SECONDS = {
  second: 'numeric',
};

const HOUR_24 = {
  hourCycle: 'h23',
};

const ZONE_LONG = {
  timeZoneName: 'long',
};

const ZONE_SHORT = {
  timeZoneName: 'short',
};

/**
 * Full date format, ie. "Wednesday, January 1, 2020".
 **/
export const DATE_FULL = {
  ...DATE,
  month: 'long',
  weekday: 'long',
};

/**
 * Long date format, ie. "January 1, 2020".
 **/
export const DATE_LONG = {
  ...DATE,
  month: 'long',
};

/**
 * Medium date format, ie. "Jan 1, 2020".
 **/
export const DATE_MEDIUM = {
  ...DATE,
  month: 'short',
};

/**
 * Short date format, ie. "1/1/2020".
 **/
export const DATE_SHORT = {
  ...DATE,
  month: 'numeric',
};

/**
 * Full time format, ie. "12:00:00 AM Eastern Standard Time".
 **/
export const TIME_FULL = {
  ...TIME,
  ...SECONDS,
  ...ZONE_LONG,
};

/**
 * Long time format, ie. "12:00:00 AM EST".
 **/
export const TIME_LONG = {
  ...TIME,
  ...SECONDS,
  ...ZONE_SHORT,
};

/**
 * Medium time format, ie. "12:00:00 AM".
 **/
export const TIME_MEDIUM = {
  ...TIME,
  ...SECONDS,
};

/**
 * Short time format, ie. "12:00 AM".
 **/
export const TIME_SHORT = {
  ...TIME,
};

/**
 * Full time format, 24-hours, ie. "13:00:00 Eastern Standard Time".
 **/
export const TIME_24_FULL = {
  ...TIME_FULL,
  ...HOUR_24,
};

/**
 * Long time format, 24-hours, ie. "13:00:00 EST".
 **/
export const TIME_24_LONG = {
  ...TIME_LONG,
  ...HOUR_24,
};

/**
 * Medium time format, 24-hours, ie. "13:00:00".
 **/
export const TIME_24_MEDIUM = {
  ...TIME_MEDIUM,
  ...HOUR_24,
};

/**
 * Short time format, 24-hours, ie. "13:00".
 **/
export const TIME_24_SHORT = {
  ...TIME_SHORT,
  ...HOUR_24,
};

/**
 * Time with zone format. Short time with short zone, ie. "1:00 PM EST".
 **/
export const TIME_WITH_ZONE = {
  ...TIME_SHORT,
  ...ZONE_SHORT,
};

/**
 * Time with long zone format.
 * Short time with long zone, ie. "1:00 PM Eastern Standard Time".
 **/
export const TIME_WITH_LONG_ZONE = {
  ...TIME_SHORT,
  ...ZONE_LONG,
};

/**
 * 24-hour time with zone format.
 * Short 24-hour time with short zone, ie. "13:00 EST".
 **/
export const TIME_24_WITH_ZONE = {
  ...TIME_24_SHORT,
  ...ZONE_SHORT,
};

/**
 * 24-hour time with long zone format.
 * Short 24-hour time with long zone, ie. "13:00 Eastern Standard Time".
 **/
export const TIME_24_WITH_LONG_ZONE = {
  ...TIME_24_SHORT,
  ...ZONE_LONG,
};

/**
 * Full datetime format.
 * Full date with short time, ie. "Wednesday, January 1, 2020, 12:00 AM".
 **/
export const DATETIME_FULL = {
  ...DATE_FULL,
  ...TIME_SHORT,
};

/**
 * Long datetime format.
 * Long date with short time, ie. "January 1, 2020, 12:00 AM".
 **/
export const DATETIME_LONG = {
  ...DATE_LONG,
  ...TIME_SHORT,
};

/**
 * Medium datetime format.
 * Medium date with short time, ie. "Jan 1, 2020, 12:00 AM".
 **/
export const DATETIME_MEDIUM = {
  ...DATE_MEDIUM,
  ...TIME_SHORT,
};

/**
 * Short datetime format.
 * Short date with short time, ie. "1/1/2020, 12:00 AM".
 **/
export const DATETIME_SHORT = {
  ...DATE_SHORT,
  ...TIME_SHORT,
};

/**
 * Full 24-hour datetime format.
 * Full date with 24-hour short time, ie. "Wednesday, January 1, 2020, 13:00".
 **/
export const DATETIME_24_FULL = {
  ...DATE_FULL,
  ...TIME_24_SHORT,
};

/**
 * Long 24-hour datetime format.
 * Long date with 24-hour short time, ie. "January 1, 2020, 13:00".
 **/
export const DATETIME_24_LONG = {
  ...DATE_LONG,
  ...TIME_24_SHORT,
};

/**
 * Medium 24-hour datetime format.
 * Medium date with 24-hour short time, ie. "Jan 1, 2020, 13:00".
 **/
export const DATETIME_24_MEDIUM = {
  ...DATE_MEDIUM,
  ...TIME_24_SHORT,
};

/**
 * Short 24-hour datetime format.
 * Short date with 24-hour short time, ie. "1/1/2020, 13:00".
 **/
export const DATETIME_24_SHORT = {
  ...DATE_SHORT,
  ...TIME_24_SHORT,
};

/**
 * Datetime with zone format.
 * Long date, short time, short zone, ie. "January 1, 2020, 1:00 PM EST"
 **/
export const DATETIME_WITH_ZONE = {
  ...DATE_LONG,
  ...TIME_WITH_ZONE,
};

/**
 * Datetime with long zone format.
 * Long date, short time, long zone, ie. "January 1, 2020, 1:00 PM Eastern Standard Time"
 **/
export const DATETIME_WITH_LONG_ZONE = {
  ...DATE_LONG,
  ...TIME_WITH_LONG_ZONE,
};

/**
 * Datetime 24 with zone format.
 * Long date, short 24-hour time, short zone, ie. "January 1, 2020, 13:00 EST"
 **/
export const DATETIME_24_WITH_ZONE = {
  ...DATE_LONG,
  ...TIME_24_WITH_ZONE,
};

/**
 * Datetime 24 with long zone format.
 * Long date, short 24-hour time, long zone, ie. "January 1, 2020, 13:00 Eastern Standard Time"
 **/
export const DATETIME_24_WITH_LONG_ZONE = {
  ...DATE_LONG,
  ...TIME_24_WITH_LONG_ZONE,
};

defineStatic('DATE_FULL', DATE_FULL);
defineStatic('DATE_LONG', DATE_LONG);
defineStatic('DATE_MEDIUM', DATE_MEDIUM);
defineStatic('DATE_SHORT', DATE_SHORT);
defineStatic('TIME_FULL', TIME_FULL);
defineStatic('TIME_LONG', TIME_LONG);
defineStatic('TIME_MEDIUM', TIME_MEDIUM);
defineStatic('TIME_SHORT', TIME_SHORT);
defineStatic('TIME_24_FULL', TIME_24_FULL);
defineStatic('TIME_24_LONG', TIME_24_LONG);
defineStatic('TIME_24_MEDIUM', TIME_24_MEDIUM);
defineStatic('TIME_24_SHORT', TIME_24_SHORT);
defineStatic('TIME_WITH_ZONE', TIME_WITH_ZONE);
defineStatic('TIME_WITH_LONG_ZONE', TIME_WITH_LONG_ZONE);
defineStatic('TIME_24_WITH_ZONE', TIME_24_WITH_ZONE);
defineStatic('TIME_24_WITH_LONG_ZONE', TIME_24_WITH_LONG_ZONE);
defineStatic('DATETIME_24_FULL', DATETIME_24_FULL);
defineStatic('DATETIME_24_LONG', DATETIME_24_LONG);
defineStatic('DATETIME_24_MEDIUM', DATETIME_24_MEDIUM);
defineStatic('DATETIME_24_SHORT', DATETIME_24_SHORT);
defineStatic('DATETIME_FULL', DATETIME_FULL);
defineStatic('DATETIME_LONG', DATETIME_LONG);
defineStatic('DATETIME_MEDIUM', DATETIME_MEDIUM);
defineStatic('DATETIME_SHORT', DATETIME_SHORT);
defineStatic('DATETIME_WITH_ZONE', DATETIME_WITH_ZONE);
defineStatic('DATETIME_WITH_LONG_ZONE', DATETIME_WITH_LONG_ZONE);
defineStatic('DATETIME_24_WITH_ZONE', DATETIME_24_WITH_ZONE);
defineStatic('DATETIME_24_WITH_LONG_ZONE', DATETIME_24_WITH_LONG_ZONE);
