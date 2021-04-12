module.exports = {
    base: '/electron-vue-template-doc/',
    title: "electron-vue-template-doc",
    description: "基于vue来构建一个electron应用程序",
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    themeConfig: {
        locales: {
            '/': {
                navbar: [
                    { text: '首页', link: '/' },
                    { text: 'Gitee', link: 'https://gitee.com/Zh-Sky/electron-vue-template' },
                    { text: 'Github', link: 'https://github.com/umbrella22/electron-vue-template' },
                ],
                sidebar: {
                    '/Overview/': [
                        {
                            text: '基础',
                            isGroup: true,
                            children: genEssentialsSidebar()
                        },
                        {
                            text: '进阶',
                            isGroup: true,
                            children: genAdvancedSidebar()
                        }
                    ]
                },

                // 404 page
                notFound: [
                    '这里什么都没有',
                    '我们怎么到这来了？',
                    '这是一个 404 页面',
                    '看起来我们进入了错误的链接',
                    '啊嘞？看起来你进入了一个异次元页面'
                ],
                backToHome: '返回首页',
            }

        },
    },

}
function genEssentialsSidebar() {
    const mapArr = [
        '/Overview/README.md',
        '/Overview/essentials/features.md',
        '/Overview/essentials/',
        '/Overview/essentials/renderer-process.md',
        '/Overview/essentials/build.md'
    ]
    return mapArr.map(i => {
        return i
    })
}

function genAdvancedSidebar() {
    const mapArr = [
        '/Overview/advanced/README.md',
        '/Overview/advanced/RouteLazyLoading.md',
        '/Overview/advanced/ffi.md',
        '/Overview/advanced/webpack.md',
        '/Overview/advanced/moreWin.md',
        '/Overview/advanced/NoLayOut.md',
        '/Overview/advanced/FrostedGlassWindow.md'
    ]
    return mapArr.map(i => {
        return i
    })
}