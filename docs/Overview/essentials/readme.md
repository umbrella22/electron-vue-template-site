# 主进程代码解析
要正确使用electron除了先：[熟！读！文！档](https://electronjs.org/docs)，electron的文档和vue的文档一样，当你遇到问题时，你不一定会找到答案，但是当问题解决了你一定能从文档中找到该问题的解决办法~~
## 主进程目录
```
└─src                          # 源码目录
   └─main                      # 主进程目录
      ├─config                 # 主进程配置文件夹
      │    ├─DisableButton.js  # 配置全局快捷键禁用
      │    └─menu.js           # 主进程的自定义菜单
      ├─services               # 主进程服务文件夹
      │    ├─checkupdate.js    # electron-updater更新
      │    ├─downloadFile.js   # webContents类更新
      │    ├─ipcMain.js        # ipcMain通讯
      │    └─windowManager.js  # 初始出所有窗口
      └─index.js               # 主进程入口
```
### index.js
- index.js是主进程的入口，下载过官方demo并且熟悉vue的童靴都知道，这里和vue的main.js是一样的，均包含了整个进程初始化操作，但是在本项目中，其代码只有21行，因为~你们也看到啦，我将窗口初始化，进程间通讯，更新，菜单都分开存放在各个文件夹中，便于后期优化和更改。
```javascript
'use strict'
// index中和官方demo差异不是很大
import { app } from 'electron'
import initWindow from './services/windowManager'
import DisableButton from './config/DisableButton'
// 初始化函数
function onAppReady () {
  initWindow()
  DisableButton.Disablef12()
}
// 通过isReady方法去启动整个窗口
app.isReady() ? onAppReady() : app.on('ready', onAppReady)
// 当检查到所有窗口都关闭时，就关闭软件
app.on('window-all-closed', () => {
    // 这里其实个人觉得。没太大必要，虽然这样处理和macos软件行为很类似
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// 监听新建窗口事件
app.on('browser-window-created', () => {
  console.log('window-created')
})
```
### windowManager.js
- services/windowManager.js中存放的则是对于窗口的自定义操作；在该项目中采用的是一个加载窗口作为加载展示，而当真正的窗口处于`dom-ready`的状态下关闭加载窗口站视真正的界面给用户使用。由于`dom-ready`状态的速度是取决于用户的硬盘读取速度，所以在代码中，我做了一个固定1.5s时长加载时间，让快到加载框都出不来的用户不会只看到一个闪现窗口。这个时间可以根据自身业务条件进行调整，个人建议0.5-1.5区间就好。
```javascript
import { BrowserWindow, Menu } from 'electron'
import menuconfig from '../config/menu'
import config from '@config'
import setIpc from './ipcMain'
import electronDevtoolsInstaller, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import upload from './checkupdate'
import DownloadUpdate from './downloadFile'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// 文件地址
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}` : `file://${__dirname}/index.html`
const loadingURL = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}/static/loader.html` : `file://${__static}/loader.html`
var loadWindow = null
var mainWindow = null

function createMainWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1700,
    minWidth: 1366,
    show: false,
    frame: config.IsUseSysTitle,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: process.env.NODE_ENV === 'development',
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    }
  })
  // 这里设置只有开发环境才注入显示开发者模式
  if (process.env.NODE_ENV === 'development') {
    menuconfig.push({
      label: '开发者设置',
      submenu: [{
        label: '切换到开发者模式',
        accelerator: 'CmdOrCtrl+I',
        role: 'toggledevtools'
      }]
    })
  }
  // 载入菜单
  const menu = Menu.buildFromTemplate(menuconfig)
  Menu.setApplicationMenu(menu)
  // 加载页面  
  mainWindow.loadURL(winURL)
  // 设置ipc
  setIpc.Mainfunc(mainWindow, config.IsUseSysTitle)
  // 加载更新方法
  upload.Update(mainWindow)
  DownloadUpdate.download(mainWindow)
  // 当处于开发环境时，加载vue-devtools
  if (process.env.NODE_ENV === 'development') {
    //   主窗口就绪之后，打开主窗口，关闭加载窗口
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.show()
      electronDevtoolsInstaller(VUEJS_DEVTOOLS)
        .then((name) => console.log(`installed: ${name}`))
        .catch(err => console.log('Unable to install `vue-devtools`: \n', err))
      loadWindow.destroy()
    })
    // 自动打开devtools窗口
    mainWindow.webContents.openDevTools(true)
  } else {
    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.show()
      loadWindow.destroy()
    })
  }
    // 当主窗口关闭时，释放资源
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function loadindWindow () {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: '#222',
    transparent: true,
    webPreferences: { experimentalFeatures: true }
  })

  loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)
    // 资源释放
    loadWindow.on('closed', () => {
    loadWindow = null
  })
}

