---
sidebar_position: 2
---

# Middleware

## Introduction
Middleware concept are same with [Laravel Middleware](https://laravel.com/docs/8.x/middleware). Middleware run before you application main logic. For example we can filter user request before entering our application, check cookie or session, and more.

## Defining Middleware
All middleware files is located at `app/Middleware` folder.

:::note TODO
artisan command for create middleware file
:::

To create middleware just create object that implement lunox Middleware interface. Middleware has method handle, this method is where you middleware logic is placed. `handle` method has two params. The first parameter is request instance, the second one is `next` method. `next` method is function to make your request continue to next step (can be next middleware or route action). `handle` method must return either `next` method or throw some exception. See example below.
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

## Next Method
In Laravel we can only pass single argument (request instance). In lunox, Next method can accept two arguments. First argument is request instance. This will make sure that request instance is updated on next step. Second argument is optional. Because of how big community of nodejs, there are many available middleware package that works in nodejs framework like `express` or `polka`. For example is `cors` package. So, we decided to make `next` method second argument to place this native nodejs middleware. See this example.

```ts
// in express or polka application
import cors from 'cors';

server.use(cors({
    // ...config
}))

// in lunox
const CorsMiddleware: Middleware = {
    async handle(req, next){
        return next(req, cors({
            // ..config
        }))
    }
}

```

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

First is global middleware. This middleware is run on every request made. So if you want to put cors middleware, this is the good place. Second is group middleware. You can group two or more middlewares to one group. Then you just assign this group name to some route. For example `web` group middleware. See `app/Providers/RouteServiceProvider.ts` to see how to assign `web` group middleware.
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
The last one is route middleware. This is just key pair of middleware (aliasing middleware). Route middleware can be assigned to any routes.
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
For now, `Route.group` method is asyncrounous, so make sure to call this method on last chain

```ts
// this will not work
Route.group(()=>{
    // some routes
}).middleware('auth')

// This will
Route.middleware('auth').group(()=>{
    // some routes
})
```
:::

`Route.middleware` method can accept array of middleware. So you can do something like this
```ts
Route.get('/someurl', ()=>'OK').middleware(['auth', 'admin'])
```
:::note TODO
`Route.withoutMiddleware` method to exclude middleware on some route
:::