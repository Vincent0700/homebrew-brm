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
const dns = require('dns');
const ping = require('net-ping');
const inquirer = require('inquirer');
const program = require('commander');
const Table = require('cli-table');

/* ---- PUBLIC VARIABLES ---- */

const SHELL = process.env.SHELL.match(/[^/]+$/)[0].trim();
const PATH_PKG = path.resolve(__dirname, './package.json');
const PATH_REGISTRIES = path.resolve(__dirname, './registries.json');
const PATH_HOME = process.env.HOME;
const PATH_RCFILE = path.resolve(PATH_HOME, `./.${SHELL}rc`);
const REG_DOMAIN = /^http[s]?:\/\/(.*?)\//;

const MSG_TYPE = {
  INFO: Symbol(),
  WARN: Symbol(),
  ERROR: Symbol()
};

const pkg = jf.readFileSync(PATH_PKG);
const registries = jf.readFileSync(PATH_REGISTRIES);

/* ---- CLI ---- */

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

program
  .command('test [registry]')
  .description('Show response time for specific or all registries')
  .action(onTest);

(async function() {
  await _checkDependencies();
  program.parse(process.argv);
})();

/* ---- ACTION_HANDLERS ---- */

function showList() {
  const urls = _getCurrentRegistries();
  const obj = ['brew', 'homebrew/core', 'homebrew/cask', 'homebrew/bottles'];
  const table = new Table({
    colWidths: [10, 18, 18, 18, 18],
    colAligns: ['left', 'middle', 'middle', 'middle', 'middle']
  });
  table.push(['', ...obj].map((s) => s.brightCyan));
  for (let name in registries) {
    const registry = registries[name];
    const arr = [...Array(obj.length)].map(() => '✘'.brightRed);
    for (let item in registry) {
      const url = registry[item];
      const flag = url.trim() === urls[item].trim();
      const index = obj.indexOf(item.trim());
      if (index >= 0 && index < arr.length) {
        arr[index] = flag ? 'Use'.italic.bold.brightGreen : '✔'.brightGreen;
      }
    }
    table.push([name.brightYellow, ...arr]);
  }
  console.log(table.toString());
}

function showCurrent() {
  const table = new Table();
  const urls = _getCurrentRegistries();
  table.push(['brew'.brightYellow, _getRegistryName(urls['brew']).brightCyan, urls['brew'].trim()]);
  table.push(['homebrew/core'.brightYellow, _getRegistryName(urls['homebrew/core']).brightCyan, urls['homebrew/core'].trim()]);
  table.push(['homebrew/cask'.brightYellow, _getRegistryName(urls['homebrew/cask']).brightCyan, urls['homebrew/cask'].trim()]);
  table.push(['homebrew/bottles'.brightYellow, _getRegistryName(urls['homebrew/bottles']).brightCyan, urls['homebrew/bottles'].trim()]);
  console.log(table.toString());
}

function onUse(name) {
  if (!Object.keys(registries).includes(name)) {
    _log(`Not find registry: ${name.brightCyan}`, MSG_TYPE.WARN);
    shell.exit(1);
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
      _log(`Plese type the following commands to update registries.`, MSG_TYPE.WARN);
      const table = new Table();
      table.push([`source ${PATH_RCFILE} && brew cleanup && brew update`]);
      console.log(table.toString());
    });
}

function onTest(mirror) {
  const list = [];
  if (mirror) {
    if (registries[mirror] && registries[mirror]['brew']) {
      const domain = registries[mirror]['brew'].match(REG_DOMAIN)[1];
      list.push({ mirror, domain });
    }
  } else {
    for (let mirror in registries) {
      if (registries[mirror]['brew']) {
        const domain = registries[mirror]['brew'].match(REG_DOMAIN)[1];
        list.push({ mirror, domain });
      }
    }
  }

  if (list.length > 0) {
    const promises = [];
    const session = ping.createSession();
    session.on('error', function() {
      session.close();
    });
    _log(`Testing speed of ${list.map((item) => item.mirror.brightCyan).join(', ')}...`);
    list.forEach((item) => {
      promises.push(_pingHost(session, item.domain));
    });
    Promise.all(promises).then((result) => {
      for (let i = 0; i < result.length; ++i) {
        list[i].latency = result[i];
      }
      list.sort((a, b) => a.latency - b.latency);
      const MAX_LEN = 30;
      for (let i = 0; i < list.length; ++i) {
        let str = `${list[i].mirror.brightYellow} `;
        str += [...Array(MAX_LEN - list[i].mirror.length)].map(() => '-').join('') + ' ';
        str += list[i].latency !== Number.MAX_SAFE_INTEGER ? list[i].latency.toString().brightGreen + ' ms'.bold : 'timeout'.brightRed;
        console.log(str);
      }
    });
  }
}

/* ---- PRIVATE_FUNCTIONS ---- */

/**
 * @name _log
 * @description Print log message
 * @param {String} msg Log message
 * @param {MSG_TYPE} type Type of log message
 */
function _log(msg, type = MSG_TYPE.INFO) {
  let typeStr = '';
  if (type === MSG_TYPE.INFO) {
    typeStr = '[BRM]'.brightGreen;
  } else if (type === MSG_TYPE.WARN) {
    typeStr = '[BRM][WARN]'.brightYellow;
  } else if (type === MSG_TYPE.ERROR) {
    typeStr = '[BRM][ERROR]'.brightRed;
  }
  console.log(`${typeStr} ${msg}`);
}

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
  let promises = [];
  dependencies.forEach(({ cmd, name, script }) => {
    if (!shell.which(cmd)) {
      _log(`Missing dependency - ${name.brightCyan}`, MSG_TYPE.WARN);
      promises.push(
        new Promise((resolve) => {
          inquirer
            .prompt({
              type: 'confirm',
              name: 'flag',
              message: `Press <Enter> to install ${name.brightCyan}?`,
              default: true
            })
            .then(({ flag }) => {
              if (flag) {
                shell.exec(script);
                shell.exit(1);
              }
              resolve();
            });
        })
      );
    }
  });
  return Promise.all(promises);
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
  const homebrewBottlesUrl = shell.env.HOMEBREW_BOTTLE_DOMAIN || '';
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
    if (err) _log(err, MSG_TYPE.WARN);
    else _log(`Set ${name.brightCyan} registry to ${url.magenta}`);
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

/**
 * @name _pingHost
 * @description Get network latency
 * @param {Object} session Ping session
 * @param {String} domain Domain to test
 * @returns {Promise<Number>} Latency(ms), Number.MAX_SAFE_INTEGER means timeout
 */
async function _pingHost(session, domain) {
  return new Promise((resolve) => {
    dns.lookup(domain, function(err, ip) {
      if (err) resolve(Number.MAX_SAFE_INTEGER);
      session.pingHost(ip, (error, target, sent, rcvd) => {
        if (error) resolve(Number.MAX_SAFE_INTEGER);
        resolve(rcvd.getTime() - sent.getTime());
      });
    });
  });
}
