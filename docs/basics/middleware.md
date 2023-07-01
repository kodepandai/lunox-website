---
sidebar_position: 2
---

# Middleware

## Introduction

The concept of middleware in Lunox is the same as [Laravel Middleware](https://laravel.com/docs/10.x/middleware). Middleware runs before the main logic of your application. For example, you can filter user requests before they enter your application, check cookies or sessions, and more.

## Defining Middleware

All middleware files are located in the `app/Middleware` folder.

:::tip
Use the artisan command to create middleware:

```
pnpm artisan make:middleware Auth
```

:::

## Object-Based and Class-Based Middleware

Middleware can be plain objects or class-based. For simple middleware, use plain objects. Here's an example of middleware using a plain object:

```ts
import type { Middleware } from "@lunoxjs/core/contracts";

const AuthMiddleware: Middleware = {
  async handle(req, next) {
    // Perform authentication here
    if (!(await req.auth().check())) {
      throw new ApiException("Please login", 401);
    }

    return next(req);
  },
};

export default AuthMiddleware;
```

And here's an equivalent Auth middleware using a class:

```ts
import type { Middleware } from "@lunoxjs/core/contracts";

class AuthMiddleware implements Middleware {
  async handle(req, next) {
    // Perform authentication here
    if (!(await req.auth().check())) {
      throw new ApiException("Please login", 401);
    }

    return next(req);
  }
}

export default AuthMiddleware;
```

## Middleware Types

There are three types of middleware: _Before Middleware_, _After Middleware_, and _Native Middleware_. Usually, you will only create _Before Middleware_.

### Before Middleware

Before middleware is middleware that runs before the route action is executed. For example, middleware that handles user authentication. To create _before middleware_, simply create a `handle` method. See this example:

```ts
class AuthMiddleware implements Middleware {
  async handle(req, next) {
    // Perform authentication here
    if (!(await req.auth().check())) {
      throw new ApiException("Please login", 401);
    }

    return next(req);
  }
}
```

#### Next Method

The `next` method can accept one argument, which is the `Http/Request` instance. This ensures that the request instance is updated in the next step. See the example above.

:::note
Before middleware must return an instance of the Lunox `Http/Response`. The return type of the `next` function is `Http/Response`.
:::

### After Middleware

Sometimes we want to perform some actions after the route action is executed but before the response is sent to the browser. _After middleware_ exists to handle that situation. For example, the Lunox `EncryptCookie` middleware uses _before middleware_ to decrypt the incoming cookie and _after middleware_ to encrypt it back. Simply create a `handleAfter` method to implement _after middleware_.

```ts
class EncryptCookie implements Middleware {
  async handleAfter(res) {
    // Perform encryption here
    res = this.encrypt(res);
    return res;
  }
}
```

:::note
Similar to _Before Middleware_, _After Middleware_ must return a Lunox `Http/Response` instance. The difference is that the parameter of the `handleAfter` method is an instance of `Http/Response` instead of `Http/Request` and `NextFunction`.
:::

### Native Middleware

Due to the large community of Node.js, there are many middleware packages that are supported for the `express` and `polka` frameworks. Lunox is built on top of `polka`, so you can use those packages within a Lunox app. For example, to handle CORS, you can implement this kind

of middleware using _Native Middleware_. Simply create a `handleNative` method inside your middleware.

```ts
// In an Express or Polka application
import cors from "cors";

// In Lunox
const CorsMiddleware: Middleware = {
  async handleNative(req, res, next) {
    return cors({
      // ...config
    })(req, res, next);
  },
};
```

:::caution
The `req`, `res`, and `next` parameters of the `handleNative` method are instances of `ServerRequest`, `ServerResponse`, and `NextFunction` of the Polka HTTP server. They are also suitable for `express` middleware packages.
:::

## Registering Middleware

Middleware is registered in `app/Http/Kernel`. You can register your custom middleware in three different types in the HTTP Kernel.

```ts
class Kernel extends BaseKernel {
  // Global middleware
  protected middleware = [CorsMiddleware];

  // Group middleware
  protected middlewareGroups = {
    web: [StartSession],
  };

  // Route middleware
  protected routeMiddleware = {
    auth: AuthMiddleware,
    session: SessionMiddleware,
  };
}

export default Kernel;
```

### Global Middleware

This middleware runs on every request made. So if you want to include the CORS middleware, this is the appropriate place.

### Group Middleware

You can group two or more middlewares into one group and then assign this group name to some routes. For example, the `web` group middleware. See `app/Providers/RouteServiceProvider.ts` to see how to assign the `web` group middleware.

```ts
class RouteServiceProvider extends ServiceProvider {
  async register() {}
  async boot() {
    await Route.middleware("web") //<-- Here we assign the web group middleware to web-based routes.
      .group(base_path("routes/web"));
    await Route.prefix("/api").group(base_path("routes/api"));
  }
}
```

### Route Middleware

This is a key-value pair of middleware (aliasing middleware). Route middleware can be assigned to any routes.

```ts
Route.get("/someuri", () => "OK").middleware("auth");

// or group of routes
// remember group() method return Promise so we add await here
await Route.middleware("auth").group(() => {
  // All routes in this group will use the auth middleware
  Route.get("/someuri", () => "OK");
  Route.get("/another", () => "OK");
});
```

:::caution
The `Route.group` method is asynchronous, so make sure to `await` this method.
:::

The `Route.middleware` method can accept an array of middleware. So you can do something like this:

```ts
Route.get("/someurl", () => "OK").middleware(["auth", "admin"]);
```

## Middleware Params

The `handle` method of Middleware can have parameters. We can access them using the following example:

```ts
class ExampleMiddleware implements Middleware {
  async handle(req, next, param1, param2) {
    // Use the params here
    console.log(param1, param2);

    return next(req);
  }
}
```

In the above code, the `handle` method of the middleware accepts `param1` and `param2` as additional parameters.

Then, in the route, we can set the params after the middleware name followed by ":" as shown below:

```ts
Route.get("/example", () => "OK").middleware("example:param1,param2");
```

In the route definition above, the middleware named "example" is applied, and the values "param1" and "param2" are passed as parameters to the middleware.

:::note TODO
`Route.withoutMiddleware` method to exclude middleware on some routes.
:::