function initWindow () {
  if (config.UseStartupChart) {
    return loadindWindow()
  } else {
    return createMainWindow()
  }
}
export default initWindow

```
::: tip 提示
在文件地址中，做了开发环境判断，由于是结合了webpack，所以在开发时候监听的是本地的一个地址+端口号，这个端口号，是我从node全局变量中获取的，至于这个端口号在哪里改，在稍微后面一些的时候我会告诉大家，这里默认的是9080端口，并且会识别默认端口有没有被占用若被占用则自动向后+1，直到25565。
:::
### downloadFile.js和checkupdate.js
这两个js都是可以用来下载更新得，但区别就在于，checkupdate中使用的是[electron-updater](https://www.electron.build/auto-update)，而downloadFile，看名字其实大家也能猜出来，它不只是可以用来更新，没错哦，它是使用了webContents的downloadURL方法，可以下载任何，你想下载的东西，只需要你给它传递好链接就好。
#### dowloadFile.js

- dowloadFile中参数详情

名称|参数|类型|说明
--|:--:|--:|:--|
version|无|String|版本信息，在本项目中是直接从package.json中获取版本号
baseUrl|无|String|下载地址前缀，您可以将url相同部分拆解开，设置成类似baseUrl+Url这样的组合
Sysarch|无|String|系统类型，使用os模块识别当前系统的位数区别
defaultDownloadUrL|无|String|默认下载链接，当没有外部传入下载链接时，默认使用js内部方法获取的下载地址
filePath|无|String|默认为系统的下载目录，默认代码中无法修改

- dowloadFile通讯详情

名称|参数|类型|说明
:--:|:--:|--:|:--|
start-download|downloadUrL|String|主进程监听通讯，用来监听渲染进程是否发送start-download同时接受一个可选参数downloadUrL，若没有该参数则默认使用defaultDownloadUrL
confirm-download|无|无|主进程发送通讯，当下载正常启动时，向渲染进程发送一个true值。
download-progress|无|无|主进程发送通讯，向渲染进程发送下载进度，默认整数。
download-paused|无|无|主进程发送通讯，当下载被意外或主动暂停时触发，向渲染进程发送true值。
download-done|无|无|主进程发送通讯，下载完成时触发，返回文件路径。
download-error|无|无|主进程发送通讯，下载失败时触发，向渲染进程发送true值。

#### checkupdate.js

- checkupdate中参数说明
只有一个向渲染进程发送UpdateMsg，参数为object，内包含一个state和msg；其中state中的值为：-1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成；当触发到4状态时，此时主进程中监听confirm-update，使用该名称即可触发重启更新功能。

### ipcMain.js
这里没啥好说的，这里面的话就是小封装了一个提示弹窗，一个错误弹窗，以及一些自定义头部需要调用到的窗口大小变化。
```javascript
import { ipcMain, dialog } from 'electron'
export default {
  Mainfunc (mainWindow, IsUseSysTitle) {
    ipcMain.on('IsUseSysTitle', (event) => {
      const data = IsUseSysTitle
      event.reply('CisUseSysTitle', data)
    })
    ipcMain.on('windows-mini', () => {
      mainWindow.minimize()
    })
    ipcMain.on('window-max', (event) => {
      if (mainWindow.isMaximized()) {
        event.reply('window-confirm', false)
        mainWindow.restore()
      } else {
        event.reply('window-confirm', true)
        mainWindow.maximize()
      }
    })
    ipcMain.on('window-close', () => {
      mainWindow.close()
    })
    // 参数说明见下表
    ipcMain.on('open-messagebox', (event, arg) => {
      dialog.showMessageBox(mainWindow, {
        type: arg.type || 'info',
        title: arg.title || '',
        buttons: arg.buttons || [],
        message: arg.message || '',
        noLink: arg.noLink || true
      }).then(res => {
        event.reply('confirm-message', res)
      })
    })
    ipcMain.on('open-errorbox', (event, arg) => {
      dialog.showErrorBox(
        arg.title,
        arg.message
      )
    })
  }
}

```
- 弹窗参数说明

名称|类型|说明
:--:|:--:|:--|
type|String|默认值：'info',可以为 "none", "info", "error", "question" 或者 "warning". 在 Windows 上, "question" 与"info"显示相同的图标, 除非你使用了 "icon" 选项设置图标。 在 macOS 上, "warning" 和 "error" 显示相同的警告图标
title|String|message box 的标题，一些平台不显示.
buttons|Array[String]|按钮的文本数组。在 Windows 上, 空数组在按钮上会显示 "OK".
message|String|message box 的内容.
noLink|Boolean|别问为啥是true，问就是自己设置成false试一试。 (´・ω・`)

- DisableButton和menu就真的没啥好说的了，直接去项目中看代码就好，一个是注册全局快捷键禁用F12的示例一个是顶部菜单栏的示例。