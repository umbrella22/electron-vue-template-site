# 多窗口
在本框架中，Vue-router使用的是哈希模式，但当前模式下，无法进行像history模式那样随心所欲的通过url打开链接，让我们使用新建窗口url跳转大法失败了；这样就只能想一个其他办法了，那就是新建一个窗口，然后通过拼接的形式来进行url跳转，而且多窗口之间可共享localStorage。是不是很令人振奋，更令人激动的是，要启用该功能几乎不用做任何准备，只需要您在您需要开启的位置使用：
```js
// this.$ipcApi是封装好了的的ipcRenderer
      this.$ipcApi.send("open-win", {
        url:'/form/index'
      });
```
> see，一行代码即可，其中url就是路由的path。

当然，只实现这一个功能未免太过寒酸，下面是该ipc通道可传递参数
名称|类型|默认值|说明
:--:|:--:|:--:|:--|
url|String|""|router中的path
sendData|Object|{}|向开启的子窗口中发送信息，子窗口内请监听名称为：send-data的ipc通道
IsPay|Boolean|false|当前窗口是否为支付窗口
PayUrl|String|""|微信 / 支付宝支付回调地址中标识字段。

其中子窗口允许你弹窗来展示应用内支付的窗口，并且当回跳到您自己设置的回调地址时会自动关闭窗口。