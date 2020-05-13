#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

#创建.nojekyll 防止Github Pages build错误
touch .nojekyll

git init
git add -A
git commit -m '自动更新'

git push -f "https://${access_token}@github.com/umbrella22/electron-vue-template-doc.git" master:gh-pages
git push -f "https://${gitee_token}@gitee.com/Zh-Sky/electron-vue-template-doc.git" master:gh-pages

cd -