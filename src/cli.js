#!/usr/bin/env node
/* global argv */
import colorful from 'colorful';
import minimist from 'minimist';
import update from 'update-notifier';
import pkg from '../package';
import run from './index';

colorful.toxic();
global.argv = minimist(process.argv.slice(2), { '--': true });
update({ pkg }).notify();
run().catch(err => throw new Error(err.toString()));
