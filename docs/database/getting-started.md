---
sidebar_position: 1
---

# Getting Started

## Introduction

You can use any third-party database manager, but Lunox already ships with a built-in database manager. Lunox makes interacting with the database simple. Under the hood, Lunox's database manager uses [knex](http://knexjs.org/), so you can refer to the official documentation for a complete Knex API reference. Lunox wraps `knex` into the `DB` facade. We have also integrated it with the Artisan command, so you can create migrations, seeders, and run/rollback migrations using the Artisan command. We will discuss this later.

## Prerequisites

To use the database, you need to install `@lunoxjs/eloquent` and register the `DatabaseServiceProvider` in your `config/app.ts` file.

```
pnpm add @lunoxjs/eloquent
```

### Configuration

The configuration for Lunox's database services is located in your application's `config/database.ts` configuration file. In this file, you can define all of your database connections and specify which connection should be used by default. Most of the configuration options within this file are driven by the values of your application's environment variables. Examples for most of Lunox's supported database systems are provided in this file.

Currently, Lunox only supports the following drivers:

- `mysql` and `mariadb`. Please install `mysql` as a dependency.
- `postgresql`. Please install `pg` as a dependency.
- `sqlite`. Please install `sqlite3` as a dependency.

## Running SQL Queries

Once you have configured your database connection, you can run queries using the `DB` facade. The `DB` facade provides the `table` method to initialize a query.

:::note
Note that all queries run asynchronously.
:::

### Running a Select Query

#### Basic Select Query

To run a basic `SELECT` query, you can use the `select` method on the `DB` facade:

```ts
import { DB } from "@lunoxjs/eloquent";

// Select all rows from the `users` table.
await DB.table("users");

// Select only specific columns.
await DB.table("users").select("id", "email", "user_name");
```

#### Select with Condition

Use the `where` method to add a `WHERE` clause to the query.

```ts
await DB.table("users").where("email", "foo@example.com");

// Multiple conditions using an object.
await DB.table("users").where({
  email: "foo@example.com",
  active: 1,
});

// Chainable where.
await DB.table("users").where("email", "foo@example.com").where("active", 1);
```

> **Note**: For a complete guide on using the `where` clause, see the [Knex's where clauses](https://knexjs.org/guide/query-builder.html#where-clauses) documentation.

#### Return the First Row of Selected Data

Use the `first` method to return only the first row.

```ts
await DB.table("users").where("email", "foo@example.com").first();
```

### Running an Insert Statement

To execute an insert statement, you can use the `insert` method on the `DB` facade.

```ts
// Insert into the `users` table.
await DB.table("users").insert({
  email: "foo@example.com",
  user_name: "exampleuser",
  first_name: "foo",
  last_name: "bar",
});
```

> **Note**: For a complete guide on the insert statement, please read the [Knex's insert documentation](https://knexjs.org/guide

/query-builder.html#insert).

### Running an Update Statement

The `update` method should be used to update existing records in the database.

```ts
await DB.table("users").where("id", 24).update("active", 0);
```

> **Note**: For a complete guide on the update statement, please read the [Knex's update documentation](https://knexjs.org/guide/query-builder.html#update).

### Running a Delete Statement

The `delete` method should be used to delete records from the database.

```ts
await DB.table("users").where("active", 0).delete();
```

## Database Transaction

You can use the `transaction` method provided by the `DB` facade to run a set of operations within a database transaction. If an exception is thrown within the transaction closure, the transaction will automatically be rolled back and the exception will be re-thrown. If the closure executes successfully, the transaction will automatically be committed. You don't need to worry about manually rolling back or committing when using the `transaction` method.

Transactions are handled by passing a handler function into `DB.transaction`. The handler function accepts a single argument, an object that can be used in two ways:

### As a Query Builder

```ts
try {
  await DB.transaction(async (trx) => {
    // Using `trx` as a query builder.
    const userIds = await trx("users").insert({
      email: "foo@mail.com",
    });

    await trx("books").insert({
      user_id: userIds[0],
      name: "Lunox Documentation",
    });
  });
} catch (error) {
  // If we get here, it means that neither the 'user' nor the 'book' are inserted.
  console.log(error);
  abort(400, "cannot insert into the database");
}
```

### As an Object Passed into a Query

```ts
try {
  await DB.transaction(async (trx) => {
    // Using `trx` as a query builder.
    const userIds = await DB.table("users")
      .insert({
        email: "foo@mail.com",
      })
      .transacting(trx);

    await DB.table("books")
      .insert({
        user_id: userIds[0],
        name: "Lunox Documentation",
      })
      .transacting(trx);
  });
} catch (error) {
  // If we get here, it means that neither the 'user' nor the 'book' are inserted.
  console.log(error);
  abort(400, "cannot insert into the database");
}
```

> **Note**: Please refer to the [Knex's transaction documentation](https://knexjs.org/guide/transactions.html) for more details.
