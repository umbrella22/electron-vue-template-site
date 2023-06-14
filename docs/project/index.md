# 介绍

两种 electron 自动更新，自定义头部等大家几乎经常用到的功能；相信在基础需求面前，本项目能够最大程度的帮助你
::: warning 提示
阅读本文档即默认您拥有前端以及 vue 基础知识，并拥有部分 node 基础知识。

**并确保您的 node 环境是大于或等于 18**
:::

## 功能

```
- 使用electron-updater进行更新检查

- 下载文件

- 全局快捷键注册以及监听

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
├── env                        # 环境相关
├─src                          # 源码目录
│  ├─main                      # 主进程目录
│  │  ├── config               # 主进程配置
│  │  │    ├── DisableButton.js# 按钮禁用
│  │  │    ├── StaticPath.js   # 静态路径
│  │  │    ├── const.js        # 静态变量
│  │  │    ├── hotPublish.js   # 热更新配置
│  │  │    └── menu.js         # 菜单
│  │  ├─server                 # 内置服务端文件夹
│  │  │    ├─index.js          # 内置服务端启动
│  │  │    └─server.js         # 内置服务端主体
│  │  ├─services               # 主进程服务文件夹
│  │  │    ├── HotUpdater.js   # 热更新
│  │  │    ├── checkupdate.js  # electron-updater
│  │  │    ├── downloadFile.js # 下载文件
│  │  │    ├── ipcMain.js      # ipc通讯
│  │  │    └── windowManager.js# 窗口管理
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
请不要随意替换包管理器，本项目仅使用 yarn 进行包管理

请不要自作主张在安装依赖的时候添加`-g`参数！除非您很清楚您正在做什么！
:::

```bash
# clone项目 webpack+vue2.7
git clone https://github.com/umbrella22/electron-vue-template.git
# clone项目 vite+vue3
git clone https://github.com/umbrella22/electron-vite-template.git
# 进入项目目录
cd electron-vue-template or electron-vite-template
# 安装依赖
npm config edit
# 该命令会打开npm的配置文件，请在空白处添加
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
electron_mirror=https://cdn.npmmirror.com/binaries/electron/
registry=https://registry.npmmirror.com/
# 然后关闭该窗口，重启命令行.
# 使用yarn安装
yarn or yarn install

# 启动之后，会在9080端口监听
yarn dev

# build命令在不同系统环境中，需要的的不一样，需要自己根据自身环境进行配置
yarn build

```

::: danger 注意
强烈建议不要直接使用 cnpm 进行安装，由于软链接带来的玄学 bug 是真的没法说，最好就是用 nrm 切换一下 registry，或者使用 yarn，是最好的了。

一般遇到`Electron failed to install correctly，please delete node_moules/electron and try installing again`这种错误时，就是 electron 本体没有下载成功，删除 node_module 文件夹，并按照上面的设置进行 electron 镜像地址设置之后就好了

:::

::: warning 注意
这里的环境指的是 windows 下，如果您是 MacOS 或者是 linux 的话，您可能需要熟悉 vim 的操作。
:::

在启动完成之后，就会自动打开程序界面了；接下来你就可以针对你自己的需求进行代码的修改和业务开发

## 全局文件夹

在本项目中内置了两个全局文件夹：

- `__static`：在被打包成 asar 之后，依旧能够提供虚拟路径，一般满足静态文件访问。
- `__lib`：(渲染进程)无论是否启用 asar，均提供一个实体的绝对路径，可在 config 文件夹中设置，详情请查看调用 dll 章节。
- `process.env.libPath`：(主进程)无论是否启用 asar，均提供一个实体的绝对路径，可在 config 文件夹中设置，详情请查看调用 dll 章节。

## 环境变量

- `process.env.TERGET_ENV`：仅工具标识是否清空产物文件夹

## env 文件夹

- 该文件夹内存放的文件格式为 `.env`，已经预设了两个文件，`.env`和`sit.env`
  - `.env`：它通常是在你没有指定 `-m`命令时，它会读取这个文件，并且将该文件内的所有设置项以 key:value 的形式挂载到`process.env`中（渲染进程）（主进程里为`process.env.config`），您可以通过直接访问`process.env.xxx`（其中 xxx 为您自行设置的变量）
  - `sit.env`：该文件为预设测试环境
- `.env`文件通常以`环境名.env`的组合存在于`env`文件夹内，在使用时，您只需要在命令后添加 `-m`以及对应的环境名称，即可访问到。
  - 例如预发布环境，我们规定为 release，那么文件通常设置为 `release.env` 在使用时，`-m` 后则跟随为 release.

### 示例

**这将展示在默认和指定了-m 参数情况下的状态**

```json
scripts:{
    "dev": "cross-env TERGET_ENV=development node .electron-vue/dev-runner.js",
    "dev:sit": "cross-env TERGET_ENV=development node .electron-vue/dev-runner.js -m sit",
    "dev:release": "cross-env TERGET_ENV=development node .electron-vue/dev-runner.js -m release",
    "build": "cross-env BUILD_TARGET=clean node .electron-vue/build.js  && electron-builder",
    "build:sit": "cross-env BUILD_TARGET=clean node .electron-vue/build.js -m sit  && electron-builder",
    "build:release": "cross-env BUILD_TARGET=clean node .electron-vue/build.js -m release  && electron-builder",
}
```

## Vue 生态圈

**首先了解这些 vue 生态圈的东西，会对你上手本项目有很大的帮助。**

1. [Vue Router](https://router.vuejs.org/) 是 vue 官方的路由。它能快速的帮助你构建一个单页面或者多页面的项目。

2. [pinia](https://pinia.vuejs.org/) 符合直觉的 Vue.js 状态管理库,类型安全、可扩展性以及模块化设计。

3. [Vue Loader](https://vue-loader.vuejs.org) 是为 vue 文件定制的一个 webpack 的 loader，它允许你以一种名为单文件组件 (SFCs)的格式撰写 Vue 组件。它能在开发过程中使用热重载来保持状态，为每个组件模拟出 scoped CSS 等等功能。不过大部分情况下你不需要对它直接进行配置，脚手架都帮你封装好了。

4. [Vue Dev-Tools](https://github.com/vuejs/vue-devtools) Vue 在浏览器下的调试工具。写 vue 必备的一个浏览器插件，能大大的提高你调试的效率。

5. [Vetur](https://github.com/vuejs/vetur) 是 VS Code 的插件. 如果你使用 VS Code 来写 vue 的话，这个插件是必不可少的。
6. [volar](https://github.com/johnsoncodehk/volar) 是 VS Code 的插件. 如果你使用 VS Code 来写 vue3 的话，这个插件是必不可少的。
