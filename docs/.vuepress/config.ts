import { defineUserConfig } from "@vuepress/cli";
import { webpackBundler } from '@vuepress/bundler-webpack'
import type { DefaultThemeOptions } from "vuepress";
import { defaultTheme } from '@vuepress/theme-default'

module.exports = defineUserConfig<DefaultThemeOptions>({
  bundler: webpackBundler(),
  base: "/electron-vue-template-doc/",
  title: "electron-vue-template-doc",
  description: "基于vue来构建一个electron应用程序",
  head: [["link", { rel: "icon", href: "/logo.png" }], ["script", {}, `
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?0f50a8d84b1f3393d7b5dd1c2a7ab417";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();`],],
  theme: defaultTheme({
    lastUpdatedText: "更新时间",
    contributors: false,
    locales: {
      "/": {
        navbar: [
          { text: "首页", link: "/" },
          {
            text: "Gitee",
            link: "https://gitee.com/Zh-Sky/electron-vue-template",
          },
          {
            text: "Github",
            link: "https://github.com/umbrella22/electron-vue-template",
          },
        ],
        sidebar: {
          "/Overview/": [
            {
              text: "基础",
              children: genEssentialsSidebar(),
            },
            {
              text: "进阶",
              children: genAdvancedSidebar(),
            },
          ],
        },

        // 404 page
        notFound: ["呜喵？人类这里不是你要来的地方喵~快回去喵~~~"],
        backToHome: "返回首页",
      },
    },
  }),
  plugins: [
    [
      "@vuepress/plugin-search",
      {
        maxSuggestions: 5,
      },
    ],
  ],
});
function genEssentialsSidebar() {
  const mapArr = [
    "/Overview/README.md",
    "/Overview/essentials/features.md",
    "/Overview/essentials/",
    "/Overview/essentials/renderer-process.md",
    "/Overview/essentials/build.md",
  ];
  return mapArr.map((i) => {
    return i;
  });
}

function genAdvancedSidebar() {
  const mapArr = [
    "/Overview/advanced/README.md",
    "/Overview/advanced/RouteLazyLoading.md",
    "/Overview/advanced/ffi.md",
    "/Overview/advanced/webpack.md",
    "/Overview/advanced/moreWin.md",
    "/Overview/advanced/NoLayOut.md",
    "/Overview/advanced/FrostedGlassWindow.md",
    "/Overview/advanced/hotUpdate.md"
  ];
  return mapArr.map((i) => {
    return i;
  });
}
