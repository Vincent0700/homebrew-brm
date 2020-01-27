# brm -- Homebrew registry manager

[![NPM](https://nodei.co/npm/homebrew-brm.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/homebrew-brm)

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/vincent0700/homebrew-brm/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/tail.svg?style=plastic)](https://www.npmjs.com/package/homebrew-brm)
![npm](https://img.shields.io/npm/dm/homebrew-brm.svg)

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
  -V, --version   output the version number
  -h, --help      output usage information

Commands:
  ls              List all the registries
  current         Show current registry and URL
  use <registry>  Change homebrew registry
```

## Example

### List all the registries

```
$ brm ls
┌──────────┬───┬──────────────────┬─────────────────────────────────────────────────────────────────────┐
│ official │   │ brew             │ https://github.com/Homebrew/brew.git                                │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │   │ homebrew/core    │ https://github.com/Homebrew/homebrew-core.git                       │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │   │ homebrew/cask    │ https://github.com/Homebrew/homebrew-cask.git                       │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│ tsinghua │   │ brew             │ https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git          │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │   │ homebrew/core    │ https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │ * │ homebrew/cask    │ https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │   │ homebrew/bottles │ https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles               │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│ aliyun   │ * │ brew             │ https://mirrors.aliyun.com/homebrew/brew.git                        │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │ * │ homebrew/core    │ https://mirrors.aliyun.com/homebrew/homebrew-core.git               │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │ * │ homebrew/bottles │ https://mirrors.aliyun.com/homebrew/homebrew-bottles                │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│ ustc     │   │ brew             │ https://mirrors.ustc.edu.cn/brew.git                                │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │   │ homebrew/core    │ https://mirrors.ustc.edu.cn/homebrew-core.git                       │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │   │ homebrew/cask    │ https://mirrors.ustc.edu.cn/homebrew-cask.git                       │
├──────────┼───┼──────────────────┼─────────────────────────────────────────────────────────────────────┤
│          │   │ homebrew/bottles │ https://mirrors.ustc.edu.cn/homebrew-bottles                        │
└──────────┴───┴──────────────────┴─────────────────────────────────────────────────────────────────────┘
```

### Change homebrew registry

```
$ brm use tsinghua
? Select registry brew, homebrew/core, homebrew/cask, homebrew/bottles
Set brew registry to https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git
Set homebrew/core registry to https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git
Set homebrew/cask registry to https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git
Set homebrew/bottles registry to https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles
Updating registries... Press [CTRL+C] to stop.
Already up-to-date.
```

### Show current registry and URL

```
$ brm current
┌──────────────────┬──────────┬─────────────────────────────────────────────────────────────────────┐
│ brew             │ tsinghua │ https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git          │
├──────────────────┼──────────┼─────────────────────────────────────────────────────────────────────┤
│ homebrew/core    │ tsinghua │ https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git │
├──────────────────┼──────────┼─────────────────────────────────────────────────────────────────────┤
│ homebrew/cask    │ tsinghua │ https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git │
├──────────────────┼──────────┼─────────────────────────────────────────────────────────────────────┤
│ homebrew/bottles │ aliyun   │ https://mirrors.aliyun.com/homebrew/homebrew-bottles                │
└──────────────────┴──────────┴─────────────────────────────────────────────────────────────────────┘
```
