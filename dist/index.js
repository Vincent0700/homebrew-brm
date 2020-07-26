#!/usr/bin/env node
!function(e){var r={};function t(o){if(r[o])return r[o].exports;var i=r[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=r,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var i in e)t.d(o,i,function(r){return e[r]}.bind(null,i));return o},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=0)}([function(e,r,t){t(1);const o=t(2),i=t(3),n=t(4),s=t(5),c=t(6),l=t(7),m=t(8),b=t(9),a=/^http[s]?:\/\/(.*?)\//,u=process.env.SHELL.match(/[^/]+$/)[0].trim(),h=i.resolve(process.env.HOME,`./.${u}rc`),g=t(10),p=t(11),w={INFO:Symbol(),WARN:Symbol(),ERROR:Symbol()};function f(e,r=w.INFO){let t="";r===w.INFO?t="[BRM]".brightGreen:r===w.WARN?t="[BRM][WARN]".brightYellow:r===w.ERROR&&(t="[BRM][ERROR]".brightRed),console.log(`${t} ${e}`)}function d(e){for(let r in p){const t=p[r];for(let o in t)if(t[o].trim()===e.trim())return r}return""}function y(){return{brew:n.exec("git -C $(brew --repo) remote get-url origin",{silent:!0}).stdout||"","homebrew/core":n.exec("git -C $(brew --repo homebrew/core) remote get-url origin",{silent:!0}).stdout||"","homebrew/cask":n.exec("git -C $(brew --repo homebrew/cask) remote get-url origin",{silent:!0}).stdout||"","homebrew/bottles":n.env.HOMEBREW_BOTTLE_DOMAIN||""}}m.version(g.version),m.description(g.description),m.command("ls").description("List all the registries").action((function(){const e=y(),r=["brew","homebrew/core","homebrew/cask","homebrew/bottles"],t=new b({colWidths:[10,18,18,18,18],colAligns:["left","middle","middle","middle","middle"]});t.push(["",...r].map(e=>e.brightCyan));for(let o in p){const i=p[o],n=[...Array(r.length)].map(()=>"✘".brightRed);for(let t in i){const o=i[t].trim()===e[t].trim(),s=r.indexOf(t.trim());s>=0&&s<n.length&&(n[s]=o?"Use".italic.bold.brightGreen:"✔".brightGreen)}t.push([o.brightYellow,...n])}console.log(t.toString())})),m.command("current").description("Show current registry and URL").action((function(){const e=new b,r=y();e.push(["brew".brightYellow,d(r.brew).brightCyan,r.brew.trim()]),e.push(["homebrew/core".brightYellow,d(r["homebrew/core"]).brightCyan,r["homebrew/core"].trim()]),e.push(["homebrew/cask".brightYellow,d(r["homebrew/cask"]).brightCyan,r["homebrew/cask"].trim()]),e.push(["homebrew/bottles".brightYellow,d(r["homebrew/bottles"]).brightCyan,r["homebrew/bottles"].trim()]),console.log(e.toString())})),m.command("use <registry>").description("Change homebrew registry").action((function(e){Object.keys(p).includes(e)||(f("Not find registry: "+e.brightCyan,w.WARN),n.exit(1));l.prompt([{type:"checkbox",message:"Select registry",name:"arr",choices:[...Object.keys(p[e]).map(e=>({name:e,checked:!0}))]}]).then(({arr:r})=>{r.forEach(r=>{!function(e,r){const t=t=>{t?f(t,w.WARN):f(`Set ${e.brightCyan} registry to ${r.magenta}`)};if("brew"===e)t(n.exec('git -C "$(brew --repo)" remote set-url origin '+r,{silent:!0}).stderr);else if("homebrew/core"===e)t(n.exec('git -C "$(brew --repo homebrew/core)" remote set-url origin '+r,{silent:!0}).stderr);else if("homebrew/cask"===e)t(n.exec('git -C "$(brew --repo homebrew/cask)" remote set-url origin '+r,{silent:!0}).stderr);else if("homebrew/bottles"===e)try{let e=o.readFileSync(h,{encoding:"utf8"}),i=e.split("\n"),s=[];for(let e=0;e<i.length;++e)i[e].match(/export[\s]+HOMEBREW_BOTTLE_DOMAIN=[\S]*/)&&s.push(e);s.reverse().forEach(e=>i.splice(e,1)),e=i.join("\n"),e=e.trimRight("\n"),e+="\n\nexport HOMEBREW_BOTTLE_DOMAIN="+r,o.writeFileSync(h,e),n.env.HOMEBREW_BOTTLE_DOMAIN=r,t(!1)}catch(e){t(e)}}(r,p[e][r])}),f("Executing "+"brew cleanup".brightYellow),n.exec("brew cleanup"),f("Executing "+"brew update".brightYellow),n.exec("brew update"),f("Done.")})})),m.command("test [registry]").description("Show response time for specific or all registries").action((function(e){const r=[];if(e){if(p[e]&&p[e].brew){const t=p[e].brew.match(a)[1];r.push({mirror:e,domain:t})}}else for(let e in p)if(p[e].brew){const t=p[e].brew.match(a)[1];r.push({mirror:e,domain:t})}if(r.length>0){const e=[];f(`Testing speed of ${r.map(e=>e.mirror.brightCyan).join(", ")}...`),r.forEach(r=>{e.push(async function(e){const r=Number.MAX_SAFE_INTEGER;return new Promise(t=>{s.lookup(e,(function(e,o){e&&t(r),c.ping({address:o,port:443,timeout:3e3,attempts:3},(e,o)=>{if(e&&t(r),o&&o.results&&Array.isArray(o.results)&&o.results.length>0){const e=o.avg;isNaN(e)&&t(r),t(parseInt(e))}else t(r)})}))})}(r.domain))}),Promise.all(e).then(e=>{for(let t=0;t<e.length;++t)r[t].latency=e[t];r.sort((e,r)=>e.latency-r.latency);for(let e=0;e<r.length;++e){let t=r[e].mirror.brightYellow+" ";t+=[...Array(30-r[e].mirror.length)].map(()=>"-").join("")+" ",t+=r[e].latency!==Number.MAX_SAFE_INTEGER?r[e].latency.toString().brightGreen+" ms".bold:"timeout".brightRed,console.log(t)}})}})),async function(){!async function(){const e=o.readFileSync(h,{encoding:"utf8"}).match(/export[\s]+HOMEBREW_BOTTLE_DOMAIN=([\S]*)/);if(e&&e.length>1){const r=e[1];n.env.HOMEBREW_BOTTLE_DOMAIN=r}}(),await async function(){let e=[];return[{cmd:"brew",name:"Homebrew",script:'ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"'},{cmd:"git",name:"Git",script:"brew install git"}].forEach(({cmd:r,name:t,script:o})=>{n.which(r)||(f("Missing dependency - "+t.brightCyan,w.WARN),e.push(new Promise(e=>{l.prompt({type:"confirm",name:"flag",message:`Press <Enter> to install ${t.brightCyan}?`,default:!0}).then(({flag:r})=>{r&&(n.exec(o),n.exit(1)),e()})})))}),Promise.all(e)}(),m.parse(process.argv)}()},function(e,r){e.exports=require("colors")},function(e,r){e.exports=require("fs")},function(e,r){e.exports=require("path")},function(e,r){e.exports=require("shelljs")},function(e,r){e.exports=require("dns")},function(e,r){e.exports=require("tcp-ping")},function(e,r){e.exports=require("inquirer")},function(e,r){e.exports=require("commander")},function(e,r){e.exports=require("cli-table")},function(e){e.exports=JSON.parse('{"name":"homebrew-brm","version":"1.2.4","author":"vincent0700 (https://vincentstudio.info)","email":"wang.yuanqiu007@gmail.com","description":"Homebrew registry manager for macOS","license":"MIT","keywords":["homebrew","registries","manager"],"scripts":{"lint":"eslint . --fix","build":"eslint . --fix && rimraf ./dist && webpack --config ./webpack.config.js && chmod +x ./dist/index.js"},"bin":{"brm":"./dist/index.js"},"repository":{"url":"git@github.com:Vincent0700/homebrew-brm.git","type":"git"},"devDependencies":{"@babel/core":"^7.9.0","@babel/preset-env":"^7.9.0","@commitlint/cli":"^8.3.5","@commitlint/config-conventional":"^8.3.4","babel-loader":"^8.1.0","cache-loader":"^4.1.0","eslint":"^6.8.0","eslint-config-prettier":"^6.9.0","eslint-plugin-prettier":"^3.1.2","husky":"^4.2.1","lint-staged":"^10.0.3","prettier":"^1.19.1","rimraf":"^3.0.2","speed-measure-webpack-plugin":"^1.3.3","webpack":"^4.42.1","webpack-cli":"^3.3.11"},"dependencies":{"cli-table":"^0.3.1","colors":"^1.4.0","commander":"^4.1.0","inquirer":"^7.0.4","shelljs":"^0.8.3","tcp-ping":"^0.1.1"}}')},function(e){e.exports=JSON.parse('{"official":{"brew":"https://github.com/Homebrew/brew.git","homebrew/core":"https://github.com/Homebrew/homebrew-core.git","homebrew/cask":"https://github.com/Homebrew/homebrew-cask.git","homebrew/bottles":""},"tsinghua":{"brew":"https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git","homebrew/core":"https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git","homebrew/cask":"https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git","homebrew/bottles":"https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"},"aliyun":{"brew":"https://mirrors.aliyun.com/homebrew/brew.git","homebrew/core":"https://mirrors.aliyun.com/homebrew/homebrew-core.git","homebrew/bottles":"https://mirrors.aliyun.com/homebrew/homebrew-bottles"},"ustc":{"brew":"https://mirrors.ustc.edu.cn/brew.git","homebrew/core":"https://mirrors.ustc.edu.cn/homebrew-core.git","homebrew/cask":"https://mirrors.ustc.edu.cn/homebrew-cask.git","homebrew/bottles":"https://mirrors.ustc.edu.cn/homebrew-bottles"}}')}]);