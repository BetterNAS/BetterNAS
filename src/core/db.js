const _ = require('lodash')
const autoload = require('auto-load');
const Knex = require('knex');
const fs = require('fs');
const Objection = require('objection');
const path = require('path');
const Promise = require('bluebird')

const migrationSource = require('../db/migration-source')

module.exports = {
  Objection,
  knex: null,
  listener: null,
  init() {
    let self = this
    // Fetch DB Config

    let dbClient = null
    let dbConfig = (!_.isEmpty(process.env.DATABASE_URL)) ? process.env.DATABASE_URL : {
      host: BetterNAS.config.db.host.toString(),
      user: BetterNAS.config.db.user.toString(),
      password: BetterNAS.config.db.pass.toString(),
      database: BetterNAS.config.db.db.toString(),
      port: BetterNAS.config.db.port
    };

    // Engine-specific config
    switch (BetterNAS.config.db.type) {
      case 'postgres':
      case 'mariadb':
      case 'mysql':
        dbClient = 'mysql2'

        // Fix mysql boolean handling...
        dbConfig.typeCast = (field, next) => {
          if (field.type === 'TINY' && field.length === 1) {
            let value = field.string()
            return value ? (value === '1') : null
          }
          return next()
        }
        break;
      case 'mssql':
        dbClient = 'mssql'

        if (_.isPlainObject(dbConfig)) {
          dbConfig.appName = 'BetterNAS'
          _.set(dbConfig, 'options.appName', 'BetterNAS')

          dbConfig.enableArithAbort = true
          _.set(dbConfig, 'options.enableArithAbort', true)
        }
        break
      case 'sqlite':
        dbClient = 'sqlite3'
        dbConfig = {filename: BetterNAS.config.db.storage}
        break
      default:
        BetterNAS.logger.error('Invalid DB Type')
        process.exit(1)
    }

    // Initialize Knex
    this.knex = Knex({
      client: dbClient,
      useNullAsDefault: true,
      asyncStackTraces: BetterNAS.IS_DEBUG,
      connection: dbConfig,
      pool: {
        ...BetterNAS.config.pool,
        async afterCreate(conn, done) {
          // -> Set Connection App Name
          switch (BetterNAS.config.db.type) {
            case 'postgres':
              await conn.query(`set application_name = 'BetterNAS'`)
              // -> Set schema if it's not public
              if (BetterNAS.config.db.schema && BetterNAS.config.db.schema !== 'public') {
                await conn.query(`set search_path TO ${BetterNAS.config.db.schema}, public;`)
              }
              done()
              break
            case 'mysql':
              await conn.promise().query(`set autocommit = 1`)
              done()
              break
            default:
              done()
              break
          }
        }
      },
      debug: BetterNAS.IS_DEBUG
    })

    Objection.Model.knex(this.knex)

    const models = autoload(path.join(BetterNAS.SERVERPATH, 'models'))

    // Set init tasks
    let conAttempts = 0
    let initTasks = {
      // -> Attempt initial connection
      async connect () {
        try {
          BetterNAS.logger.info('Connecting to database...')
          await self.knex.raw('SELECT 1 + 1;')
          BetterNAS.logger.info('Database Connection Successful [ OK ]')
        } catch (err) {
          if (conAttempts < 10) {
            if (err.code) {
              BetterNAS.logger.error(`Database Connection Error: ${err.code} ${err.address}:${err.port}`)
            } else {
              BetterNAS.logger.error(`Database Connection Error: ${err.message}`)
            }
            BetterNAS.logger.warn(`Will retry in 3 seconds... [Attempt ${++conAttempts} of 10]`)
            await new Promise(resolve => setTimeout(resolve, 3000))
            await initTasks.connect()
          } else {
            throw err
          }
        }
      },
      // -> Migrate DB Schemas
      async syncSchemas () {
        return self.knex.migrate.latest({
          tableName: 'migrations',
          migrationSource
        })
      },
    }

    let initTasksQueue = (BetterNAS.IS_MASTER) ? [
      initTasks.connect,
      initTasks.syncSchemas
    ] : [
      () => { return Promise.resolve() }
    ]

    // Perform init tasks

    BetterNAS.logger.info(`Using database driver ${dbClient} for ${BetterNAS.config.db.type} [ OK ]`)
    this.onReady = Promise.each(initTasksQueue, t => t()).return(true)

    return {
      ...this,
      ...models
    }
  }
}