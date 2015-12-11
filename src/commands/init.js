/* global argv */
import path from 'path';
import inq from 'inquirer';
import pify from 'pify';
import exists from 'path-exists';
import fetch from 'node-fetch';
import log from 'typelog';
import mkdirp from 'mkdirp';
import home from 'user-home';
import Download from 'download';
import downloadStatus from 'download-status';
import { parseJSON } from 'lazy-json';
import { repoTags } from '../utils/repos';
import 'shelljs/global';

mkdirp.sync(home + '/.cee_packages');

export default async function init () {
  let options = {
    name: argv._[1]
  };

  async function fetchPackages () {
    if (exists.sync(path.join(process.cwd(), options.destFolder))) {
      if (!argv.f || !argv.force) {
        return log.error(`Folder ${options.destFolder.white.bold} exists, use -f/--force to override`);
      }
    }
    let packages = await fetch('https://raw.githubusercontent.com/egoist/cee-packages/master/cee.lson')
      .then(data => data.text())
      .catch(err => console.log(err));
    packages = parseJSON(packages);
    if (!packages[options.name]) {
      log.error(`Package ${options.name.white.bold} not found`);
    } else {
      const tags = await repoTags(packages[options.name]).catch(err => console.log(err));
      let tag
      if (argv.tag) {
        tag = tags.filter(t => t.tag_name === 'v' + argv.tag)[0];
      } else {
        tag = tags[0];
      }
      // TODO: copy existsing folder in .cee_packages to destFolder
      new Download({ mode: '755', extract: true })
        .get(`https://github.com/${packages[options.name]}/archive/${tag.tag_name}.tar.gz`)
        .dest(home + '/.cee_packages')
        .use(downloadStatus())
        .run((err, files) => {
          if (err) {
            return console.log(err);
          }
          mv(`${home}/.cee_packages/${options.name}-${tag.tag_name.substring(1)}`, path.join(process.cwd(), options.destFolder))
          log.success('done!');
        })
    }
  }

  if (!options.name) {
    const questionsOfPackage = [
      {
        message: 'The name of package which you want to generate:',
        type: 'input',
        name: 'name'
      },
      {
        message: 'Where you want to generate to: (eg: hello-world)',
        type: 'input',
        name: 'destFolder',
        validate (val) {
          return !!val;
        }
      }
    ];
    inq.prompt(questionsOfPackage, answerForOptions => {
      options = answerForOptions;
      fetchPackages();
    });
  } else {
    fetchPackages();


  }
};
