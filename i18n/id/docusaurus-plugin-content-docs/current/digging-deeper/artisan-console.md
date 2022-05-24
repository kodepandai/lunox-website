---
sidebar_position: 1
---

# Artisan Console

## Introduction
Artisan is the command line interface included with lunox. Artisan exists at the root of your application as the `artisan.ts` script and provides a number of helpful commands that can assist you while you build your application. To view a list of all available Artisan commands, you may use the list command:
```
pnpm artisan -h
```
:::note
lunox app must be compiled before you can run artisan command. So make sure you have run `pnpm artisan prod` in production mode or `pnpm artisan dev` in development mode.
:::

### Tinker (REPL)
Lunox Tinker is a powerful REPL for the Lunox framework, powered by the nodejs builtin REPL.
#### Usage
Tinker allows you to interact with your entire Lunox application on the command line, including your models, facade, container and more. To enter the Tinker environment, run the tinker Artisan command:
```
pnpm artisan tinker
```

#### Tinker Helper
There is limitation in Tinker environment because of nodejs REPL cannot do top import. For this reason, Lunox Tinker already shipped usefull helper. Just call `use` method to import module from app folder or from lunox framework directly. 
```js
//example how to import module from app folder
use('app/Model/User')

await User.query()

//example how to import lunox module
use("DB")

await DB.table('users')
```

![Lunox Tinker demo](/img/tutorial/tinker.gif)