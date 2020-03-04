# 调用c++原生dll
通常在很多时候使用electron中，我们不止只是使用了前端的一些东西，相对的包括我们可能有些代码不想使用js来处理，等种种原因，需要我们去调用c++写的dll库。

```bash
npm install ffi-napi
```

首先安装ffi-napi，由于原本的node-ffi已经一年没有更新了，导致无法和electron的新版本兼容，让很多人在使用它的时候，都只能被迫降级到4.x，但是又不能享受新版electron带来的便利，这个库完美的解决了我们的问题。

::: tip 提示
当前项目中并没有附加该依赖，鉴于并不是所有人都会有这个需求。下面内容中将会出现修改webpack配置文件来实现正常工作
:::

- 如何使用？
    - 首先确保您已经生成正确的dll文件；将其放入static文件夹中，由于框架本身完全接管了static的路径，所以您可以直接使用别名如下，
    ```JavaScript
    import ffi from "ffi-napi"

    const dll = ffi.Library(`${__static}/文件名.后缀`, {
          // 这里是c++中对js暴漏的方法，举个例子：
          // 这里是c++中暴漏了一个名为test的方法，它接受两个int类型，返回结果也是int类型
          'test':['int'['int','int']]
          
        })
        // 假设该c++中的方法是相加并抛出结果，那么这里得出的结果应该是4
        dll.test(1,3)
    ```
- 但开发途中是绝对不会这么一帆风顺的，就我在摸索的时候，遇到的问题总结如下：
    - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 126`
    - A：该报错是由于dll文件位置不对引起的，文件路径是否和上面一样，否则您需要使用绝对路径。
    - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 193`
    - A：dll位数不对导致的，32位dll只能给32位程序使用，64位只能给64位程序使用，二者不可混合使用。
    - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 127`
    - A：该报错是由于在js中声明了c++中没有的方法导致的，请注意c++中暴漏的函数名；或者是当前dll引用了其他资源文件它没有加载成功。
    - Q：控制台报错：`Uncaught Error: Dynamic Linking Error: Win32 error 1114`
    - A：该报错是在打包时，dll释放位置错误，导致程序去c盘查找后无果得到的dll丢失错误。（后面会谈这个打包之后的dll问题）
    