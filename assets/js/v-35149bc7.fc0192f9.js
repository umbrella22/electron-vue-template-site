"use strict";(self.webpackChunkelectron_vue_template_doc=self.webpackChunkelectron_vue_template_doc||[]).push([[615],{9028:(e,s,n)=>{n.r(s),n.d(s,{data:()=>r});const r={key:"v-35149bc7",path:"/Overview/essentials/renderer-process.html",title:"渲染进程介绍",lang:"en-US",frontmatter:{},excerpt:"",headers:[{level:2,title:"关于vue全家桶",slug:"关于vue全家桶",children:[{level:3,title:"vue-router",slug:"vue-router",children:[]},{level:3,title:"vuex",slug:"vuex",children:[]}]},{level:2,title:"用到的其他插件",slug:"用到的其他插件",children:[{level:3,title:"svg-sprite-loader",slug:"svg-sprite-loader",children:[]},{level:3,title:"axios（网络请求）",slug:"axios-网络请求",children:[]}]}],git:{updatedTime:1677743789e3},filePathRelative:"Overview/essentials/renderer-process.md"}},9301:(e,s,n)=>{n.r(s),n.d(s,{default:()=>x});var r=n(6252);const a=(0,r.uE)('<h1 id="渲染进程介绍" tabindex="-1"><a class="header-anchor" href="#渲染进程介绍" aria-hidden="true">#</a> 渲染进程介绍</h1><div class="custom-container tip"><p class="custom-container-title">说明</p><p>由于 Electron 使用 Chromium 显示网页，那么，Chromium 的多进程架构也被使用。Electron 中的每个网页都在自己的进程中运行，称为渲染器进程 (renderer process)。</p><p>在正常的浏览器中，网页通常运行在沙盒封装化的环境中，并且不允许访问本机资源。然而，Electron 用户有权在网页中使用 Node.js 的 API，从而允许较低级别的操作系统交互。</p></div><blockquote><p>选自 Electron 文档</p></blockquote><h2 id="关于vue全家桶" tabindex="-1"><a class="header-anchor" href="#关于vue全家桶" aria-hidden="true">#</a> 关于vue全家桶</h2><div class="custom-container warning"><p class="custom-container-title">提示</p><p>需要强调一点，如非必要（比如组件附加依赖），请不要在vue中使用jq，对于任何非vue体系内的的库对vue进行更改，vue都无法检测并且做出对应的响应！（就如同你的房间在被别人整理之后你就找不到你自己放的东西）</p></div><p>我们推崇使用组件的形式来构建您的应用，组件可以使我们的大型并且复杂的应用程序源码更加有组织化，并且每个组件均拥有封装属于自己的css和js，互不干涉。</p><ul><li>渲染进程目录components文件夹中，当然这里只是存放复用次数非常多的的组件，而当每个页面自己的组件时，推荐在该页面中新建一个components文件夹，这样便于分开存放和管理。</li></ul><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code> └─renderer                  # 渲染进程文件夹\n     ├─api                   # 请求以及数据库操作文件夹\n     ├─assets                # 渲染进程主题 字体等静态资源\n     ├─components            # 全局公用组件\n     ├─icons                 # 项目所有 svg icons\n     ├─layout                # 全局 layout\n     ├─router                # 路由\n     ├─store                 # 全局 store管理\n     ├─styles                # 全局样式\n     ├─tools                 # 全局特定工具\n     ├─utils                 # 全局公共方法\n     └─views                 # views 所有页面\n</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">提示</p><p>需要注意的是在这里的assets和外部的static虽然都是存储静态资源但是二者是不一样的，就如同在vue脚手架中二者的区别一样。</p></div><h3 id="vue-router" tabindex="-1"><a class="header-anchor" href="#vue-router" aria-hidden="true">#</a> vue-router</h3><p>在使用了vue之后您应当遵循使用vue的路由功能来进行界面切换，再非必要情况下请不要试图使用a标签开启新的窗口然后进行其他的页面操作，这是不被推荐的。当然如果您有这些需求也请您使用主进程中的<code>new BorwserWindow</code>方法进行窗口新建而不是直接使用a标签开启新的页面，这样便于您管理您的窗口。</p>',11),t=(0,r.Uk)("而在router文件夹中您可能会发现我并没有将路由表写进index.js中，我推荐将路由表分开来进行依次导入，这样就可以避免index.js文件非常的臃肿，而在路由表中我写了非常详细的讲解为何我的路由表是如此结构。如果有无法理解的地方还请复习一次"),l={href:"https://router.vuejs.org/zh/",target:"_blank",rel:"noopener noreferrer"},i=(0,r.Uk)("vue-router"),o=(0,r._)("div",{class:"custom-container warning"},[(0,r._)("p",{class:"custom-container-title"},"注意"),(0,r._)("p",null,[(0,r.Uk)("当使用了vue-router之后，"),(0,r._)("strong",null,"请不要将mode设置为历史模式！"),(0,r.Uk)(" 此模式严格用于通过 http 协议提供文件，并且不能正常使用 file 协议，但是 electron 在产品构建中无法使用此协议提供文件。所以默认的 hash 模式正是我们所需要的。")])],-1),u=(0,r._)("h3",{id:"vuex",tabindex:"-1"},[(0,r._)("a",{class:"header-anchor",href:"#vuex","aria-hidden":"true"},"#"),(0,r.Uk)(" vuex")],-1),c=(0,r._)("p",null,[(0,r.Uk)("Vuex 是一个专为 Vue.js 应用程序开发的 "),(0,r._)("strong",null,"状态管理模式"),(0,r.Uk)(" 。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。")],-1),d=(0,r.Uk)("在该项目中，vuex均以模块化的形式存储在store/modules中而且在该文件夹中，我们使用index.js对本文件夹内除它之外的所有js以模块的形式加载并挂载，您若要新增模块可以直接新建一个js复制template中的内容，并修改对外导出名即可。（如果您不知道如何更改，还请您重新复习一次"),p={href:"http://es6.ruanyifeng.com/",target:"_blank",rel:"noopener noreferrer"},h=(0,r.Uk)("es6"),v=(0,r.Uk)("）"),m=(0,r.uE)('<h2 id="用到的其他插件" tabindex="-1"><a class="header-anchor" href="#用到的其他插件" aria-hidden="true">#</a> 用到的其他插件</h2><h3 id="svg-sprite-loader" tabindex="-1"><a class="header-anchor" href="#svg-sprite-loader" aria-hidden="true">#</a> svg-sprite-loader</h3><p>该webpack插件用来挂载icons中的svg文件夹内的.svg图标文件，如果想要使用得话，您需要 <code>&lt;svg-icon icon-class=&quot;名称&quot;&gt;&lt;/svg-icon&gt;</code>该标签就可以使用了，不用担心挂载问题，在icon/index.js中，我们已经将其挂载到全局组件中了，您可以在项目任意位置使用到它。</p><h3 id="axios-网络请求" tabindex="-1"><a class="header-anchor" href="#axios-网络请求" aria-hidden="true">#</a> axios（网络请求）</h3><p>axios，在非electron的时候，小伙伴们应该很清楚，这个是基于promise的http请求，至于为什么将它单独拿出来说是因为，18版本和19版本在electron上表现差异非常大。18版本无论是在普通web端还是electron端它都不会使用node适配器，而在到了19就不一样了由于electron中自带了node环境，则axios会优先选择node适配器，而在node适配器中，form表单则会表现不太一样，另外再使用node适配器之后，所有请求将不会在electron的控制台中出现，它们都会直接走electron的net模块，既然直接走的是net模块相比你也已经联想到，它似乎不受Chromium的6个并发数请求限制了？emm，并没有做测试，但是既然没有从Chromium控制台出现的话，那想必也不会占用到图片和字体等这类的请求数，实际上，还是有很多优点的。如果不太喜欢的话可以手动切换axios的适配器或者直接回退到18.1版本即可。</p><p>本项目中我已经封装好了axios拦截器以及baseURL相关的配置在utils/request.js文件中，在axios请求接受拦截器中我添加了预处理示例，您可以自行删除那个判断res.data.code的判断，这只是个示例而已。 并且在错误回调中我对超时进行了拦截处理。</p>',6),b={},x=(0,n(3744).Z)(b,[["render",function(e,s){const n=(0,r.up)("ExternalLinkIcon");return(0,r.wg)(),(0,r.iD)(r.HY,null,[a,(0,r._)("p",null,[t,(0,r._)("a",l,[i,(0,r.Wm)(n)])]),o,u,c,(0,r._)("p",null,[d,(0,r._)("a",p,[h,(0,r.Wm)(n)]),v]),m],64)}]])},3744:(e,s)=>{s.Z=(e,s)=>{const n=e.__vccOpts||e;for(const[e,r]of s)n[e]=r;return n}}}]);