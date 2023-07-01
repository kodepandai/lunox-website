---
sidebar_position: 1
---

# Request Lifecycle

If you are familiar with the `php` language, there are some conceptual differences in how requests are handled between Lunox and Laravel. In Laravel (using `php`), requests are handled by the application, and the application is terminated after each request. In Lunox (using `nodejs`), the application runs on an event loop, so it is not terminated but runs continuously. Therefore, it is important in Lunox to return a response or throw an exception for every request handled, to ensure that the application does not hang.

Due to this difference, some Laravel features are handled differently in Lunox. Currently, singletons in Lunox are shared across the entire application. Therefore, it's important to create singletons only for instances that need to be shared globally.

To address the need for isolation between each HTTP request, we have implemented Async Local Storage (ASL) in the global request() helper. This allows for proper separation and isolation of data between requests. In the future, we plan to enhance the singleton sharing functionality to be scoped either to the entire application or to individual requests using ASL.

## Entry Point

There are two types of entry points in a Lunox app: the HTTP entry point and the console entry point.

### HTTP Kernel

HTTP requests are handled by the HTTP Kernel. You can refer to the [index.ts](https://github.com/kodepandai/lunox/blob/next/presets/api/index.ts) file, which is where the HTTP Kernel is loaded to continuously handle all HTTP requests. All global functions (`helpers`) are loaded from the `autoload.ts` file. The HTTP Kernel then bootstraps your application, loads the application config, and registers and boots all providers to the system.

### Console Kernel

For console applications (such as running artisan commands), Lunox uses the Console Kernel. The main file for this is [artisan.ts](https://github.com/kodepandai/lunox/blob/next/presets/api/artisan.ts). This file loads the Console Kernel and initializes your application in the console. We will discuss more about this in the "Artisan" section.
