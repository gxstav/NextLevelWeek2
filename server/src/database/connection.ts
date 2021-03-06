import knex from 'knex'
import path from 'path'

const database = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite')
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname)
  }
})

export default database;