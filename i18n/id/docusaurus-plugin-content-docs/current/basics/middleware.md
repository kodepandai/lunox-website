---
sidebar_position: 2
---

# Middleware

## Introduction
Middleware concept are same with [Laravel Middleware](https://laravel.com/docs/8.x/middleware). Middleware run before you application main logic. For example we can filter user request before entering our application, check cookie or session, and more.

## Defining Middleware
All middleware files is located at `app/Middleware` folder.

:::tip
use artisan command to create middleware
```
pnpm artisan make:middleware Auth
```
:::

## Object Based and Class Based Middleware

Middleware can be plain object or class based. For simple middleware use plain object instead. Below is example of middleware using plain object.
```ts
import type {Middleware} from 'lunox';

const AuthMiddleware: Middleware = {
    async handle(req, next){
        // do authentication here
        if(!await req.auth().check()){
            throw new ApiException("Please login", 401);
        }

        return next(req)
    }
}

export default AuthMidleware
```

And this is equivalent Auth middleware using class.
```ts
import type {Middleware} from 'lunox';

class AuthMiddleware implements Middleware {
    async handle(req, next){
        // do authentication here
        if(!await req.auth().check()){
            throw new ApiException("Please login", 401);
        }

        return next(req)
    }
}

export default AuthMidleware
```

## Middleware Types
There are three types of middleware. *Before Middleware*, *After Middleware*, and *Native Middleware*. Usually you will only create *Before Middleware*;
### Before Middleware
Before middleware is middleware that run before route action is excecuted. For example middleware that handle user authentication. To create *before middleware* just create `handle` method. See this example

```ts
class AuthMiddleware implements Middleware {
    async handle(req, next){
        // do authentication here
        if(!await req.auth().check()){
            throw new ApiException("Please login", 401);
        }

        return next(req)
    }
}
```
#### Next Method
Next method can accept one arguments that is `Http/Request` instance. This will make sure that request instance is updated on next step. See above example.

:::note
Before middleware must return instance of lunox `Http/Response`. The return type of `next` function is `Http/Response`
:::
### After Middleware
Sometimes we want to add some action after route action is excecuted but before response is sent to browser. *After middleware* is exists to handle that situation. For example lunox `EncryptCookie` middleware is using *before middleware* to decrypt incoming cookie and *after middleware* to encrypt it back. Just create `handleAfter` method to implement *after middleware*.
```ts
class EncryptCookie implements Middleware {
    async handleAfter(res){
        // do authentication here
        res = this.encrypt(res);
        return res;
    }
}
```
:::note
Similar to *Before Middleware*, *After Middleware* must return lunox `Http/Response` instance. The difference is the parameter of `handleAfter` method is instance of `Http/Response` instead of `Http/Request` and `NextFunction`.
:::

### Native Middleware
Because of big community of nodejs, there are bunch of middleware package that supported for `express` and `polka` framework. Lunox is built in top of `polka`. So we can use that package inside lunox app. For example is middleware to handle `cors`. We can implement this kind of middleware using *Native Middleware*. Just create `handleNative` method inside your middleware.

```ts
// in express or polka application
import cors from 'cors';

// in lunox
const CorsMiddleware: Middleware = {
    async handleNative(req, res, next){
        return cors({
            // ..config
        })(req, res, next)
    }
}
```
:::caution
`req`, `res`, and `next` parameter of `handleNative` method is instance of `ServerRequest`, `ServerResponse` and `NextFunction` of `polka` http server. It is also suitable for `express` middleware package.
:::

## Registering Middleware
Middleware is registered on `app/Http/Kernel`. You can register your custom middleware in three different types in http Kernel.
```ts
class Kernel extends BaseKernel {
  // global middleware
  protected middleware = [CorsMiddleware];

  // group middleware
  protected middlewareGroups = {
    web: [StartSession],
  };

  // route middleware
  protected routeMiddleware = {
    auth: AuthMiddleware,
    session: SessionMiddleware,
  };
}

export default Kernel;
```
### Global Middleware
This middleware is run on every request made. So if you want to put cors middleware, this is the good place. 
### Group Middleware
You can group two or more middlewares to one group. Then you just assign this group name to some route. For example `web` group middleware. See `app/Providers/RouteServiceProvider.ts` to see how to assign `web` group middleware.
```ts
class RouteServiceProvider extends ServiceProvider {
  async register() {}
  async boot() {
    await Route.middleware("web") //<-- here we assign web group  middleware to web based routes.
        .group(base_path("routes/web"));
    await Route.prefix("/api").group(base_path("routes/api"));
  }
}
```

### Route Middleware
This is just key pair of middleware (aliasing middleware). Route middleware can be assigned to any routes.
```ts
Route.get('/someuri', ()=>'OK').middleware('auth');

// or group of routes
Route.middleware('auth').group(()=>{
    // all routes in this group will use auth middleware
    Route.get('/someuri', ()=>'OK'); 
    Route.get('/another', ()=>'OK');
})
```

:::caution
`Route.group` method is asyncrounous, so make sure to call this method on last chain or using `await`

```ts
// this will not work
Route.group(()=>{
    // some routes
}).middleware('auth')

// This will work
Route.middleware('auth').group(()=>{
    // some routes
})
// This is fine
await Route.group(()=>{
    // some routes
}).middleware('auth')
```
:::

`Route.middleware` method can accept array of middleware. So you can do something like this
```ts
Route.get('/someurl', ()=>'OK').middleware(['auth', 'admin'])
```
:::note TODO
`Route.withoutMiddleware` method to exclude middleware on some route
:::