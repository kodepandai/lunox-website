---
sidebar_position: 8
---

# Validation

## Introduction

Lunox has a built-in validation system that allows you to validate incoming data through HTTP requests in your application. The common way to perform validation is by using the `validate` method available on the HTTP request instance.

## Prerequisites

To use validation in Lunox, you need to install `@lunoxjs/validation` and register the `ValidationServiceProvider` in `config/app.ts`.

```
pnpm add @lunoxjs/validation
```

## Writing Validation Logic

Let's take an example where we have a method on a controller and we want to validate the incoming request data. Note that the `validate` method is asynchronous.

```ts
class UserController extends Controller {
    async store(req) {
        await req.validate([
            'title' => 'required|unique:posts,title|maxLength:255',
            'body' => 'required'
        ]);
    }
}
```

When validation fails, a `ValidationException` will be thrown.

## Validation Rules

Under the hood, `@lunoxjs/validation` uses [node-input-validator](https://github.com/bitnbytesio/node-input-validator). Therefore, you can use all the available rules mentioned [here](https://github.com/bitnbytesio/node-input-validator#rules), along with additional rules like `unique` and `mimes`.

## Extending Rules

### Writing Custom Rules

A rule is just an object that implements the `Rule` interface.

```ts
import type { Rule } from "@lunoxjs/validation";

const Even: Rule = {
  name: "even",
  passes: async (args, value) => {
    return value % 2 === 0;
  },
  message: "The :attr must be an even number.",
};

export default Even;
```

### Registering Custom Rules

You can extend the validation rules by using the `extend` method from the `Validator` facade in the `boot` method of your service provider.

```ts
import { Validator } from "@lunoxjs/validation";
import Even from "./Rules/Even";
import Mimes from "./Rules/Mimes";

class AppServiceProvider extends ServiceProvider {
  async register() {
    //
  }

  async boot() {
    Validator.extend(Even);
  }
}
```

After registering the custom rule, you can use it in your validation.

```ts
await req.validate([
    'total' => 'required|even'
]);
```
