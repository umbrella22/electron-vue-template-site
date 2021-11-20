# 构建和发布
借助强大得electron-bulider您只需要执行npm run build命令即可开始编译您当前操作系统适用的安装包
:::tip 提示
需要注意的是，无论哪一个平台在编译的时候，都会下载一次打包依赖，当然这只会在你第一次构建项目时发生。
在设置过镜像以后，无需担心下载问题。
:::
## 构建出web版本
当您使用yarn build:web或npm run build:web时，您应当注意的是，在web环境下是不可以存在任何和electron相关得api调用，您可以在前端中通过`process.env.IS_WEB`来判断当前运行环境是否处于非electron。
## 环境变量
在本项目中，已经在config/index.js中导入了两个状态，dev为开发环境，prod为生产环境，而axios的baseURL同样也是出于该文件夹中的dev.env.js和prod.env.js中，而在index中，您应当遵守内部的文件结构进行您自己的一些变量控制，本项目自带的有在dev下的默认端口，关闭electron垃圾信息输出，以及，控制台部分输出中文化（笑~）

- config/index.js中的参数说明

环境名:名称|类型|默认值|说明
:--:|:--:|:--:|:--|
build:DisableF12|Boolean|true|是否注册全局快捷键禁用F12
dev:removeElectronJunk|Boolean|true|是否关闭electron垃圾输出
dev:chineseLog|Boolean|false|是否启用部分中文控制台输出
dev:port|Number|9080|开发时得默认端口
UseStartupChart|Boolean|true|是否启用启动动画
IsUseSysTitle|Boolean|true|是否使用系统自带得标题栏

## builder配置文件说明
在该项目中，继承了原项目得单个package.json得优势，它将builder中得配置文件添加进了package.json中的build对象里大概是这样得
```json
  "build": {
    "publish": [
      {
        "provider": "generic",
        "url": "http://127.0.0.1"
      }
    ],
    "productName": "electron-vue-admin",
    "appId": "org.Sky.electron-vue",
    "directories": {
      "output": "build"
    },
    "files": [
      "dist/electron/**/*"
    ],
    "dmg": {
      "contents": [
        {
          "x": 410,
          "y": 150,
          "type": "link",
          "path": "/Applications"
        },
        {
          "x": 130,
          "y": 150,
          "type": "file"
        }
      ]
    },
    "mac": {
      "icon": "build/icons/icon.icns"
    },
    "win": {
      "icon": "build/icons/icon.ico",
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64",
            "ia32"
          ]
        }
      ]
    },
    "linux": {
      "icon": "build/icons"
    }
  }
```
:::tip 提示
在win对象中，当前分支代码均剔除了arch对象，若您需要一次打包双位安装版，请自行添加。
:::
## 发布时，减少打包后文件大小
发布时您可能已经注意到安装包大小为40 - ∞ MB 因受限于chromium，安装包无法压缩到30M以下；所以安装包在30-50MB大小请勿惊慌，这是正常大小。

而包大小在builder打包以后仍然在70-100MB并且页面和功能实际上没有那么多时，此时您需要注意：

- 依赖是否都在`package.json`的`dependencies`对象中，如果是，请移除所有非runtime的依赖，builder会将`dependencies`对象中的所有依赖及其附属依赖全部打包起来，这就造成了明明没有写多少代码，却将整个node_module打包进来，软件本身无缘无故增加了几百兆。
-  在builder配置文件中我设置了win默认打包出32位和64位的集合包，这也会造成软件打包出来默认就100M了因为是一个二合一的安装包(新版本已经去除这个设置)
若不想升级和自己去除的话，找到builder配置的`win -> target`删除arch对象即可，去除以后默认运行build命令时，则会只打包当前打包机的操作系统位数包。
- 一些不需要立刻用到的资源可以放到服务器上，等到用户需要使用时再进行按需下载，比如：字体文件，一些不是很急用的图片，音频文件；或是使用nsis编写在线安装程序，下载以后再进行安装对用户进行一些善意的欺诈行为是允许的。
:::tip 提示
介于webpack的打包，其实在渲染和主进程中只要没有引用到有关于node的模块其实是都可以不放在`dependencies`对象中的，因为webpack会正常打包所有你需要的代码进编译后的代码中，而一些node模块则无法被处理，这也是强调用到的node模块需要放在`dependencies`对象中的理由；规范使用`package.json`中的`devDependencies`和`dependencies`对减少包文件大小很有利。
:::
