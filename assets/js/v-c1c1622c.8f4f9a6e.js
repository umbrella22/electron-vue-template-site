"use strict";(self.webpackChunkelectron_vue_template_doc=self.webpackChunkelectron_vue_template_doc||[]).push([[406],{3398:(e,t,n)=>{n.r(t),n.d(t,{data:()=>r});const r={key:"v-c1c1622c",path:"/Overview/advanced/RouteLazyLoading.html",title:"路由懒加载",lang:"en-US",frontmatter:{},excerpt:"",headers:[],git:{updatedTime:1677743789e3},filePathRelative:"Overview/advanced/RouteLazyLoading.md"}},369:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});var r=n(6252);const a=(0,r._)("h1",{id:"路由懒加载",tabindex:"-1"},[(0,r._)("a",{class:"header-anchor",href:"#路由懒加载","aria-hidden":"true"},"#"),(0,r.Uk)(" 路由懒加载")],-1),c=(0,r.Uk)("当打包构建应用时，js 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。"),l={href:"https://router.vuejs.org/zh/guide/advanced/lazy-loading.html",target:"_blank",rel:"noopener noreferrer"},o=(0,r.Uk)("vue-router官网"),u=(0,r._)("div",{class:"custom-container tip"},[(0,r._)("p",{class:"custom-container-title"},"提示"),(0,r._)("p",null,"如何实现路由的懒加载在这里不做过多的阐述，在vue-router的官方文档中有着非常完美的解释，在这里我们需要说明的是为何在electron中要去实现路由懒加载")],-1),d=(0,r._)("p",null,"首先是为了内存和首屏加载速度问题，即使是在electron中，资源都在用户电脑中并且不用考虑网络传输带来的等待时间，几乎算是非常理想的状态，但是我们需要考虑的是，用户的内存，硬盘读取速度，以及cpu的速度，如果您的页面非常多，这将导致js包非常大，然后在用户的计算机硬件又不是非常理想的状态下，可能会导致首屏加载非常缓慢，即使你添加了等待页面，大于3秒的加载时间也会让用户烦躁不已，所以还是建议启用路由懒加载，这样用户不仅仅只是在首屏等待时间会降低，也有利于electron回收内存，让内存占用不再那么浮夸。",-1),i={},s=(0,n(3744).Z)(i,[["render",function(e,t){const n=(0,r.up)("ExternalLinkIcon");return(0,r.wg)(),(0,r.iD)(r.HY,null,[a,(0,r._)("blockquote",null,[(0,r._)("p",null,[c,(0,r._)("a",l,[o,(0,r.Wm)(n)])])]),u,d],64)}]])},3744:(e,t)=>{t.Z=(e,t)=>{const n=e.__vccOpts||e;for(const[e,r]of t)n[e]=r;return n}}}]);