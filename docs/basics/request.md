---
sidebar_position: 4
---

# HTTP Request

## Introduction

Lunox HTTP Request is just a wrapper for Node.js HTTP requests. We have added some useful methods to this Request instance, such as `auth()`, `session()`, and `files()`.

## Accessing the Request

There are several places to access the Lunox HTTP Request instance:

1. In middleware;
2. In route actions; and
3. In the `onServer` method of views.
4. Using global `request()` helper.

### Accessing Request Instance in Middleware

You can access the request instance in the middleware's `handle` method. Here's an example:

```ts
const SomeMiddleware: Middleware = {
  async handle(req, next) {
    console.log(req); // instance of HTTP Request
  },
};
```

### Accessing Request Instance in Route Actions

Remember, the first parameter of a route action is always the request instance. Here's an example:

```ts
Route.get("/hello", (req: Request, id, message) => {
  console.log(req instanceof Request); // returns true
  return "OK";
});
```

### Accessing Request in Views

You can also access the request instance in view files by exporting an `onServer` method. We will discuss views in more detail later.

## Retrieving Input

### Retrieving All Input

You can get all incoming request input using the `all` method. It returns an object with key-value pairs representing the input data.

```ts
req.all(); // returns an object with key-value pairs
```

### Retrieving Single Input

You can access user input or query data sent to the server using the `get` method.

```ts
req.get("user_id");
```

### Retrieving a Portion of the Input Data

If you want to retrieve only a portion of the input data, you can use the `only` method, which accepts an array of strings representing the desired input fields.

```ts
req.only(["email", "password"]);
```

### Merging Additional Input

You can merge additional data into the current request input. If a key already exists in the current input, the last one provided will be used.

```ts
req.merge({
  name: "something",
});
```

## Files

### Accessing Form Data

Lunox automatically parses form data. You can access all uploaded files from the request using the `file` and `allFiles` methods.

```ts
// Access a single file
req.file("photo"); // returns an instance of the UploadedFile class

req.allFiles(); // returns an object with key-UploadedFile pairs
```

The result of the `file` method is an `UploadedFile` instance. This instance has some useful methods to access the uploaded file's properties.

```ts
const photo = req.file('photo');
photo.path(); // get the uploaded file's path
photo.move(directory: string, name?:string|null); // move the file to a specific directory
photo.getClientMimeType(); // get the client's MIME type
photo.getClientOriginalExtension(); // get the client's original file extension
photo.getClientOriginalName(); // get the client's original file name
```

We may add more useful methods in the future.
