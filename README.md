<!--
 * @Author: hongxu.lin
 * @Date: 2020-07-01 14:52:34
 * @LastEditTime: 2020-07-20 11:47:48
-->

**文章适合已经有 webgl（或其他图形学基础）的同学阅读学习，不适合纯新手，建议新手同学从 threejs 入门，学习曲线稍微平滑点。**

# 基础环境及依赖

-   chrome canary
-   在 `chrome://flags/` 中搜索 **Unsafe WebGPU** 打开 flag
-   node & typescript

项目使用 typescript 进行开发，页面展示使用 webpack 进行打包整个项目。所以，建议在运行项目之前，最好全局安装好 node 以及 typescript 的运行环境。

npm 引入 `@webgpu/types` 并在 tsconfig.json 中配置 webgpu 的 ts 提示。

```
{
    "compilerOptions": {
        "outDir": "./dist/",
        "sourceMap": true,
        "noImplicitAny": true,
        "module": "commonjs",
        "target": "es5",
        "allowJs": true,
        "lib": ["es7", "dom"],
        "types": ["@webgpu/types"]
    }
}

```

webpack 的相关配置项比较多，但是大多是常规配置，用来加载 demo 中的每个示例。

# 项目结构

```
----------------------------------------------
    |----build webpack 配置文件
    |----docs 文章及说明
    |----src  代码
            |----demo   每个demo的代码
            |----engine 一个简单的渲染封装
            index.ejs   主页html
            index.ts    主页
            style.less  样式
    |----package.json   node 包
    |----tsconfig.json  ts配置
```

# 运行代码

clone 代码仓库

```
npm install
npm start
```

# online demo

[https://code945.github.io/HowToUseWebGPU/](https://code945.github.io/HowToUseWebGPU/)

# 文章内容

webgpu 是下一代的 web 端图形接口，虽然目前仍然没法发布正式版。但是已经有可以运行的环境，可以让开发者尝鲜体验，本仓库就是记录笔者学习使用 webgpu 的整个过程。其中可能会包括如下的一些内容：

1. [clearcolor 最简单的应用从清屏开始](docs/1.清屏.md)
2. [drawTriangle 画个三角形](docs/2.绘制三角形.md)
3. animated 动起来
4. textured 加上贴图
5. directionalLight 方向光
6. pointLight 点光源
7. spotLight 聚光灯

# 相关连接及参考

官方文档 https://gpuweb.github.io/gpuweb/

中文教程 https://github.com/hjlld/LearningWebGPU

入门博客 https://alain.xyz/blog/raw-webgpu

相关示例 https://github.com/austinEng/webgpu-samples
