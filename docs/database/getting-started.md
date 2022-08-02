---
sidebar_position: 1
---

# Getting Started

## Introduction
You can use any third party database manager, but lunox already shipped builtin database manager. Lunox makes interacting with database simple. Under the hood, lunox database manager is using [knex](http://knexjs.org/), so you can read the official documentation for complete knex's API reference. Lunox wrap `knex` into `DB` facade. We also integrate it to artisan command. So we can create migration, seeder, run and rollback migration using artisan command. We will discuss it later.

### Configuration
The configuration for Lunox's database services is located in your application's `config/database.ts` configuraiton file. In this file, you may define all of your database connections, as well as specify which connection should be used by default. Most of the configuration options within this file are driven by the values of your application's environment variables. Examples for most of Lunox's supported database systems are provided in this file.

For now Lunox only support these drivers:
- `mysql` and `mariadb`, please install `mysql` as dependency.
- `postgresql`, please install `pg` as dependency.
- `sqlite`, please install `sqlite3` as dependency.

## Running SQL Queries
Once you have configured your database connection, you may run queries using the `DB` facade. The `DB` facade provides `table` method to initialize query. 
:::note
Note that all query running asyncronously.
:::

### Running A Select Query

#### Basic Select Query
To run a basic `SELECT` query, you may use the `select` method on the `DB` facade:
```ts
import {DB} from "lunox";

// select all row from table `users`.
await DB.table('users');

// select only some columns.
await DB.table('users').select('id', 'email', 'user_name');
```

#### Select With Condition
Use `where` method to add `WHERE` clause in query.
```ts
await DB.table('users').where('email', 'foo@example.com');

// multiple condition using object
await DB.table('users').where({
 email: 'foo@example.com',
 active: 1
})

// chainable where
await DB.table('users')
  .where('email', 'foo@example.com')
  .where('active', 1)
```

>**note**: for complete guide about where clause, see [knex`s where clauses](https://knexjs.org/guide/query-builder.html#where-clauses) documentation.

#### Return First Row of Selected Data
Use `first` method to return only first row.
```ts
await DB.table('users').where('email', 'foo@example.com').first();
```

### Running An Insert Statement
To execute an insert statement, you may use the `insert` method on the `DB` facade.
```ts

// insert into table users
await DB.table('users').insert({
  email: 'foo@example.com',
  user_name: 'exampleuser',
  first_name: 'foo',
  last_name: 'bar'
});
```
>**note**: for complete guide about insert statement, please read [knex`s insert documentation](https://knexjs.org/guide/query-builder.html#insert)

### Running An Update Statement
The `update` method should be used to update existing records in the database.
```ts
await DB.table('users')
  .where('id', 24)
  .update('active', 0);
```

>**note**: for complete guide about update statement, please read [knex`s update documentation](https://knexjs.org/guide/query-builder.html#update)

### Running A Delete Statement
The `delete` method should be used to delete records from the database.
```ts
await DB.table('users')
  .where('active', 0)
  .delete();
```

## Database Transaction
You may use the `transaction` method provided by the `DB` facade to run a set of operations within a database transaction. If an exception is thrown within the transaction closure, the transaction will automatically be rolled back and the exception is re-thrown. If the closure executes successfully, the transaction will automatically be committed. You don't need to worry about manually rolling back or committing while using the `transaction` method.

Transactions are handled by passing a handler function into `DB.transaction`. The handler function accepts a single argument, an object which may be used in two ways:
### As A Query Builder
```ts
try {
 await DB.transaction(async(trx)=>{
   // using trx as query builder
   const userIds = await trx('users').insert({
    email: 'foo@mail.com'
   })
 
   await trx('books').insert({
    user_id: userIds[0],
    name: 'Lunox Documentation'
   });
 })
} catch(error){
  // If we get here, that means that neither the 'user' and 'book' are inserted,
  console.log(error)
  abort(400, 'cannot insert to database');
}
```
### As An Object Passed Into A Query
```ts
try {
 await DB.transaction(async(trx)=>{
   // using trx as query builder
   const userIds = await DB.table('users').insert({
    email: 'foo@mail.com'
   })
   .transacting(trx)
 
   await DB.table('books').insert({
    user_id: userIds[0],
    name: 'Lunox Documentation'
   })
   .transacting(trx)
 })
} catch(error){
  // If we get here, that means that neither the 'user' and 'book' are inserted,
  console.log(error)
  abort(400, 'cannot insert to database');
}
```
>**note**: please read [knex's transaction documentation](https://knexjs.org/guide/transactions.html) for more detail