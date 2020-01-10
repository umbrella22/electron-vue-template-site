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
- dowloadFile中通讯以及参数详情

名称|参数|类型
--|:--:|--:
satrt-download|downloadUrL|String
version|无|String
baseUrl|无|String