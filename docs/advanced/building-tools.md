# webpack指南
>在本项目中使用了webpack5，如果您还不了解的话，可以先去查看[webpack官方文档](https://webpack.js.org/)，或者查看我的[webpack4入门](https://umbrella22.github.io/WebpackLearnOfVue-site/)，这样就不至于您在查看本指南时，不知道我在说什么了。

## 文件结构
```
└─.electron-vue                     # webpack配置目录
   ├─build.js                       # build时使用
   ├─dev-runner.js                  # dev时使用
   ├─webpack.main.config.js         # 主进程使用的webpack配置文件
   └─webpack.renderer.config.js     # 渲染进程使用的webpack配置文件
```
原项目中锁定端口为9080，所以我使用`portfinder`改进了这一问题，但是带来的另一个问题就是首次启动编译缓慢，不过问题不大，毕竟有得必有失，这一改动只是损失了首次启动时编译时间。

::: warning 注意
在renderer配置文件中，你们也许看到了，我将element和vue放入白名单模块中，因为如果在electron中不这样设置，让webpack进行打包的话，会导致element的表格出不来，以及其他的玄学问题。
:::