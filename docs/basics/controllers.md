---
sidebar_position: 3
---

# Controllers

## Introduction
Controller is just regular javascript object. Instead of defining all of your request handling logic as closures in your route files, you may wish to organize this behavior using `controller`. 

## Writing Controllers
Controller can be placed anywhere in your application project as long as it can be imported to router file.
Each controller key has value that work like router action.
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

## Using Controller in Routes
After we create some controller, just import it to router.
```ts
import {Route} from 'lunox';
import WelcomeController from 'app/Http/Controllers/WelcomeController';

Route.get('home', WelcomeController.home);

```
