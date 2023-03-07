import { defineConfig } from "vitepress";
import { version } from "../../package.json";

export default defineConfig({
  title: "electron-vue-template-doc",
  description: "",
  base: "/electron-vue-template-doc/",
  lang: "en-US",
  head: [["link", { rel: "icon", href: "favicon.ico" }]],
  markdown: {
    lineNumbers: true,
  },
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  themeConfig: {
    siteTitle: "electron-vue-template",
    logo: "/favicon.ico",
    lastUpdatedText: "最后更新时间",
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2021-present umbrella22",
    },
    nav: nav(),
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/umbrella22/electron-vite-template",
      },
    ],
    sidebar: {
      "/apps/": [
        {
          text: "案例展示",
          items: [{ text: "案例展示", link: "/apps/" }],
        },
      ],
      ...introduceSidebar(),
    },
  },
});

function nav() {
  return [
    {
      text: "介绍",
      link: "/project/",
      activeMatch: "/project|essentials|advanced/",
    },
    {
      text: "案例展示",
      link: "/apps/",
      activeMatch: "/apps/",
    },
    {
      text: "相关文档",
      items: [
        {
          text: "vue",
          link: "https://staging-cn.vuejs.org/",
        },
        {
          text: "electron",
          link: "https://www.electronjs.org/",
        },
        {
          text: "vite",
          link: "https://cn.vitejs.dev/",
        },
        {
          text: "rollup",
          link: "https://www.rollupjs.com/",
        },
        {
          text: "electron-builder",
          link: "https://www.electron.build/",
        },
        {
          text: "vue-router",
          link: "https://router.vuejs.org/zh/",
        },
        {
          text: "pinia",
          link: "https://pinia.vuejs.org/",
        },
        {
          text: "vueuse",
          link: "https://vueuse.org/",
        },
      ],
    },
    {
      text: version,
      items: [],
    },
  ];
}

function introduceSidebar() {
  const commonRoute = [
    {
      text: "介绍",
      items: [
        { text: "项目介绍", link: "/project/" },
        { text: "特色功能", link: "/project/features" },
      ],
    },
    {
      text: "基础",
      items: [
        { text: "主进程", link: "/essentials/" },
        { text: "渲染进程", link: "/essentials/renderer-process" },
        { text: "路由懒加载", link: "/essentials/RouteLazyLoading" },
        { text: "构建和发布", link: "/essentials/build" },
      ],
    },
    {
      text: "进阶",
      items: [
        { text: "跨域问题", link: "/advanced/" },
        { text: "ffi", link: "/advanced/ffi" },
        { text: "毛玻璃窗口效果", link: "/advanced/frosted-glass-window" },
        { text: "热更新", link: "/advanced/hot-update" },
        { text: "多窗口", link: "/advanced/more-win" },
        { text: "纯净版", link: "/advanced/no-lay-out" },
        { text: "构建工具", link: "/advanced/building-tools" },
      ],
    },
  ];

  return {
    "/project/": commonRoute,
    "/essentials/": commonRoute,
    "/advanced/": commonRoute,
  };
}
