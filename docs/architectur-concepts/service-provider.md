---
sidebar_position: 2
---

# Service Provider
LunoX **Service Providers** have same concept with Laravel Service Providers. Service providers are the central place of all application bootstrapping. Your own application, as well as all of LunoX's core services, are bootstrapped via service providers.

All Service Providers are listed in `config/app.ts` file. You will see `providers` array in that file. You can update what Service Providers you want to register in `providers` array.

## Writing Service Provider
You can make your own Service Providers and load it to your application. Check `app/Providers/RouteServiceProvider.ts` for example how to use Service Provider. So basically Service Provider is just class that extends LunoX's `ServiceProvider`.

```ts
import { Route, ServiceProvider } from "lunox";

class RouteServiceProvider extends ServiceProvider {
  async register() {}
  async boot() {
    await Route.group(base_path("routes/web"));
    await Route.prefix("/api").group(base_path("routes/api"));
  }
}

export default RouteServiceProvider;
```
Service Provider has two async methods, `register` and `boot`. Why async? because sometimes we want to load file or do asyncronous thing in this place. For example in `RouteServiceProvider`, we load all routes file from `routes/web` folder and `routes/api` folder. 

### The Register Method
Register method will run before you application is booted. So keep in mind that you can only bind things into the service container. If you want resolve some instance, do that in boot method instead. This is why on `RouteServiceProvider` we load all routes in `boot` method. Because `Route` facade is not loaded yet in register method.

Within any your Service Providers, you will always has access to the application instance via `this.app` that provide access to service container. Take a look at this simple Service Provider.
```ts
// file: app/Providers/PaymentServiceProvider

import {ServiceProvider} from 'lunox';
import Payment from './Support/Payment';

class PaymentServiceProvider extends ServiceProvider {
    async register(){
        this.app.bind('payment', ()=>{
            return new Payment(config('payment.service'));
        })
    }
}
export default PaymentServiceProvider
```

### The Boot Method
This method is called after all other service providers have been registered, meaning you have all access to  all other services that have been registered by the framework. You can call database, resolve instance, or use Facades here. We will talk about `Facade` later.

### Registering Providers
All service providers are registered in the `config/app.ts` configuration file. To register your providers, add it to `providers` array in that file.
```ts
import PaymentServiceProvider from 'app/Providers/PaymentServiceProvider';
...
 providers: [
    // other service providers
    PaymentServiceProvider,
  ],
...
```