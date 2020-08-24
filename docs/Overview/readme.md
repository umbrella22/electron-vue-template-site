
# 介绍

[![vue](https://img.shields.io/badge/vue-2.6.12-brightgreen.svg)](https://github.com/vuejs/vue)
[![element-ui](https://img.shields.io/badge/element--ui-2.13.1-brightgreen.svg)](https://github.com/ElemeFE/element)
[![electron](https://img.shields.io/badge/electron-9.1.2-brightgreen.svg)](https://github.com/ElemeFE/element)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/umbrella22/electron-vue-template/blob/master/LICENSE)

起手该项目的缘由是因为[原项目](https://github.com/SimulatedGREG/electron-vue)已经停止维护了很久，electron的版本号还停滞在1.x版本，所以就在原项目的基础上更新了所有依赖，并且融入了[花裤衩大大的vue-admin](https://panjiachen.github.io/vue-element-admin-site/zh/)的核心代码以及融入了我自己的一些代码。同时如果您打算使用这些核心代码的话，还请希望结合该教程。内置了nedb，两种electron自动更新，自定义头部等大家几乎经常用到的功能；相信在基础需求面前，本项目能够最大程度的帮助你
::: warning 提示
本文档对应GitHub中的第二个分支，master将会再不久迁移同第二个分支。
阅读本文档即默认您拥有前端以及vue基础知识，并拥有部分node基础知识。
:::

## 功能

```
- 登录（假）

- 使用electron-updater进行更新检查

- 使用electron的webContents类进行下载

- 全局快捷键注册以及监听

- 继承vue-admin基础版功能

- 内置express服务端
```

## 前序准备

你需要在本地安装[node](https://nodejs.org/en/)和[git](https://git-scm.com/)。本项目技术栈基于[es6](http://es6.ruanyifeng.com/)、[electron](https://electronjs.org/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh/guide/)、[vue-router](https://router.vuejs.org/zh/)、[axios](https://github.com/axios/axios)以及[element-ui](https://element.eleme.io/)，提前了解和学习这些知识会对使用本项目有很大的帮助。

## 目录结构

```
├── .electron-vue              # 构建相关
├── build                      # 项目打包目录
│   │── icon                   # 图标
│   └── lib                    # 打包依赖（win）
├── config                     # 构建相关
├── dist                       # webpack临时工作目录
├─src                          # 源码目录
│  ├─main                      # 主进程目录
│  │  ├─config                 # 主进程配置文件夹
│  │  │    ├─DisableButton.js  # 配置全局快捷键禁用
│  │  │    ├─StaticPath.js     # 静态路径文件
│  │  │    └─menu.js           # 主进程的自定义菜单
│  │  ├─server                 # 内置服务端文件夹
│  │  │    ├─index.js          # 内置服务端启动
│  │  │    └─server.js         # 内置服务端主体
│  │  ├─services               # 主进程服务文件夹
│  │  │    ├─checkupdate.js    # electron-updater更新
│  │  │    ├─downloadFile.js   # webContents类更新
│  │  │    ├─ipcMain.js        # ipcMain通讯
│  │  │    └─windowManager.js  # 初始出所有窗口
│  │  └─index.js               # 主进程入口
│  └─renderer                  # 渲染进程文件夹
│      ├─api                   # 请求以及数据库操作文件夹
│      ├─assets                # 渲染进程主题 字体等静态资源
│      ├─components            # 全局公用组件
│      ├─icons                 # 项目所有 svg icons
│      ├─layout                # 全局 layout
│      ├─router                # 路由
│      ├─store                 # 全局 store管理
│      ├─styles                # 全局样式
│      ├─tools                 # 全局特定工具
│      ├─utils                 # 全局公共方法
│      └─views                 # views 所有页面
├─static                       # 全局静态资源
├── tests                      # 测试
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── .travis.yml                # 自动化CI配置
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```

## 安装
::: danger 注意
请不要自作主张在安装依赖的时候添加`-g`参数！除非您很清楚您正在做什么！
:::
```bash
# clone项目
git clone https://github.com/umbrella22/electron-vue-template.git
# 进入项目目录
cd electron-vue-template
# 安装依赖
# 如果网络非常顺畅的情况下
npm install
# 如果网络出现一定的情况
# 建议不要使用cnpm，会出现各种玄学bug。您可以通过如下操作加快安装速度
npm install --registry=https://registry.npm.taobao.org
# 但是需要注意的是electron的本体下载并不是走这里所以还是要去设置一下
npm config edit
# 该命令会打开npm的配置文件，请在registry=https://registry.npm.taobao.org/下一行添加
# electron_mirror=https://cdn.npm.taobao.org/dist/electron/ 
# 然后关闭该窗口，重启命令行，删除node_modules文件夹，并重新安装依赖即可
# 本地开发 启动项目
npm run dev 或 yarn dev
```
::: danger 注意
强烈建议不要直接使用cnpm进行安装，那种玄学bug是真的没法说，最好就是用nrm切换一下registry，或者使用yarn，是最好的了。

一般遇到`Electron failed to install correctly，please delete node_moules/electron and try installing again`这种错误时，就是electron本体没有下载成功，删除node_module文件夹，并按照上面的设置进行electron镜像地址设置之后就好了

同时本项目的css预处理器使用的时node-sass所以同样依赖python2.7的，如果你之前没有安装的话，需要自己去看一下哦
:::

::: warning 注意
这里的环境指的是windows下，如果您是MacOS或者是linux的话，您可能需要熟悉vim的操作。
:::

在启动完成之后，就会自动打开程序界面了；接下来你就可以针对你自己的需求进行代码的修改和业务开发

## 全局文件夹
在本项目中内置了两个全局文件夹：
- `__static`：在被打包成asar之后，依旧能够提供虚拟路径，一般满足静态文件访问。
- `__lib`：无论是否启用asar，均提供一个实体的绝对路径，可在config文件夹中设置，详情请查看调用dll章节。

## Vue 生态圈

**首先了解这些 vue 生态圈的东西，会对你上手本项目有很大的帮助。**

1. [Vue Router](https://router.vuejs.org/) 是 vue 官方的路由。它能快速的帮助你构建一个单页面或者多页面的项目。

2. [Vuex](https://vuex.vuejs.org/) 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。它能解决你很多全局状态或者组件之间通信的问题。

3. [Vue Loader](https://vue-loader.vuejs.org) 是为 vue 文件定制的一个 webpack 的 loader，它允许你以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件。它能在开发过程中使用热重载来保持状态，为每个组件模拟出 scoped CSS 等等功能。不过大部分情况下你不需要对它直接进行配置，脚手架都帮你封装好了。

4) [Vue Test Utils](https://vue-test-utils.vuejs.org/) 是官方提供的一个单元测试工具。它能让你更方便的写单元测试。

5) [Vue Dev-Tools](https://github.com/vuejs/vue-devtools) Vue 在浏览器下的调试工具。写 vue 必备的一个浏览器插件，能大大的提高你调试的效率。

6) [Vetur](https://github.com/vuejs/vetur) 是 VS Code 的插件. 如果你使用 VS Code 来写 vue 的话，这个插件是必不可少的。