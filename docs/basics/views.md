---
sidebar_position: 6
---

# Views

## Introduction

Views provide a convenient way to separate your HTML code into separate files. Views help separate your controller/application logic from your presentation logic and are stored in the `resources/view` directory. In Laravel, views use the `blade` templating engine. However, Lunox leverages the existing frontend frameworks available for Node.js, such as React and Svelte.

## Prerequisites

To use views in Lunox, you need to install `@lunoxjs/view` and the plugin for your chosen view engine.

```bash
pnpm add @lunoxjs/view

# For the svelte engine
pnpm add @lunoxjs/view-plugin-svelte
# For the react engine
pnpm add @lunoxjs/view-plugin-react
```

Alternatively, you can choose a preset with a view when creating a Lunox app using `pnpm create lunox-app`.

## Supported Template Engines

Currently, Lunox supports the following template engines:

| Engine | Example of Usage                                                              |
| ------ | ----------------------------------------------------------------------------- |
| Svelte | [Svelte preset](https://github.com/kodepandai/lunox/tree/next/presets/svelte) |
| React  | [React preset](https://github.com/kodepandai/lunox/tree/next/presets/react)   |

Feel free to suggest and vote for more template engines [here](https://github.com/kodepandai/lunox/discussions/23).

## Creating a View

Creating a view is simple. Just create a `svelte` file (`.tsx` or `.jsx` if you are using the React preset) inside the `resources/view` directory. For example, let's create a `welcome` view.

```html
<!-- resources/view/welcome.svelte -->
<h1>Hello World</h1>
```

Or, if you are using the React preset, create a React component:

```tsx
// resources/view/welcome.tsx
const Welcome = (props) => {
  return <h1>Hello World</h1>;
};
export default Welcome;
```

The Svelte and React file will be automatically converted to a native JavaScript file using the powerful [Vite.js](https://vitejs.dev/) build tool. During development, Vite.js supports Hot Module Replacement (HMR), so if you make changes to the view file, the browser will automatically refresh the content without a full page refresh.

To access the `welcome` view that we created, we can use the `view` global method.

```ts
Route.get("/", () => {
  return view("welcome");
});
```

### Nested Views

If your view is located in a nested folder, such as `resources/view/admin/manage-user.svelte`, you can access it using dot notation.

```ts
return view("admin.manage-user");
```

### Passing Data to a View

Similar to component props in React, Vue, or Svelte, you can pass data from the route (or controller) to the view using props.

```ts
return view("welcome", { message: "Hello World" });
```

Then, in the view file, the data will be available as component props.

Example using a Svelte component:

```ts
<script lang="ts">
    export let message;
</script>
<!-- Render the prop using curly braces -->
<h1>{message}</h1>
```

Example using a React component:

```tsx
const Welcome = ({ message }) => {
  return <h1>{message}</h1>;
};

export default Welcome;
```

### Accessing the HTTP Request from a View

You cannot directly access the server's HTTP request data in a view. To overcome this limitation, Lunox provides the `onServer` method to access the HTTP request instance. This method should be exported in the module context. The `onServer` method is similar to `getInitialProps` in the Next.js framework and only runs on the server side.

```ts
<script lang="ts" context="module">
    import type { OnServer } from '@lunoxjs/core/contracts';
    export const onServer: OnServer = async (req) => {
        // req is the HTTP request instance
        // Everything returned from this method will be injected into the component props
        return {
            user: await req.auth().user()
        };
    };
</script>

<script lang="ts">
    export let message;
    export let user; // Now we can access the user object returned from the onServer method
</script>

<h1>{message}</h1>
{#if user}
    <strong>Hi, {user.username}</strong>
{/if}
```

For the React preset, you can export the `onServer` constant within the component.

```tsx
import type { OnServer } from "@lunoxjs/core/contracts";

export const onServer: OnServer = async (req) => {
  // req is the HTTP request instance
  // Everything returned from this method will be injected into the component props
  return {
    user: await req.auth().user(),
  };
};

const Welcome = ({ message, user }) => {
  return (
    <>
      <h1>{message}</h1>
      {user && <strong>Hi, {user.username}</strong>}
    </>
  );
};

export default Welcome;
```

## Client Helper

The Lunox view also provides a client helper that you can use in your views. To use the client helper, you need to import the `csrf_token`, `old`, `session` functions from `@lunoxjs/view/client`.

```ts
import { csrf_token, old, session } from "@lunoxjs/view/client";
```

Once imported, you can use these helper functions anywhere in your view.

```ts
onMount(() => {
  // Show message from flashed session
  if (session("message")) {
    alert(session("message"));
  }
});
```

The `csrf_token()` function can be used to generate a CSRF token value that can be included in your form submission.

```html
<input type="hidden" name="_token" value="{csrf_token()}" />
```

The `old()` function can be used to retrieve the previous input value of a form field. This is useful when you want to repopulate the form with the user's previous input, especially when there are validation errors.

```jsx
<input
  type="text"
  name="user_name"
  placeholder="username or email"
  value={old("user_name")}
/>
```

By using these client helpers, you can enhance the functionality and user experience of your views in Lunox.
