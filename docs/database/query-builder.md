---
sidebar_position: 2
---

# Query Builder

## Introduction

Lunox's Query Builder is essentially inherited from Knex's Query Builder. Lunox wraps the Knex query builder into the `DB` facade, allowing it to be used anywhere in your application.

## Running the Query Builder

To start using the query builder, the `DB` facade provides the `table` method. This method returns the Knex Query Builder, so you can simply use `DB.table('table_name')` to access all the features of the Knex Query Builder.

```ts
import { DB } from "@lunoxjs/eloquent";

await DB.table("users")
  .join("contacts", "users.id", "=", "contacts.user_id")
  .select("users.id", "contacts.phone");
```

:::info
Please refer to the [Knex's Query Builder documentation](https://knexjs.org/guide/query-builder.html) for a complete list of query builder methods and features.
:::
