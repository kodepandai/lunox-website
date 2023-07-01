---
sidebar_position: 1
---

# Routing

## Basic Routing

Routing in Lunox is as simple as Laravel's routing. To register a route, simply use the `Route` facade. The method accepts a URI and a closure as the route callback.

```ts
import { Route } from "@lunoxjs/core/facades";

Route.get("/greetings", () => "Hello");
```

## Default Route Files

All Lunox routes are predefined in the `routes` folder. There are two files: `api.ts` and `web.ts`. If you need access to sessions, use the `web.ts` file to register your routes. Otherwise, use the `api.ts` file. Both of these files are registered in the `app/Providers/RouteServiceProvider`. You can add additional route files there.

If you look at the registration of `routes/web`, you will see that this route uses the `web` middleware. This middleware is referenced in `app/Http/Kernel.ts` in the `middlewareGroups` array list. We will talk about middleware later.

```ts
class Kernel extends BaseKernel {
  protected middleware = [CorsMiddleware];

  protected middlewareGroups = {
    web: [StartSession], // <-- here is the web middleware declared.
  };

  protected routeMiddleware = {
    auth: AuthMiddleware,
    session: SessionMiddleware,
  };
}
```

## Available Route Methods

Currently, the following route methods are available:

```ts
- Route.get(uri: string, action: RouteAction)
- Route.post(uri: string, action: RouteAction)
- Route.delete(uri: string, action: RouteAction);
- Route.patch(uri: string, action: RouteAction);
- Route.put(uri: string, action: RouteAction);
- Route.all(uri: string, action: RouteAction);
- Route.getRoutes() // returns all registered routes
- Route.prefix(prefix: string) // adds a prefix to the route
- Route.middleware(middleware: string | Middleware | (string | Middleware)[]) // adds middleware to the route
- Route.group(callback: string | Callback): Promise<void>; // groups routes
```

## Route Parameters

Lunox is built on top of [Polka](https://github.com/lukeed/polka) server, so the URI patterns are inherited from it. Here are some examples of URI patterns:

```bash
- static (/users)
- named parameters (/users/:id)
- nested parameters (/users/:id/books/:title)
- optional parameters (/users/:id?/books/:title?)
- any match / wildcards (/users/*)
```

## Route Action

For now, we cannot perform dependency injection in route actions like we can in Laravel. So, to achieve Laravel-like behavior in route actions, remember that the first parameter of the route action is always the `Request` instance, and the rest are the route parameters.

```ts
import { Route } from "@lunoxjs/core/facades";
import { Request } from "@lunoxjs/core";

Route.get("/hello/{id}/{message}", (req: Request, id, message) => {
  console.log(req instanceof Request); // returns true
  console.log(id); // returns the "id" parameter
  console.log(message); // returns the "message" parameter

  // We can access all request methods here
  req.all();
  req.get("user_id");
  // We will learn more about the Request instance later

  // using global request() helper also works
  request().all();
  request().get("user_id");

  return "OK";
  // Don't forget to return something here;
});
```
