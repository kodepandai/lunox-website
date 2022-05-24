---
sidebar_position: 1
---

# Create Lunox App
Use degit to copy Lunox app skeleton and start build your application with Lunox Framework.
```bash
# init lunox project
npx degit kodepandai/lunox my-lunox-app

# install the dependencies
cd my-lunox-app
pnpm install
```
:::note
for react preset replace first command with this
```
npx degit kodepandai/lunox#react my-lunox-app
```
:::
Copy environment example file
```bash
cp .env.example .env
```
Compile the project for the first time, this is required for us to use artisan command.
```bash
pnpm build
```
Generate key for first time using artisan command
```bash
pnpm artisan key:generate
```
Done, you are ready to use Lunox framework :smiley:
