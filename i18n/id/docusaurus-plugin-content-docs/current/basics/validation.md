---
sidebar_position: 8
---

# Validation
## Introduction
Lunox has builtin validation system, it's can validate your applicatoin's incoming data through Http Request. The common way is using `validate` method available on Http Request instance.

## Writing Validation Logic
Take an example, we have some method on Controller. We want to validate the incoming request data to it. Note that `validate` method is asynchronous.
```ts
class UserController extends Controller {
    async store(req){
        await req.validate([
            'title' => 'required|unique:posts,title|maxLength:255'.
            'body' => 'required'
        ])
    }
}
```
When validation fails, `ValidationException` will thrown.

## Validation Rules
Under the hood, Lunox use [node-input-validator](https://github.com/bitnbytesio/node-input-validator). So, we can use all available rules [here](https://github.com/bitnbytesio/node-input-validator#rules) plus additional rule like `unique` and `mimes`.

## Extending Rules
### Writing Custom Rules
Rule is just object with interface of `Rule` from Validation contracts.
```ts
import type { Rule } from "lunox/dist/Contracts/Validation";

const Even: Rule = {
  name: "even",
  passes: async (args, value) => {
    return value % 2;
  },
  message: "The :attr must be an even number.",
};

export default Even;

```
### Registering Custom Rules
We can extend validation rules using method `extend` from `Validation` facade on `boot` method of ServiceProvider.
```ts
import {Validator} from "lunox";
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

Then we can use it in our validation
```ts
await req.validate([
    'total' => 'required|even'
]);
```
