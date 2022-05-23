---
sidebar_position: 3
---

# Controllers

## Introduction
Instead of defining all of your request handling logic as closures in your route files, you may wish to organize this behavior using `controller`.

## Writing Controllers
### Object Based Controller
Controller can be placed anywhere in your application project as long as it can be imported to router file. We can create controller using regular javascript object. Each controller key has value that work like router action.
Take a look this example
```ts
import type Request from "lunox/dist/Http/Request";

const WelcomeController = {
  home: async (req: Request) => {

    // we can get request data
    const something = req.get('something');
    // or we can get user session
    const user = await req.auth().user()

    // or do some complex logic 
    return {
        something
        user,
    };
  },
};

export default WelcomeController
```
### Class Based Controller
For more advance usage, we can create class based Controller. Just create class that extends lunox base Controller. See example below
```ts
import type { Request } from "lunox/dist/Http/Request";
import { Controller } from "lunox";

class WelcomeController extends Controller {
  async home(req: Request) {
    return view("home", {message: "Hello world"});
  }
}
```

:::tips
We can generate controller file using artisan `make:controller` command
```bash
# this will create class based controller
pnpm artisan make:controller ControllerName

# to create object based controller add --lite or -L option
pnpm artisan make:controller ControllerName -L
# or
pnpm artisan make:controller ControllerName --lite
```
:::

## Using Controller in Routes
After we create some controller, just import it to router.
```ts
import {Route} from 'lunox';
import WelcomeController from 'app/Http/Controllers/WelcomeController';

// example usage of object based controller
Route.get('home', WelcomeController.home);

// example usage of class based controller
Route.get('home', [WelcomeController, 'home']);

```

## Controller Middleware
Middleware may be assigned to the controller's routes in your route files:
```ts
Route.get('/profile', [UserController, 'show']).middleware('auth')
```
Or, you may find it convenient to specify middleware within your controller's constructor. Using the `middleware` method within your controller's constructor, you can assign middleware to the controller's actions:
```ts
class UserController extends Controller
{
  constructor(){
    super()
      this.middleware('auth');
      this.middleware('log').only('index');
      this.middleware('subscribed').except('store');
  }
}
```