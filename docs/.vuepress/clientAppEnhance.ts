import { defineClientAppEnhance } from '@vuepress/client'

export default defineClientAppEnhance(({
    app, // the version of Vue being used in the VuePress app
    router, // the router instance for the app
    siteData, // site metadata
}) => {
    /**
     * 路由切换上报百度统计
     */
    router.beforeEach((to, from, next) => {
        //触发百度的pv统计
        if (typeof window._hmt != "undefined") {
            if (to.path) {
                window._hmt.push(["_trackPageview", to.fullPath]);
            }
        }
        next();
    });
})
