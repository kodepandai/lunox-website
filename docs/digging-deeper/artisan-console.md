---
sidebar_position: 1
---

# Artisan Console

## Introduction

Artisan is the command-line interface included with Lunox. Artisan exists at the root of your application as the `artisan.ts` script and provides a number of helpful commands that can assist you while you build your application. To view a list of all available Artisan commands, you may use the `list` command:

```
pnpm artisan -h
```

:::note
The Lunox app must be compiled before you can run Artisan commands. So make sure you have run `pnpm artisan prod` in production mode or `pnpm artisan dev` in development mode.
:::

### Tinker (REPL)

Lunox Tinker is a powerful REPL for the Lunox framework, powered by the Node.js built-in REPL.

#### Usage

Tinker allows you to interact with your entire Lunox application on the command line, including your models, facade, container, and more. To enter the Tinker environment, run the `tinker` Artisan command:

```
pnpm artisan tinker
```

#### Tinker Helper

There is a limitation in the Tinker environment because the Node.js REPL cannot perform top-level imports. For this reason, Lunox Tinker already ships with a useful helper. Just call the `use` method to import a module from the app folder or directly from the Lunox framework.

```js
// Example of how to import a module from the app folder
use("app/Model/User");

await User.query();

// Example of how to import a Lunox module
use("DB");

await DB.table("users");
```

![Lunox Tinker demo](/img/tutorial/tinker.gif)

## Writing Commands

In addition to the commands provided with Artisan, you may build your own custom commands. Commands are stored in the `app/Console/Commands` directory.

### Generating Commands

To create a new command, you may use the `make:command` Artisan command. This command will create a new command class in the `app/Console/Commands` directory.

```bash
pnpm artisan make:command BackupDatabase
```

### Command Structure

After generating your command, you should define appropriate values for the `signature` and `description` properties of the class. These properties will be used when displaying your command on the list screen. The `signature` property also allows you to define your command's input expectations. The `handle` method will be called when your command is executed. You may place your command logic in this method.

```ts
import { Command } from "@lunoxjs/core/console";

class BackupDatabase extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature: string = "db:backup";

  /**
   * The console command description.
   */
  protected description: string = "Backup Database to drive";

  /**
   * Execute the console command.
   */
  public async handle() {
    this.info("Starting database backup...");
    // Perform backup here
    this.info("Backup completed");
    return this.SUCCESS;
  }
}

export default BackupDatabase;
```

:::note
The `handle` method should return the `SUCCESS`, `FAILURE`, `INVALID`, or `KEEPALIVE` constant. `KEEPALIVE` is useful when your command should run forever, for example when making a command to run a scheduler or cron job.
:::

## Defining Input Expectations

When writing console commands, it is common to gather input from the user through arguments or options. Lunox makes it very convenient to define the input you expect from the user using the `signature` property on your commands. The `signature` property allows you to define the name, arguments, and options for the command in a single, expressive, route-like syntax.

### Arguments

All user-supplied arguments and options are wrapped in curly braces. In the following example, the command defines one required argument: `user`.

```ts
protected signature: string = "mail:send {user}";
```

You may also make arguments optional or define default values for arguments:

```ts
// Optional argument...
"mail:send {user?}";

// Optional argument with default value...
"mail:send {user=foo}";
```

### Options

Options, like arguments, are another form of user input. Options are prefixed by two or one hyphens (`--` or `-`) when they are provided via the command line. There are two types of options: those that receive a value and those that don't. Options that don't receive a value serve as a boolean "switch". Let's take a look at an example of this type of option:

```ts
/**
 * The name and signature of the console command.
 */
protected signature: string = 'mail:send {user} {--queue}';
```

In this example, the `--queue` switch may be specified when calling the Artisan command. If the `--queue` switch is passed, the value of the option will be `true`. Otherwise, the value will be `false`.

```bash
pnpm artisan mail:send 1 --queue
```

### Options With Values

Next, let's take a look at an option that expects a value. If the user must specify a value for an option, you should suffix the option name with a `=` sign:

```ts
/**
 * The name and signature of the console command.
 */
protected signature: string = 'mail:send {user} {--queue=}';
```

In this example, the user may pass a value for the option like so. If the option is not specified when invoking the command, its value will be `undefined`:

```bash
pnpm artisan mail:send 1 --queue=default
```

You may assign default values to options by specifying the default value after the option name. If no option value is passed by the user, the default value will be used:

```ts
"mail:send {user} {--queue=default}";
```

### Option Shortcut

To assign a shortcut when defining an option, you may specify it before the option name and use the `|` character as a delimiter to separate the shortcut from the full option name:

```ts
"mail:send {user} {--Q|queue}";
```

When invoking the command on your terminal, option shortcuts should be prefixed with a single hyphen:

```bash
pnpm artisan mail:send 1 -Q
```

### Input Descriptions

You may assign descriptions to input arguments and options by separating the argument name from the description using a colon. If you need a little extra room to define your command, feel free to spread the definition across multiple lines:

```ts
/**
 * The name and signature of the console command.
 */
protected signature: string = `mail:send
                        {user : The ID of the user}
                        {--queue : Whether the job should be queued}`;
```

## Command I/O

### Retrieving Input

While your command is executing, you will likely need to access the values for the arguments and options accepted by your command. To do so, you may use the `argument` and `option` methods. If an `argument` or `option` does not exist, `undefined` will be returned:

```ts
public handle() {
   const userId = this.argument('user');
}
```

If you need to retrieve all of the arguments as an `object`, call the `arguments` method:

```ts
const arguments = this.arguments();
```

Options may be retrieved just as easily as arguments using the `option` method. To retrieve all of the options as an `object`, call the `options` method:

```ts
// Retrieve a specific option...
const queueName = this.option("queue");

// Retrieve all options as an array...
const options = this.options();
```

### Writing Output

To send output to the console, you may use the `line`, `newLine`, `info`, `comment`, and `error` methods. Each of these methods will use appropriate ANSI colors for their purpose. For example, let's display some general information to the user. Typically, the `info` method will display in the console as green-colored text:

```ts
this.info("Job Completed");
```

To display an error message, use the `error` method. Error message text is typically displayed in red:

```ts
this.error("Something went wrong!");
```

You may use the `line` method to display plain, uncolored text:

```ts
this.line("Display this on the screen");
```

You may use the `newLine` method to display a blank line:

```ts
// Write a single blank line...
this.newLine();

// Write three blank lines...
this.newLine(3);
```

## Registering Commands

All of your console commands are registered within your application's `app/Console/Kernel` class, which is your application's "console kernel." Within the `commands` method of this class, you will see a call to the kernel's `load` method. The `load` method will scan the `app/Console/Commands` directory and automatically register each command it contains with Artisan. You are even free to make additional calls to the `load` method to scan other directories for Artisan commands:

```ts
/**
 * Register the commands for the application.
 */
protected async commands() {
    await this.load(base_path("app/Console/Command"));
    await this.load(base_path("app/Modules/Order/Command"));

    // ...
}
```

Commands can also be registered in a `ServiceProvider` using the `commands` method. Make sure to run this method in the `register` function so that Artisan can register the commands.

```ts
class DatabaseServiceProvider extends ServiceProvider {
  public async register() {
    // register artisan commands
    this.commands([
      MakeMigrationCommand,
      MakeModelCommand,
      MakeSeederCommand,
      RefreshMigrationCommand,
      ResetMigrationCommand,
      RollbackMigrationCommand,
      RunMigrationCommand,
      RunSeederCommand,
    ]);
  }
}
```

These are the guidelines for defining custom commands, input expectations, and command I/O using the Artisan console in the Lunox framework.
