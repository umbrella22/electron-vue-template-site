# 热更新
::: tip 提示
目前仅[vite-template项目](https://github.com/umbrella22/electron-vite-template)可用，vue-template仍在测试。
:::

- hotPublishUrl为完整的url,比如`https://www.xxxxx.com` 
- hotPublishConfigName则是拼接在url后面的文件名称，完整示例`https://www.xxxxx.com/updater.json`；其中`updater`为hotPublishConfigName

## 需要一个能够无权限访问得地址。

- 在运行完build命令以后在项目目录执行`node .electron-vite/hot-updater.js`
- 等待命令完成以后，您会在`build\update\update`路径中找到您设置过得`hotPublishConfigName`的一个json文件，请将它和目录同级得`.zip`文件一起存放到您的文件服务器目录.
- 之后在渲染进程内通过`ipcRenderer.invoke("hot-update")`来启动热更新程序。然后在渲染进程中通过`ipcRenderer.on("hot-update-status")`即可监听到热更新的状态，如果没有任何意外，该ipc则会返回`finished`，表示热更新已完成，您就可以提示用户重启或者自行重启即可应用更新。但是若有错误，该ipc则会返回`failed`状态并在`message`对象中一并返回错误信息。

