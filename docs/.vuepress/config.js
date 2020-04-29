module.exports = {
    base:'/electron-vue-template-doc/',
    title: "electron-vue-template-doc",
    description: "基于vue来构建一个electron应用程序",
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        sidebarDepth: 4,
        nav: [
            { text: '首页', link: '/' },
            { text: 'Github', link: 'https://github.com/umbrella22/electron-vue-template' },
        ],
        sidebar: {
            '/Overview/': [
                {
                    title: '基础',
                    collapsable: false,
                    children: genEssentialsSidebar()
                }, {
                    title: '进阶',
                    collapsable: false,
                    children: genAdvancedSidebar()
                }
            ]
        }
    }

}
function genEssentialsSidebar() {
    const mapArr = [
        '/Overview/',
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
        '/Overview/advanced/',
        '/Overview/advanced/RouteLazyLoading.md',
        '/Overview/advanced/ffi.md',
        '/Overview/advanced/webpack.md',
        '/Overview/advanced/moreWin.md'
    ]
    return mapArr.map(i => {
        return i
    })
}