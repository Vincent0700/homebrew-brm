#!/usr/bin/env node

/**
 * brm (Homebrew Registry Manager)
 * @description https://github.com/Vincent0700/homebrew-brm/blob/master/README.md
 * @author vincent0700 (https://vincentstudio.info)
 * @email wang.yuanqiu007@gmail.com
 */

require('colors');
const fs = require('fs');
const path = require('path');
const jf = require('jsonfile');
const shell = require('shelljs');
const inquirer = require('inquirer');
const program = require('commander');
const Table = require('cli-table');

/* ---- PUBLIC VARIABLES ---- */

const SHELL = process.env.SHELL.match(/[^/]+$/)[0].trim();
const PATH_PKG = path.resolve(__dirname, './package.json');
const PATH_REGISTRIES = path.resolve(__dirname, './registries.json');
const PATH_HOME = process.env.HOME;
const PATH_RCFILE = path.resolve(PATH_HOME, `./.${SHELL}rc`);

const pkg = jf.readFileSync(PATH_PKG);
const registries = jf.readFileSync(PATH_REGISTRIES);

/* ---- CLI ---- */

_checkDependencies();

program.version(pkg.version);
program.description(pkg.description);

program
  .command('ls')
  .description('List all the registries')
  .action(showList);

program
  .command('current')
  .description('Show current registry and URL')
  .action(showCurrent);

program
  .command('use <registry>')
  .description('Change homebrew registry')
  .action(onUse);

program.parse(process.argv);

/* ---- ACTION_HANDLERS ---- */

function showList() {
  const table = new Table();
  const urls = _getCurrentRegistries();
  const obj = ['brew', 'homebrew/core', 'homebrew/cask', 'homebrew/bottles'];
  table.push(['', ...obj]);
  for (let name in registries) {
    const registry = registries[name];
    const arr = [...Array(obj.length)].map(() => '');
    for (let item in registry) {
      const url = registry[item];
      const flag = url.trim() === urls[item].trim();
      const index = obj.indexOf(item.trim());
      if (index > 0 && index < arr.length) {
        arr[index] = flag ? item.bold.brightCyan : item;
      }
    }
    table.push([name.yellow, ...arr]);
  }
  console.log(table.toString());
}

function showCurrent() {
  const table = new Table();
  const urls = _getCurrentRegistries();
  table.push(['brew'.yellow, _getRegistryName(urls['brew']).brightCyan, urls['brew'].trim()]);
  table.push(['homebrew/core'.yellow, _getRegistryName(urls['homebrew/core']).brightCyan, urls['homebrew/core'].trim()]);
  table.push(['homebrew/cask'.yellow, _getRegistryName(urls['homebrew/cask']).brightCyan, urls['homebrew/cask'].trim()]);
  table.push(['homebrew/bottles'.yellow, _getRegistryName(urls['homebrew/bottles']).brightCyan, urls['homebrew/bottles'].trim()]);
  console.log(table.toString());
}

function onUse(name) {
  if (!Object.keys(registries).includes(name)) {
    console.log(`\n  Not find registry: ${name.brightCyan}`);
  }
  inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select registry',
        name: 'arr',
        choices: [
          ...Object.keys(registries[name]).map((item) => ({
            name: item,
            checked: true
          }))
        ]
      }
    ])
    .then(({ arr }) => {
      arr.forEach((item) => {
        _setRegistry(item, registries[name][item]);
      });
      console.log(`Updating registries... Press ${'[CTRL+C]'.bold} to stop.`);
      shell.exec('brew update');
    });
}

/* ---- PRIVATE_FUNCTIONS ---- */

/**
 * @name _checkDependencies
 * @description Check & install dependencies: homenbrew, git.
 */
async function _checkDependencies() {
  const dependencies = [
    {
      cmd: 'brew',
      name: 'Homebrew',
      script: 'ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"'
    },
    {
      cmd: 'git',
      name: 'Git',
      script: 'brew install git'
    }
  ];
  dependencies.forEach(({ cmd, name, script }) => {
    if (!shell.which(cmd)) {
      inquirer
        .prompt({
          type: 'confirm',
          name: 'flag',
          message: `Missing dependency - ${name.brightCyan}. Install it?`,
          default: true
        })
        .then(({ flag }) => {
          if (flag) {
            shell.exec(script);
            shell.exit(1);
          }
        });
    }
  });
}

/**
 * @name _getRegistryName
 * @description Get registry name by url
 * @param {String} url Registry url
 * @returns {String}
 */
function _getRegistryName(url) {
  for (let name in registries) {
    const registry = registries[name];
    for (let item in registry) {
      if (registry[item].trim() === url.trim()) {
        return name;
      }
    }
  }
  return '';
}

/**
 * @name _getCurrentRegistries
 * @description Get urls of current registries
 * @returns {Object}
 */
function _getCurrentRegistries() {
  const brewUrl = shell.exec('git -C $(brew --repo) remote get-url origin', { silent: true }).stdout || '';
  const homebrewCoreUrl = shell.exec('git -C $(brew --repo homebrew/core) remote get-url origin', { silent: true }).stdout || '';
  const homebrewCaskUrl = shell.exec('git -C $(brew --repo homebrew/cask) remote get-url origin', { silent: true }).stdout || '';
  const homebrewBottlesUrl = process.env.HOMEBREW_BOTTLE_DOMAIN || '';
  return {
    brew: brewUrl,
    'homebrew/core': homebrewCoreUrl,
    'homebrew/cask': homebrewCaskUrl,
    'homebrew/bottles': homebrewBottlesUrl
  };
}

/**
 * @name _setRegistry
 * @description Set Homebrew registries
 * @param {String} name Registry name
 * @param {String} url Registry url
 */
function _setRegistry(name, url) {
  const cb = (err) => {
    if (err) console.warn(err);
    else console.log(`Set ${name.brightCyan} registry to ${url.magenta}`);
  };
  if (name === 'brew') {
    cb(shell.exec(`git -C "$(brew --repo)" remote set-url origin ${url}`, { silent: true }).stderr);
  } else if (name === 'homebrew/core') {
    cb(shell.exec(`git -C "$(brew --repo homebrew/core)" remote set-url origin ${url}`, { silent: true }).stderr);
  } else if (name === 'homebrew/cask') {
    cb(shell.exec(`git -C "$(brew --repo homebrew/cask)" remote set-url origin ${url}`, { silent: true }).stderr);
  } else if (name === 'homebrew/bottles') {
    try {
      let content = fs.readFileSync(PATH_RCFILE, { encoding: 'utf8' });
      let arr = content.split('\n');
      let deleteIndicies = [];
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i].match(/export[\s]+HOMEBREW_BOTTLE_DOMAIN=[^\S]*/)) deleteIndicies.push(i);
      }
      deleteIndicies.reverse().forEach((index) => arr.splice(index, 1));
      content = arr.join('\n');
      content = content.trimRight('\n');
      content += `\n\nexport HOMEBREW_BOTTLE_DOMAIN=${url}`;
      fs.writeFileSync(PATH_RCFILE, content);
      shell.env.HOMEBREW_BOTTLE_DOMAIN = url;
      cb(false);
    } catch (err) {
      cb(err);
    }
  }
}
