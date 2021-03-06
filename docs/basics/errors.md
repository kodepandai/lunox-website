---
sidebar_position: 9
---

# Error Handling
## Introduction
Error and Exception handling is already  configured by Lunox. The `app/Exceptions/Handler.ts` file is where all exceptions thrown by your application and then reported and rendered to the user.

## Configuration
By default the `APP_DEBUG` environment variable is set to `true`, this is usefull for local development where you can see the error information more detail. In your production environment, this value should always be `false`.

## The Exception Handler
### Reporting Exception
All exceptions are handled by the `app/Exceptions/Handler` class. This class contains a `register` method where you may register custom exception reporting and rendering callbacks. Exception reporting is used to log exceptions. We may use the `reportable` method to register a closure that should be executed when an exception of a given type needs to be reported.
```ts
import ApiException from "app/Exceptions/ApiException";

register(){
    this.reportable(ApiException, (e) => {
      if (e.status >= 500) {
        console.log("API Error", e);
      }
    });
}
```
### Ignoring Exceptions By Type
When building your application, there will be some types of exceptions you simply want to ignore and never report. Your application's exception handler contains a `dontReport` property which is initialized to an empty array. Any classes that you add to this property will never be reported; however, they may still have custom rendering logic:
```ts
import InvalidOrderException from 'app/Exceptions/InvalidOrderException';

protected dontReport = [
    InvalidOrderException
]
```
:::note
Behind the scenes, Lunox already ignores some types of errors for you, such as exceptions resulting from 404 HTTP "not found" errors or 419 HTTP responses generated by invalid CSRF tokens.
:::

### Rendering Exception
You are free to register a custom rendering closure for exceptions of a given type. You may accomplish this via the `renderable` method of your exception handler. This closure should return instance of `Http Response` or `view Factory`.
```ts
import {ValidationException, HttpException} from 'lunox';

register(){
    this.renderable(ValidationException, (e, req) => {
      if (req.wantsJson()) {
        return Response.make(
          {
            message: e.message,
            errors: e.errors(),
            status: 422,
          },
          422
        );
      }

      return back().withInput().with({
        errors: e.errors(),
      });
    });

    this.renderable(HttpException, (e, req) => {
      if (req.wantsJson()) {
        return Response.make(
          {
            message: e.message,
            status: e.getStatusCode(),
          },
          e.getStatusCode()
        );
      }
      return view("_error", { message: e.message, code: e.getStatusCode() });
    });
}
```

### Http Exceptions
Some exceptions describe HTTP error codes from the server. For example, this may be a "page not found" error (404), an "unauthorized error" (401) or even a developer generated 500 error. In order to generate such a response from anywhere in your application, you may use the `abort` helper:
```ts
abort(404);
```

