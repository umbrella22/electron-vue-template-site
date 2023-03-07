# 调用 c++原生 dll

通常在很多时候使用 electron 中，我们不止只是使用了前端的一些东西，相对的包括我们可能有些代码不想使用 js 来处理，等种种原因，需要我们去调用 c++写的 dll 库。
::: danger 请注意
在 electron22 版本以后，electron 官方开启了进程沙盒模式，这将导致 ffi-napi 不可用，如果要使用请注意您的 electron 版本
:::
::: warning 注意
安装前，请自行检查您有没有安装以下可能需要用到的依赖：

- 全平台
  - Python v2.7, v3.5, v3.6, v3.7, or v3.8 (并设置了环境变量)
- windows 平台
  - [windows-build-tools](https://www.npmjs.com/package/windows-build-tools/v/2.0.0)
- macOS
  - Xcode
- linux or unix
  - make
  - c/c++编译器工具，例如[GCC](https://gcc.gnu.org/)

:::

```bash
npm install ffi-napi
```

首先安装 ffi-napi，由于原本的 node-ffi 已经一年没有更新了，导致无法和 electron 的新版本兼容，让很多人在使用它的时候，都只能被迫降级到 4.x，但是又不能享受新版 electron 带来的便利，这个库完美的解决了我们的问题。

::: tip 提示
当前项目中并没有附加该依赖，鉴于并不是所有人都会有这个需求。下面内容中将会出现修改 webpack 配置文件以及 package.json 文件来实现正常工作。
:::

- 如何使用？

  - 首先确保您已经生成正确的 dll 文件；并且已经安装了 ffi-napi。
  - 在 static 同级目录内创建一个文件夹，名字自取；然后修改`config/index.js`中的`DllFolder`对象，它接受字符串类型，是你刚刚创建的文件夹名称。
  - 然后放置你的 dll 文件到你新创建的文件夹内重启一次，然后就可以按照一下方法进行调用了
  - 打包前，请去 package.json 文件找到`extraFiles`数组，并且在内填入你刚刚创建的文件夹名称，同样也是字符串

### 主进程中使用

```js
// 主进程中调用
import ffi from "ffi-napi";

const dll = ffi.Library(`${process.env.libPath}/文件名.后缀`, {
  // 这里是c++中对js暴漏的方法，举个例子：
  // 这里是c++中暴漏了一个名为test的方法，它接受两个int类型，返回结果也是int类型
  test: ["int"[("int", "int")]],
});
// 假设该c++中的方法是相加并抛出结果，那么这里得出的结果应该是4
dll.test(1, 3);
```

### 渲染进程中使用（无非必要，不推荐）

```js
// 渲染进程中调用
import ffi from "ffi-napi";

const dll = ffi.Library(`${__lib}/文件名.后缀`, {
  // 这里是c++中对js暴漏的方法，举个例子：
  // 这里是c++中暴漏了一个名为test的方法，它接受两个int类型，返回结果也是int类型
  test: ["int"[("int", "int")]],
});
// 假设该c++中的方法是相加并抛出结果，那么这里得出的结果应该是4
dll.test(1, 3);
```

> 此处假设我 dll 放置目录的名称叫 lib

```json
"build": {
    "extraFiles": [
    "lib"
    ],
}
```

::: warning 注意
`__lib`是不可被修改，因为本框架已经做了预先处理，所有的`__lib`均指向你在`config/index.js`文件中设置的`DllFolder`值。`记住它接受一个字符串`
:::
::: danger 警告
当您觉得`_lib`作为 dll 的全局文件夹变量不太好时，您可以去`.electron-vue/webpack.renderer.config.js`和`src/index.ejs`中搜索`__lib`关键词，并将其修改成你所喜欢的即可。但是这是极度不建议的，因为您并不知道这么做所带来的后果，他可能包括但不限于：打包之后 dll 调用失败，dll 位置丢失，dev 无法启动等一系列连锁反应
:::

- 但开发途中是绝对不会这么一帆风顺的，就我在摸索的时候，遇到的问题总结如下：
  - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 126`
  - A：该报错是由于 dll 文件位置不对引起的，文件路径是否和上面一样，否则您需要使用绝对路径。
  - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 193`
  - A：dll 位数不对导致的，32 位 dll 只能给 32 位程序使用，64 位只能给 64 位程序使用，二者不可混合使用。
  - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 127`
  - A：该报错是由于在 js 中声明了 c++中没有的方法导致的，请注意 c++中暴漏的函数名；或者是当前 dll 引用了其他资源文件它没有加载成功。
  - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 1114`
  - A：该报错是在打包时，dll 释放位置错误，导致程序去 c 盘查找后无果得到的 dll 丢失错误。（后面会谈这个打包之后的 dll 问题）
  - Q：控制台报错：`Uncaught (in promise) Error: \\?\C:\Users\%userName%\Desktop\electron-vue-template\node_modules\ref-napi\build\Release\binding.node is not a valid Win32 application. \\?\C:\Users\%userName%\Desktop\electron-vue-template\node_modules\ref-napi\build\Release\binding.node`
  - A：这种错误通常出现在你打包过一次之后发生，此时你只需要去你的 node_modules/ffi-napi 文件夹内重新执行一次 npm install 或者 yarn install 即可解决。
