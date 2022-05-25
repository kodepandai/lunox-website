---
sidebar_position: 4
---

# Http Request

## Introduction
Lunox Http Request is just wrapper for NodeJs http requests. We add some usefull methods on this Request instance, such as `auth(), session(), and files()`
## Accessing Request
The are three place to access Lunox Http Request instance.
1. In middleware;
2. In Route action; and
3. In `onServer` view method
### Access Request Instance on Middleware
We can access request instance on middleware's `handle` method.
```ts

const SomeMiddleware: Middleware = {
    async handle(req, next){
        console.log(req) // instance of Http Request
    }
}

```
### Access Request Instance from Route Action
Remember, first parameter of route action is always `request` instance;
```ts
Route.get('/hello', (req: Request, id, message) =>{
  console.log(req instanceof Request) // return true
  return 'OK';
})
```

### Access Request on View
We also can access request instance on view file via exporting `onServer` method. We will discuss about view later.

## Retrieving Input
### Retrieving All Input
You can get all incoming request input using `all` method.
```ts
req.all() // return object with key - value pair.
```
### Retrieving Single Input
We can access user input or query was sent to server using `get` method.
```ts
req.get('user_id');
```
### Retrieving a Portion of the Input Data
If you want to get only portion of input data, we already shipped `only` method that accept array of string.
```ts
req.only(['email', 'password']);

```
### Merging Additional Input
You can merge additional data to current request input. If the key is same as current available input, the last one is used.
```ts
req.merge({
  name: 'something'
})
```

## Files
### Access Form Data
Lunox is auto parsing form data. We can access all files from request using `file` and `allFiles` method;
```ts
// access single file
req.file('photo') // return instance of UploadedFile instance
req.allFiles() // return object with key - UploadedFile pair
```
The result of `file` method is `UploadedFile` instance. This instance has some usefull method to access uploaded file property
```ts
const photo = req.file('photo')
photo.path() // get uploaded path
photo.move(directory: string, name?:string|null) // move file to some directory
photo.getClientMimeType() // get client mime type
photo.getClientOriginalExtension() // get client original extension
photo.getClientOriginalName() // get client original name
```
We will add another usefull method later

