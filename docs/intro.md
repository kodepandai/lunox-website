---
sidebar_position: 1
---

# Introduction

Let's discover **Lunox** in less than 5 minutes.

## Overview

Lunox is NodeJs framework that aims to bring Laravel features in NodeJs environment. If you are not familiar with Laravel, you can check the [website](https://laravel.com/). We will support all basic Laravel features, but we make it as simple as possible.

## Why using Lunox Framework

Why choosing Lunox? This is some basic guide that helped you decide to use lunox.
1. Lunox is good if you want static typing and modern syntax of nodejs. Lunox is using ESM module and typescript by default.
2. Lunox is perfect for developer who like lighweight MVC framework. Lunox built in top of [polka](https://github.com/lukeed/polka) as http server and [vite](https://vitejs.dev/) as frontend tooling.
3. Lunox using svelte as template engine. Next time we will support other javascript framework like react or vue.

## Comparing with Other Framework
### Syntax
There are many nodejs framework that inspired by Laravel, such as adonis and nestjs. As a Laravel developer, it's still hard to move from Laravel to adonis or nestjs. They are good framework, but they cannot replace Laravel, they have their own style. Lunox is born as a bridge for Laravel developer that come to nodejs environment. Lunox syntax is made as close as possible to Laravel. For example is how to use facade, macro, service container, middleware, and artisan command. If you are Laravel developer, you should love this framework.

### Template Engine
Many framework use their own template engine, for example `edge` and `hbs`, but Lunox have another approach. Since we are in nodejs environment and there are many frontend library or framework available such as `reactjs`, `vue`, and `svelte`, so why not integrate them in our application. For this reason Lunox shipped with `vite` as frontend tooling and by default using `svelte` as view. For now Lunox support `svelte` and `react` as template engine. Next time we will integrate other language too, just wait for it.

## Prerequisites
For a better development experience, here is the recomended system requirements:
1. use pnpm as package manager 
2. use nodejs  v14.x or more. v16.x (stable version) is recommended

