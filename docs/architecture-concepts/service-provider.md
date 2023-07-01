---
sidebar_position: 3
---

# Service Provider

Lunox **Service Providers** follow the same concept as Laravel Service Providers. Service providers are the central place for all application bootstrapping. Both your own application and all of Lunox's core services are bootstrapped via service providers.

All Service Providers are listed in the `config/app.ts` file. You will find a `providers` array in that file where you can update which Service Providers you want to register.

## Writing a Service Provider

You can create your own Service Providers and load them into your application. Here's an example of how to use a Service Provider by looking at `app/Providers/RouteServiceProvider.ts`. Essentially, a Service Provider is just a class that extends Lunox's `ServiceProvider`.

```ts
import { Route } from "@lunoxjs/core/facades";
import { Route, ServiceProvider } from "@lunoxjs/core";

class RouteServiceProvider extends ServiceProvider {
  async register() {}
  async boot() {
    await Route.group(base_path("routes/web"));
    await Route.prefix("/api").group(base_path("routes/api"));
  }
}

export default RouteServiceProvider;
```

A Service Provider has two async methods, `register` and `boot`. These methods are marked async because sometimes we might want to load files or perform asynchronous operations in this place. For example, in `RouteServiceProvider`, we load all route files from the `routes/web` folder and the `routes/api` folder.

### The Register Method

The `register` method will run before your application is fully booted. Therefore, you can only bind things into the service container at this point. If you want to resolve some instance, do that in the `boot` method instead. That's why in `RouteServiceProvider` we load all routes in the `boot` method because the `Route` facade is not available yet in the `register` method.

Within any of your Service Providers, you will always have access to the application instance via `this.app`, which provides access to the service container. Here's an example of a simple Service Provider:

```ts
// file: app/Providers/PaymentServiceProvider

import { ServiceProvider } from "@lunoxjs/core";
import Payment from "./Support/Payment";

class PaymentServiceProvider extends ServiceProvider {
  async register() {
    this.app.bind("payment", () => {
      return new Payment(config("payment.service"));
    });
  }
}
export default PaymentServiceProvider;
```

### The Boot Method

The `boot` method is called after all other service providers have been registered, which means you have access to all other services that have been registered by the framework. You can call the database, resolve instances, or use Facades here (we'll talk about `Facades` later).

### Registering Providers

All service providers are registered in the `config/app.ts` configuration file. To register your providers, add them to the `providers` array in that file.

```ts
import PaymentServiceProvider from 'app/Providers/PaymentServiceProvider';
// ...
 providers: [
    // other service providers
    PaymentServiceProvider,
  ],
// ...
```
