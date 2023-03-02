# 跨域问题
>跨域：即触发了浏览器的同源策略即请求的时候出现： `Access to XMLHttpRequest at ***`
::: tip 
针对跨域问题，这一点在electron中其实无需担心，理解跨域产生问题的前端小朋友们应当知道这是浏览器造成的，此时我们只需要在主进程创建窗口位置设置一个值即可（electron版本高于4.x.x）即webPreferences中的webSecurity选项
；将其设置为false就好了，至于为何事高于4.x.x呢，因为在低于该版本中，electron团队已经默认将其设置为false
:::

但是你可能会在使用webview标签或者是子窗口的时候还是会遇到跨域问题，此时你需要在新建窗口时同样关闭该选项即可。
