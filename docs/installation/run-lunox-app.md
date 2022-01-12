---
sidebar_position: 2
---

# Run your Lunox App

We are already include simple scripts to run and build your lunox app. See `package.json` script part for more detail.
## Watch Lunox App in development
For development purpose, you can run and watch your Lunox App using this script
```bash
pnpm dev
```
It will create and watch files under `dist` directory and run your application on `localhost:8000` by default. Change default port on `.env` file
## Build for Production
For production, you must build your Lunox app first. Please run this script
```bash
pnpm build
```
Then you can serve the app using this command
```bash
pnpm serve
```