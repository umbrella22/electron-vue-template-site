import { defineUserConfig } from "@vuepress/cli";
import type { DefaultThemeOptions } from "vuepress";

module.exports = defineUserConfig<DefaultThemeOptions>({
  base: "/electron-vue-template-doc/",
  title: "electron-vue-template-doc",
  description: "基于vue来构建一个electron应用程序",
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  themeConfig: {
    lastUpdatedText: "更新时间",
    contributors:false,
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
        notFound: ["啊嘞？看起来你进入了一个异次元页面"],
        backToHome: "返回首页",
      },
    },
  },
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
