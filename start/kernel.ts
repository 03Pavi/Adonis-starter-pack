/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register the middleware with the server
| or the router.
|
*/

import { checkDbConnection, sequelize } from '#config/database'
import RabbitProvider from '#providers/rabbit_provider'
import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([() => import('@adonisjs/core/bodyparser_middleware')])

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
export const middleware = router.named({})

/**
 * Import the RabbitMQ Provider
 */
const rabbitProvider = new RabbitProvider();

/**
 * Initialize the RabbitMQ Provider
 */
rabbitProvider.connect().catch(error => {
  console.error('Failed to connect to RabbitMQ:', error);
});

/**
 * Test the Sequelize connection
 */
await checkDbConnection()