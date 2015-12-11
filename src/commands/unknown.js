/* global argv */
import log from 'typelog';

export default function unknown () {
  log.error(`unknown options, use ${'-h/--help'.white.bold} to see get help`);
};
