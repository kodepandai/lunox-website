---
sidebar_position: 3
---

# Controllers

## Introduction

Instead of defining all of your request handling logic as closures in your route files, you may wish to organize this behavior using **controllers**.

## Writing Controllers

### Object-Based Controller

Controllers can be placed anywhere in your application project as long as they can be imported into the router file. You can create a controller using a regular JavaScript object. Each controller key has a value that works like a router action. Here's an example:

```ts
import type { Request } from "@lunoxjs/core";

const WelcomeController = {
  home: async (req: Request) => {
    // Access request data
    const something = req.get("something");

    // Access user session
    const user = await req.auth().user();

    // Perform complex logic
    return {
      something,
      user,
    };
  },
};

export default WelcomeController;
```

### Class-Based Controller

For more advanced usage, you can create a class-based controller. Just create a class that extends the Lunox base `Controller` class. Here's an example:

```ts
import { Request, Controller } from "@lunoxjs/core";

class WelcomeController extends Controller {
  async home(req: Request) {
    return view("home", { message: "Hello world" });
  }
}
```

:::tip
You can generate a controller file using the `artisan make:controller` command:

```bash
# This will create a class-based controller
pnpm artisan make:controller ControllerName

# To create an object-based controller, add the --lite or -L option
pnpm artisan make:controller ControllerName -L
# or
pnpm artisan make:controller ControllerName --lite
```

:::

## Using Controllers in Routes

After creating a controller, you can import it into the router and use it in your routes. Here's an example:

```ts
import { Route } from "@lunoxjs/core/facades";
import WelcomeController from "app/Http/Controllers/WelcomeController";

// Example usage of object-based controller
Route.get("home", WelcomeController.home);

// Example usage of class-based controller
Route.get("home", [WelcomeController, "home"]);
```

## Controller Middleware

Middleware can be assigned to the controller's routes in your route files:

```ts
Route.get("/profile", [UserController, "show"]).middleware("auth");
```

Alternatively, you can specify middleware within your controller's constructor. Using the `middleware` method within your controller's constructor, you can assign middleware to the controller's actions:

```ts
class UserController extends Controller {
  constructor() {
    super();
    this.middleware("auth");
    this.middleware("log").only("index");
    this.middleware("subscribed").except("store");
  }
}
```
