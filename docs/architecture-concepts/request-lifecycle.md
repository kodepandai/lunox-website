---
sidebar_position: 1
---

# Request Lifecycle

If you come from `php` language, there is some difference concept between how request handled in Lunox and Laravel. In Laravel (*`php`*), request are handled by application and then application is terminated on each request made. In Lunox (*`nodejs`*), application is run on event loop, so the application is not terminated but run continuously. So don't forget to return some response or throw an Exception on every request handled by Lunox so your application is not hang.
## Entry Point
The are two type of entry point on Lunox App. First is Http entry point, second is Console entry point.
### Http Kernel
Http Request are handled by Http Kernel. See [index.ts](https://github.com/kodepintar/lunox/blob/main/index.ts) file. This file is where Http Kernel is loaded then continuously handle all Http request. All global function (`helpers`) are loaded from `autoload.ts` file. Http Kernel then bootstrap your application bootsrapper, load application config, then register all providers and boot them to system.
### Console Kernel
For console application (*for example to run some artisan command*), Lunox will run Console Kernel. The main file is [artisan.ts](https://github.com/kodepintar/lunox/blob/main/artisan.ts). This file load Console Kernel and load your application in console. We will discuss it on `Artisan` part.