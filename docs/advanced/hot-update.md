# 热更新

**热更新可以不需要重新下载安装的情况下更新渲染进程的内容，主进程也是允许的，但是需要确保没有添加或者删除原生依赖（.node 后缀）**

若要启用热更新你需要做以下准备

**在 config/index.ts 文件中的 build 对象找到` hotPublishUrl` `hotPublishConfigName `**

1. 需要一个能够无权限访问的公网地址；类型为域名、ip、有无 https 都可以

2. 设置 hotPublishUrl，该参数应为完整的 url,比如`https://www.xxxxx.com`

3. 设置 hotPublishConfigName，该参数为拼接在 url 后面的文件名称，是热更新的下载配置文件

例如：

```sh
# 若hotPublishUrl值为：https://www.xxxxx.com
# 若hotPublishConfigName值为：update-config
# 最终得到的热更新链接为
https://www.xxxxx.com/update-config.json
```

**此处给出完整 url 的拼接规则是为了让你能够检查该 url 是否可用**

4. 执行`build`命令，等待命令完成后，执行`pack:resources`命令

例如

```sh
yarn build
# 一些控制台输出，等待成功
yarn pack:resources
# 若打包成功资源，此处会显示如下输出，其中文件位置，为热更新打包产物位置
# The resource file is packaged!
# File location: "文件位置"
```

5. 请在第四步控制台输出的文件目录中找到第三步中`hotPublishConfigName`的值对应的 json 文件和同级目录下的`.zip`压缩包一同放到`hotPublishUrl`所指向的服务器目录中

6. 在渲染进程中调用`ipcRenderer.invoke("hot-update")`方法即可启动热更新程序

例如

```TypeScript
// 省略部分代码
checkUpgrade(){
    // 请注意，ipcRenderer为electron提供的ipcRenderer方法
    ipcRenderer.invoke("hot-update")
}
```

7. 通过`ipcRenderer.on("hot-update-status")`即可监听到热更新程序的状态，该事件的值和对应原因如下表

```TypeScript
type updateInfo = {
    status: string,
    message: string
}
// 省略部分代码
checkUpgrade(){
    // 请注意，ipcRenderer为electron提供的ipcRenderer方法
    ipcRenderer.on("hot-update-status",(event:IpcRendererEvent, msg:updateInfo) => {
        switch (msg.status) {
            case "downloading":
            //   正在下载
            break;
            case "moving":
            //   正在移动文件
            break;
            case "finished":
            //   完成更新
            break;
            case "failed":
            //   更新失败
            break;

            default:
            break;
        }
    })
}
```

|  状态类型   |    类型    | 说明                                  |
| :---------: | :--------: | :------------------------------------ |
|    init     | updateInfo | 初始化                                |
| downloading | updateInfo | 正在下载文件                          |
|   moving    | updateInfo | 正在移动文件                          |
|  finished   | updateInfo | 已完成                                |
|   failed    | updateInfo | 失败，原因在 updateInfo 的 message 中 |

::: tip 提醒
若你想体验热更新功能，你可以通过修改你的`package.json`的`version`对象，让它的值小于 1.0.0，然后修改渲染进程内的一些文件，能够看出和原仓库有明显区别之后，运行`yarn build:dir`命令，在打包完成以后，启动项目并点击检查热更新，即可看到效果。

目前暂时只支持走 github 的 page server，可能会因为你的地域限制，导致无法访问，如果你愿意等待，我将会在后续推出码云版本，若你需要马上看到效果，则你可能需要一些魔法。（欸嘿~）
:::
