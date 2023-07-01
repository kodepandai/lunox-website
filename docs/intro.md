---
sidebar_position: 1
---

# Introduction

Let's discover **Lunox** in less than 5 minutes.

## Overview

Lunox is a Node.js framework that aims to bring Laravel's features to the Node.js environment. If you are not familiar with Laravel, you can check out their [website](https://laravel.com/). We support all basic Laravel features but make it as simple as possible.

## Why Use the Lunox Framework

Why choose Lunox? Here's a basic guide to help you decide.

1. Lunox is ideal if you want static typing and the modern syntax of Node.js. It uses ESM modules and TypeScript by default.
2. Lunox is perfect for developers who prefer a lightweight MVC framework. It is built on top of [polka](https://github.com/lukeed/polka) as the HTTP server and [vite](https://vitejs.dev/) as the frontend tooling.
3. Lunox supports React and Svelte as template engines. We plan to support other languages in the future.

## Comparing with Other Frameworks

### Syntax

There are many Node.js frameworks inspired by Laravel, such as Adonis and Nest.js. As a Laravel developer, transitioning from Laravel to Adonis or Nest.js can be challenging. While these are good frameworks, they cannot replace Laravel as they have their own style. Lunox was created as a bridge for Laravel developers transitioning to the Node.js environment. Lunox's syntax is designed to be as close as possible to Laravel. For example, it includes how to use facades, macros, service containers, middleware, and artisan commands. If you are a Laravel developer, you should love this framework.

### Template Engine

Many frameworks use their own template engines, such as `edge` and `hbs`, but Lunox takes a different approach. Since we are in the Node.js environment with various frontend libraries and frameworks available, such as `React.js`, `Vue`, and `Svelte`, we integrate them into our application. For this reason, Lunox is shipped with `vite` as the frontend tooling and uses `svelte` as the default view. Currently, Lunox supports `svelte` and `react` as template engines. We will integrate other languages in the future, so stay tuned.

## Prerequisites

For a better development experience, here are the recommended system requirements:

1. Use pnpm as the package manager.
2. Use Node.js v14.x or later. v16.x (stable version) is recommended.
