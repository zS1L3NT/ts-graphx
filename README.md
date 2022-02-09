# GraphX

![License](https://img.shields.io/github/license/zS1L3NT/web-vue-graphx?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/web-vue-graphx?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/web-vue-graphx?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/web-vue-graphx?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/web-vue-graphx?style=for-the-badge)

GraphX is a primitive graph drawing website that can parse simple mathematical equations, then plot the graph for it.<br>
This is an example of the website plotting the graph for `y = 2sin(x) - 1`<br>
![Example](https://i.ibb.co/MZcPf14/graphx.png)

## Motivation

I used to use the website [Desmos](https://desmos.com/calculator) to plot and visualise my graphs. I found it interesting how Desmos can understand my equation and plot a graph out of it, so I wanted to see if I could create my own super simplified version of desmos.

## Features

-   Parse Simple Mathematics
    -   Addition `-`
    -   Subtraction `-`
    -   Multiplication `*`
    -   Division `/`
    -   Exponential `^`
    -   Sine `sin()`
    -   Cosine `cos()`
    -   Tangent `tan()`
-   Solve the Equation
    -   Calculates and returns at most 1000 solutions to the graph so that the values can be plotted
-   Custom Ranges
    -   Define a custom range for both the X axis and Y axis

## Usage

With `yarn`

```
$ yarn
$ yarn dev
```

With `npm`

```
$ npm i
$ npm run dev
```

## Built with

-   TypeScript
    -   [![@types/express](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/dev/@types/express?style=flat-square)](https://npmjs.com/package/@types/express)
    -   [![@types/jest](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/dev/@types/jest?style=flat-square)](https://npmjs.com/package/@types/jest)
    -   [![@types/node](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/dev/@types/node?style=flat-square)](https://npmjs.com/package/@types/node)
    -   [![typescript](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/dev/typescript?style=flat-square)](https://npmjs.com/package/typescript)
-   Jest
    -   [![@babel/core](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/dev/@babel/core?style=flat-square)](https://npmjs.com/package/@babel/core)
    -   [![@babel/preset-env](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/dev/@babel/preset-env?style=flat-square)](https://npmjs.com/package/@babel/preset-env)
    -   [![@balel/preset-typescript](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/dev/@balel/preset-typescript?style=flat-square)](https://npmjs.com/package/@balel/preset-typescript)
    -   [![jest](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/dev/jest?style=flat-square)](https://npmjs.com/package/jest)
-   Miscellaneous
    -   [![express](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/express?style=flat-square)](https://npmjs.com/package/express)
    -   [![validate-any](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/web-vue-graphx/validate-any?style=flat-square)](https://npmjs.com/package/validate-any)
