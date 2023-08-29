
# 热更新

**前面只更新渲染进程的增量更新已经满足大部分人的需求了，但是还是有下面的几点满足不了所有人。**

## 只更新更新渲染进程内容的不足

1. 不能更新原生依赖，不能更新`electron`版本、不能更新其他额外文件等等不足

2. 不能开启`asar`

3. 不能只下载发生变更的文件，更新的颗粒度不够细

## 另外的方法

1. 可以通过`electron` 对于加载`default_app.asar`、`app.asar`、和`app`目录有限级别的不同，实现对开启`asar`的程序进行热更、但还是无法实现`electron`版本更新, 还需要多次重启


## 优点

1. 可以更新`electron`的版本

2. 可以开启`asar`

3. 方便版本回退

4. 精细化更新，只更新变更的文件

## 缺点

1. 多一个专门使用`rust`编写的应用程序[updater](https://github.com/mashirooooo/electron_updater)

2. 复杂度稍微有点提高



## 配置`updateConfig.json`, 生成


|  配置项   |    类型    | 说明                                  |
| :---------: | :--------: | :------------------------------------ |
|    output     | string | `npm run pack:rustUpdater`产物基础输出目录                                |
| target | string | 新版本所有文件gzip压缩后存放的路径                          |
|   updateJsonName    | string | 新版本信息                          |
|  version   | string | 新版本version                                |
|   tempDirectory    | string | 更新的目录 |
|   oldDirectory    | string | 旧版本的文件迁移地址，可以方便版本回退 |
|   url    | string | 更新的url |
|   updaterName    | string | 更新器名称 |


## 更新流程

1. 获取更新程序[electron_updater](https://github.com/mashirooooo/electron_updater/releases)可以获取对应的版本

2. 将文件重命名为配置项的`updaterName`

3. 通过脚本，将不同系统的更新程序`copy`到`unpacked`目录里面，参考脚本[.electron-vite/builderHook/copyFileHook.js](https://github.com/umbrella22/electron-vite-template/blob/main/.electron-vite/builderHook/copyFileHook.js)

4. 当程序发布新版本时，调用`npm run pack:rustUpdater`生成当前的版本信息`update-config.json`即配置里面的`updateJsonName`，里面包含最新的版本号、每个必须文件的sha256信息和路径,和一个所有必须文件的gzip压缩的文件夹`gzip1.0.0`，即配置的 `target` + `version`; 

5. 旧版程序通过配置上的`url`配置访问`url`目录下的`update-config.json`

6. 实例化`UpdateElectron`

| 参数              | 类型              | 描述                                                                                     |
|------------------|------------------|-----------------------------------------------------------------------------------------|
| statusCallback   | (res: UpdateInfo) | 用于回调内部消息，一般情况下用不到                                                       |
| updaterName      | string           | 更新 Updater 名称                                                                      |
| version          | string           | 当前版本号                                                                               |
| exePath          | string           | 当前 exe 路径 `app.getPath('exe')`                                                       |
| tempDirectory    | string           | 临时目录                                                                                |
| updateConfigName | string           | 更新配置文件名称                                                                         |
| updateJson       | UpdateJson       | 更新配置文件                                                                             |
| baseUrl          | string           | 更新下载 gzip 的基本地址 `${url}/${target}${version}`                            |
| downloadFn       | DownloadFn       | 下载函数                                                                                 |
| options          | HashElementOptions | 通过 options 配置文件排除文件夹或指定后缀 `folders: { exclude: ['.*', 'node_modules', 'test_coverage'] }, files: { exclude: ['*.js', '*.json'] }` |

```js
// 获取到的update-config.json的内容
const res = await request({ url: `${updateConfig.url}/${updateConfig.updateJsonName}.json`, })
const updateJson: UpdateJson = res.data;
// 获取临时路径
const dirDirectory = join(app.getAppPath(), '..', '..');
const tempDirectory = join(dirDirectory, updateConfig.tempDirectory);
// 下载函数
const downloadFn = async (url: string): Promise<Readable> => {
  const response = await request({
    method: 'get',
    url: url,
    responseType: 'stream',
  });
  return response.data;
}

// 通过 options 配置文件排除文件夹或指定后缀 防止有些东西被覆盖
const options = {files: {}}
const updateElectron = new UpdateElectron(statusCallback, updateConfig.updaterName, updateConfig.version, app.getPath('exe'), tempDirectory, updateConfig.updateJsonName, updateJson, `${updateConfig.url}/${updateConfig.target + updateJson.version}`, downloadFn, options)

```

7. 获取新版信息，如果存在版本号更新，则进入更新逻辑

8. 下载对应的文件到临时目录上

9. 调用更新

10. 退出程序 `app.quit()`，必须手动调用，否则可能权限不够，更新程序结束不了该进程

11. 等程序自动重启

详细代码参考[src/main/services/HotUpdaterTest.ts](https://github.com/umbrella22/electron-vite-template/blob/main/src/main/services/HotUpdaterTest.ts)


## 相关项目代码

[https://github.com/mashirooooo/window_updater_node](https://github.com/mashirooooo/window_updater_node) 

[https://github.com/mashirooooo/electron_updater](https://github.com/mashirooooo/electron_updater)

**欢迎issue和pr**