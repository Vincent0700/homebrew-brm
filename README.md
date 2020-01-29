# BRM (Homebrew Registry Manager)

[![NPM](https://nodei.co/npm/homebrew-brm.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/homebrew-brm)

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/vincent0700/homebrew-brm/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/homebrew-brm.svg?style=plastic)](https://www.npmjs.com/package/homebrew-brm)
[![npm](https://img.shields.io/npm/dm/homebrew-brm.svg)](https://www.npmjs.com/package/homebrew-brm)

brm can help you easy and fast switch between different Homebrew registries, now include: official, tsinghua, aliyun, ustc.

## Install

```bash
$ npm install -g homebrew-brm
```

Or 

```
$ yarn global add homebrew-brm
```

## Usage

```
$ brm -h
Usage: brm [options] [command]

Homebrew registry manager for macOS

Options:
  -V, --version    output the version number
  -h, --help       output usage information

Commands:
  ls               List all the registries
  current          Show current registry and URL
  use <registry>   Change homebrew registry
  test [registry]  Show response time for specific or all registries
```

## Example

### List all the registries

```
$ brm ls
┌──────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│          │       brew       │  homebrew/core   │  homebrew/cask   │ homebrew/bottles │
├──────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ official │        ✔         │        ✔         │        ✔         │        ✔         │
├──────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ tsinghua │        ✔         │        ✔         │       Use        │        ✔         │
├──────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ aliyun   │       Use        │       Use        │        ✘         │       Use        │
├──────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ ustc     │        ✔         │        ✔         │        ✔         │        ✔         │
└──────────┴──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

### Change homebrew registry

```
$ brm use aliyun
? Select registry (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ brew
 ◉ homebrew/core
 ◉ homebrew/bottles
```

```
$ brm use aliyun
? Select registry brew, homebrew/core, homebrew/bottles
[BRM] Set brew registry to https://mirrors.aliyun.com/homebrew/brew.git
[BRM] Set homebrew/core registry to https://mirrors.aliyun.com/homebrew/homebrew-core.git
[BRM] Set homebrew/bottles registry to https://mirrors.aliyun.com/homebrew/homebrew-bottles
[BRM][WARN] Plese type the following commands to update registries.
┌─────────────────────────────────────────────────────────────┐
│ source /Users/vincent/.zshrc && brew cleanup && brew update │
└─────────────────────────────────────────────────────────────┘
```

### Show current registry and URL

```
$ brm current
┌──────────────────┬──────────┬─────────────────────────────────────────────────────────────────────┐
│ brew             │ aliyun   │ https://mirrors.aliyun.com/homebrew/brew.git                        │
├──────────────────┼──────────┼─────────────────────────────────────────────────────────────────────┤
│ homebrew/core    │ aliyun   │ https://mirrors.aliyun.com/homebrew/homebrew-core.git               │
├──────────────────┼──────────┼─────────────────────────────────────────────────────────────────────┤
│ homebrew/cask    │ tsinghua │ https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git │
├──────────────────┼──────────┼─────────────────────────────────────────────────────────────────────┤
│ homebrew/bottles │ aliyun   │ https://mirrors.aliyun.com/homebrew/homebrew-bottles                │
└──────────────────┴──────────┴─────────────────────────────────────────────────────────────────────┘
```

### Auto install dependencies

```
$ brm
[BRM][WARN] Missing dependency - Homebrew
? Press <Enter> to install Homebrew? Yes
```

### Test mirror speed

```
$ brm test aliyun
[BRM] Testing speed of aliyun...
aliyun ------------------------ 10 ms
```

```
$ brm test
[BRM] Testing speed of official, tsinghua, aliyun, ustc...
aliyun ------------------------ 18 ms
tsinghua ---------------------- 33 ms
ustc -------------------------- 45 ms
official ---------------------- timeout
```
