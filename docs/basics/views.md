---
sidebar_position: 6
---

# Views
## Introduction
Views provide a convenient way to place all of our HTML in separate files. Views separate your controller / application logic from your presentation logic and are stored in the resources/views directory. Laravel views is using `blade` templating. But we don't want to develop new template engine. We are already on nodejs environment, there are many available frontend framework like `react`, `vue`, `svelte` and more. I just think, why we need another template engine in nodejs? For now, Lunox start to use `svelte` as template engine. Next we will try to support other framework.
## Create View
Creating view is simple, just create `svelte` file in `resources/views` directory. For example we want to create `welcome` view.
```html
<!-- resources/view/welcome.svelte -->
<h1>Hello World</h1>
```
This svelte file will automatically converted to native javascript file. Thanks to [vitejs](https://vitejs.dev/) for this powerfull magic. On development `vitejs` already support HMR mode. So if we change view file, the browser automatically refresh the content without refreshing it.

To access welcome view that we create earlier, we can use `view` global method.
```ts
Route.get('/', ()=>{
    return view('welcome');
})
```
### Nested View
If our view is located on nested folder, for example `resources/views/admin/manage-user.svelte`. We can access it by dot notation.
```ts
return view('admin.manage-user');
```
### Passing Data to View
If you know about component props in `react`, `vue`, or `svelte`. We can pass data from route (or Controller) to view via props.
```ts
return view('welcome', {message: 'Hello World'})
```
Then in svelte file, this data will be converted to svelte props and we can access it via `export let`
```ts
<script lang="ts">
    export let message
</script>
// we can render it using single curly brace
<h1>{message}</h1>
```

### Access Http Request from View
We cannot access server http request data directly on view. For this limitation, lunox provide `onServer` method to access http request instance. We must export this method on module context. `onServer` method is just like `getInitialProps` in `nextjs` framework and only run on server side;
```ts

<script lang="ts" context="module">
    import type {OnServer} from 'lunox';
    export const onServer:OnServer = async (req)=>{
        // req is http request instance
        // everything returned from this will be injected to svelte props
        return {
            user: await req.auth().user()
        }
    }
</script>

<script lang="ts">
    export let message
    export let user //now we can access user object returned from onServer method
</script>

<h1>{message}</h1>
{#if user}
    <strong>Hi, {user.username}</strong>
{/if}
```