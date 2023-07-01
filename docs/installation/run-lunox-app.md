---
sidebar_position: 2
---

# Run Your Lunox App

We have included simple scripts to help you run and build your Lunox app. Please refer to the `package.json` script section for more details.

## Watch Your Lunox App in Development

For development purposes, you can run and watch your Lunox app using the following script:

```bash
pnpm dev
```

This script will create and watch files under the `dist` directory and run your application on `localhost:8000` by default. You can change the default port in the `.env` file.

## Build for Production

To prepare your Lunox app for production, you need to build it first. Please run the following script:

```bash
pnpm build
```

Once the build is complete, you can serve the app using the following command:

```bash
pnpm serve
```
