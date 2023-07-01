---
sidebar_position: 5
---

# HTTP Responses

Every value returned from a route action will be automatically converted into an HTTP response. If the return type is an object or an array, it will be automatically set as the `application/json` response type.

```ts
// This will return JSON
Route.get("/", () => {
  return {
    success: true,
    data: {
      // ...some data
    },
  };
});

// This will return a string
Route.get("/", () => {
  return "Hello World";
});
```

## Response Facade

If you want to have full control over the response, you can use the `Response` facade.

```ts
import { Response } from "@lunoxjs/core/facades";

Route.get("/", () => {
  // Response.make(data: any, status: number, headers: object)
  return Response.make(
    {
      success: true,
      data: {
        // ...some data
      },
    },
    201,
    {
      "Cache-Control": "public, max-age=604800",
    }
  );
});
```

### Attaching Headers to Response

You can also add additional headers to the current response using the `setHeader` method.

```ts
Response.make(data)
  .setHeader("key", "value")
  .setHeader("anotherKey", "anotherValue");
```

## Redirects

### Redirect Global Helper

Sometimes you may want to redirect to another route. This can be done simply by returning the `redirect` helper.

```ts
Route.post("/login", () => {
  return redirect("/dashboard");
});
```

The `redirect` helper is a global function that returns an instance of `RedirectResponse`. There is another global redirect helper called `back`. This method simply redirects back to the previous URL.

```ts
return back(); // Returns a RedirectResponse to the previous URL
```

### Redirect with Flashed Data

The `RedirectResponse` instance has a method to inject flashed data. This data will be stored in the session and will be deleted after the redirect URL is visited.

```ts
redirect('someurl')->with({
    error: 'Some Error Message'
});
```

We can access flashed data using `req.session().get('key')`. So, for the example above, to access the flashed error message, we can use `req.session().get('error')`.

### Redirect with Input

You can use the `withInput` method provided by the `RedirectResponse` instance to flash the current request's input data to the session before redirecting the user to a new location. This is typically done if the user has encountered a validation error. Once the input has been flashed to the session, you can easily retrieve it during the next request to repopulate the form.

```ts
return back()->withInput();
```

To access the old input, we provide the `old` method on the session instance.

```ts
req.session().old("username");
```

## View Response

If you need to return a view as the response's content, you should use the `view` method.

```ts
return view("view-name");
```

We will discuss Lunox's view in more detail in the "Views" section.
