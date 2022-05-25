---
sidebar_position: 1
---

# Routing
## Basic Routing
Routing in lunox is as simple as Laravel route. To register some route just use `Route` facade. The method is accept uri and closure as route callback.
```ts
import {Route} form 'lunox';

Route.get('/greetings', ()=> 'Hello');
```

## Default Route files
All lunox router is predefined in folder `routes`; There are two file there, `api.ts` and `web.ts`; If you need access to session, use `web.ts` file to register your routes, otherwise use `api.ts`. Both of them is registered at `app/Providers/RouteServiceProvider`. You can add additional router file there.

If you look at registration of `routes/web`, you will see that this route is using `web` middleware. This middleware is referenced at `app/Http/Kernel.ts` on `middlewareGroups` array list. We will talk about middleware later.
```ts
class Kernel extends BaseKernel {
  protected middleware = [CorsMiddleware];

  protected middlewareGroups = {
    web: [StartSession], // <-- here is web middleware declared.
  };

  protected routeMiddleware = {
    auth: AuthMiddleware,
    session: SessionMiddleware,
  };
}
```

## Available Router  Methods
For now, this is available router method
```ts
- Route.get(uri: string, action: RouteAction)
- Route.post(uri: string, action: RouteAction)
- Route.delete(uri: string, action: RouteAction);
- Route.patch(uri: string, action: RouteAction);
- Route.put(uri: string, action: RouteAction);
- Route.all(uri: string, action: RouteAction);
- Route.getRoutes() //return all registered routes
- Route.prefix(prefix: string) // add prefix to route
- Route.middleware(middleware: string | Middleware | (string|Middleware)[]) // add middleware to route
- Route.group(callback: string | Callback): Promise<void>; // grouping route
```

## Route Parameters
Lunox is build on top of [Polka](https://github.com/lukeed/polka) server. So the uri patterns are inherit from it. 
```bash
- static (/users)
- named parameters (/users/:id)
- nested parameters (/users/:id/books/:title)
- optional parameters (/users/:id?/books/:title?)
- any match / wildcards (/users/*)
```

## Route Action
In lunox, we cannot do some dependency injection to route action like we did in Laravel. So, to make route action behaviour laravel like, just remember that first parameter of route action is always `Request` instance, the rest is route params.
```ts
Route.get('/hello/{id}/{message}', (req: Request, id, message) =>{
  console.log(req instanceof Request) // return true
  console.log(id) // return param id
  console.log(message) // return param message
  
  // we can access all request method here
  req.all();
  req.get('user_id');
  // we will learn about request instance later
  return 'OK';
  // don't forget to return something here otherwise your app will hang
})
```



