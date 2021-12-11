---
sidebar_position: 2
---

# Run your LunoX App

We are already include simple scripts to run and build your lunoX app. See `package.json` script part for more detail.
## Watch LunoX App in development
For development purpose, you can run and watch your LunoX App using this script
```bash
pnpm dev
```
It will create and watch files under `dist` directory and run your application on `localhost:8000` by default. Change default port on `.env` file
## Build for Production
For production, you must build your LunoX app first. Please run this script
```bash
pnpm build
```
Then you can serve the app using this command
```bash
pnpm serve
```