/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import Route from '@adonisjs/core/services/router'
Route.post('/rabbit/produce', '#controllers/rabbitMQ.produce');
Route.get('/rabbit/consume', '#controllers/rabbitMQ.consume');