# 调用c++原生dll
通常在很多时候使用electron中，我们不止只是使用了前端的一些东西，相对的包括我们可能有些代码不想使用js来处理，等种种原因，需要我们去调用c++写的dll库。

```bash
npm install ffi-napi
```

首先安装ffi-napi，由于原本的node-ffi已经一年没有更新了，导致无法和electron的新版本兼容，让很多人在使用它的时候，都只能被迫降级到4.x，但是又不能享受新版electron带来的便利，这个库完美的解决了我们的问题。

::: tip 提示
当前项目中并没有附加该依赖，鉴于并不是所有人都会有这个需求。下面内容中将会出现修改webpack配置文件以及package.json文件来实现正常工作。
:::

- 如何使用？
    - 首先确保您已经生成正确的dll文件；并且已经安装了ffi-napi。
    - 在static同级目录内创建一个文件夹，名字自取；然后修改`config/index.js`中的`DllFolder`对象，它接受字符串类型，是你刚刚创建的文件夹名称。
    - 然后放置你的dll文件到你新创建的文件夹内重启一次，然后就可以按照一下方法进行调用了
    - 打包前，请去package.json文件找到`extraFiles`数组，并且在内填入你刚刚创建的文件夹名称，同样也是字符串
    ```JavaScript
    // 调用
    import ffi from "ffi-napi"

    const dll = ffi.Library(`${__lib}/文件名.后缀`, {
          // 这里是c++中对js暴漏的方法，举个例子：
          // 这里是c++中暴漏了一个名为test的方法，它接受两个int类型，返回结果也是int类型
          'test':['int'['int','int']]
        })
        // 假设该c++中的方法是相加并抛出结果，那么这里得出的结果应该是4
        dll.test(1,3)
    ```
    > 此处假设我dll放置目录的名称叫lib
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
    当您觉得`_lib`作为dll的全局文件夹变量不太好时，您可以去`.electron-vue/webpack.renderer.config.js`和`src/index.ejs`中搜索`__lib`关键词，并将其修改成你所喜欢的即可。但是这是极度不建议的，因为您并不知道这么做所带来的后果，他可能包括但不限于：打包之后dll调用失败，dll位置丢失，dev无法启动等一系列连锁反应
    :::
- 但开发途中是绝对不会这么一帆风顺的，就我在摸索的时候，遇到的问题总结如下：
    - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 126`
    - A：该报错是由于dll文件位置不对引起的，文件路径是否和上面一样，否则您需要使用绝对路径。
    - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 193`
    - A：dll位数不对导致的，32位dll只能给32位程序使用，64位只能给64位程序使用，二者不可混合使用。
    - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 127`
    - A：该报错是由于在js中声明了c++中没有的方法导致的，请注意c++中暴漏的函数名；或者是当前dll引用了其他资源文件它没有加载成功。
    - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 1114`
    - A：该报错是在打包时，dll释放位置错误，导致程序去c盘查找后无果得到的dll丢失错误。（后面会谈这个打包之后的dll问题）
    - Q：控制台报错：`Uncaught (in promise) Error: \\?\C:\Users\zhang\Desktop\electron-vue-template\node_modules\ref-napi\build\Release\binding.node is not a valid Win32 application.
\\?\C:\Users\zhang\Desktop\electron-vue-template\node_modules\ref-napi\build\Release\binding.node`
    - A：这种错误通常出现在你打包过一次之后发生，此时你只需要去你的node_modules/ffi-napi文件夹内重新执行一次npm install或者yarn install即可解决。