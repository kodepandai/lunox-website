---
sidebar_position: 7
---

# Session
## Introduction
Since HTTP driven applications are stateless, sessions provide a way to store information about the user across multiple requests. That user information is typically placed in a persistent store / backend that can be accessed from subsequent requests.

## Configuration
Your application's session configuration file is stored at `config/session.ts`. Be sure to review the options available to you in this file. For now, Lunox configured to use the `file` session driver, which will work well for many applications. We will support other session driver in the future. Session files are stored under `storeage/framework/sessions` folder. So make sure this folder is writable.

## Interacting With The Session
### Retrieving Data
There is only one way to access session, that is via `Http Request` instance. For now there is no global helper `session` like Laravel does because of how nodejs work. We still doing research of posibility to access Session and Http Request in global. Please see discussion [here](https://github.com/kodepandai/lunox/discussions/22). So for now, this is how we can access the session instance
```ts
// via route action
Route.get('/profile', (req: Request) => {
    req.session() // access session instance here
    req.session().all() // get all session object
    req.session().get('key') // Retrieve a piece of data from the session.
});

// or via controller method
class UserController extends Controller {
    profile(req){
        // access session instance here
        req.session()
        // ...etc
    }
}
```

### Storing Data
To store data in the session, use `put` method
```ts
req.session().put('key', 'value')
```

### Determining If An Item Exists In The Session
To determine if an item is present in the session, you may use the has method. The `has` method returns `true` if the item is present and is not `null`:
```ts
req.session().has('key')
```
To determine if an item is present in the session, even if its value is `null`, you may use the `exists` method:
```ts
req.session().exists('key')
```

### Deleting Data
The `forget` method will remove a piece of data from the session. If you would like to remove all data from the session, you may use the `flush` method:
```ts
req.session().forget(['key1', 'key2']) // Remove piece of data from session
req.sesson().flush() // Remove all data from session
```