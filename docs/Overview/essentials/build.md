# 构建和发布
借助强大得electron-bulider您只需要执行npm run build命令即可开始编译您当前操作系统适用的安装包
:::tip 提示
需要注意的是，无论哪一个平台在编译的时候，都会下载一次打包依赖，当然这只会在你第一次构建项目时发生。
本项目只提供了win平台的打包依赖，在[这里](https://gitee.com/Zh-Sky/HardToDownloadLib)文件夹中，使用方法在压缩包内，自己看~
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
    "appId": "org.simulatedgreg.electron-vue",
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