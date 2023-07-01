---
sidebar_position: 7
---

# Session

## Introduction

Since HTTP-driven applications are stateless, sessions provide a way to store information about the user across multiple requests. This user information is typically stored in a persistent store or backend that can be accessed in subsequent requests.

## Prerequisites

To access the session in Lunox, you need to install `@lunoxjs/session` and register the `SessionServiceProvider` in `config/app.ts`.

```
pnpm add @lunoxjs/session
```

## Configuration

Your application's session configuration file is located at `config/session.ts`. Make sure to review the available options in this file. Currently, Lunox is configured to use the `file` session driver, which works well for many applications. We will support other session drivers in the future. Session files are stored under the `storage/framework/sessions` folder, so ensure that this folder is writable.

## Interacting With the Session

### Retrieving Data

The only way to access the session in Lunox is through the `HttpRequest` instance. For global access, you can use `request().session()`.

```ts
// Via route action
Route.get("/profile", (req: Request) => {
  req.session(); // Access the session instance here
  req.session().all(); // Get all session data
  req.session().get("key"); // Retrieve a piece of data from the session
});

// Or via a controller method
class UserController extends Controller {
  profile(req) {
    // Access the session instance here
    req.session();
    // ...etc
  }
}

// via global request() helper
request().session();
```

### Storing Data

To store data in the session, use the `put` method:

```ts
req.session().put("key", "value");
```

### Determining If an Item Exists in the Session

To check if an item is present in the session, you can use the `has` method. It returns `true` if the item is present and not `null`:

```ts
req.session().has("key");
```

To determine if an item exists in the session, even if its value is `null`, use the `exists` method:

```ts
req.session().exists("key");
```

### Deleting Data

The `forget` method removes a piece of data from the session. If you want to remove all data from the session, use the `flush` method:

```ts
req.session().forget(["key1", "key2"]); // Remove a piece of data from the session
req.session().flush(); // Remove all data from the session
```
