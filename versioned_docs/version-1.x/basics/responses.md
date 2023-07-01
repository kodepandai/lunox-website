---
sidebar_position: 5
---

# Http Responses
Everything returned from route action will automatically converted to http response. If return type is object or array, it will automatically have type of `application/json`;
```ts
// this will return json
Route.get('/', ()=>{
    return {
        success: true,
        data: {
            // ...some data
        }
    }
})

//this will return string
Route.get('/', ()=>{
    return 'Hello World';
})
```
## Response Facade
If you want to have full control of response, you can use `Response` facade.
```ts
import {Response} from 'lunox';

Route.get('/', ()=>{

    // Response.make(data: any, status: number, headers: object)
    return Response.make({
        success: true,
        data: {
            // some data
        }
    }, 201, {
        'Cache-Control': 'public, max-age=604800'
    });
})
```
### Attaching Headers to Response
Or you can add additional headers to current response
```ts
Response.make(data)
    .setHeader('key', 'value)
    .setHeader('anotherKey', 'anotherValue')
```

## Redirects
### Redirect Global Helper
Sometimes we want to redirect to another routes. This simply can be done with returning `redirect` helper.
```ts
Route.post('/login',()=>{
    return redirect('/dashboard');
})
```
`redirect` is global helper. It will return instance of `RedirectResponse`;
There is another global redirect helper `back`. This method will simply redirect back to previous url.
```ts
return back(); // return RedirectResponse to previous url
```

### Redirect with Flashed Data
`RedirectResponse` instance has method to inject flashed data. this data will be stored in session and will be deleted after redirect url visited.
```ts
redirect('someurl')->with({
    error: 'Some Error Message'
})
```
We can access flashed data via `req.session().get('key')`. So for above example, to access error flashed message we can access via `req.session().get('error')`

### Redirect with Input
You may use the `withInput` method provided by the `RedirectResponse` instance to flash the current request's input data to the session before redirecting the user to a new location. This is typically done if the user has encountered a validation error. Once the input has been flashed to the session, you may easily retrieve it during the next request to repopulate the form:
```ts
return back()->withInput();
```
To access old input we provide `old` method on session instance
```ts
req.session().old('username');
```

## View Response
If you need to return a view as the response's content, you should use the view method:
```ts
return view('view-name');
```
For more detail about lunox's view, we will discuss it later on `view` section.