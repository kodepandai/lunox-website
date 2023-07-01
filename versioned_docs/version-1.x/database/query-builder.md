---
sidebar_position: 2
---

# Query Builder

## Introduction
Lunox's Query Builder basically is inherit from knex's Query Builder. Lunox wrap knex query builder into `DB` facade, so it can be used anywhere in your application.

## Running Query Builder
To start run query builder, `DB` facade has `table` method. This method return knex's Query Builder. So just type `DB.table('table_name')` and you can access all knex's Query Builder.
```ts
import {DB} from 'lunox';

await DB.table('users')
  .join('contacts', 'users.id', '=', 'contacts.user_id')
  .select('users.id', 'contacts.phone');
```

:::info
Please read [knex's Query Builder](https://knexjs.org/guide/query-builder.html) documentation for complete list of query builder.
:::