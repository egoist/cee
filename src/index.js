/* global argv */
import init from './commands/init';
import unknown from './commands/unknown';

export default function () {
  switch (argv._[0]) {
    case 'init':
      return init();
    default:
      return unknown();
  }
};
