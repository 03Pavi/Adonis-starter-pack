/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => "server is listening")
router.post('/create-user', '#controllers/users_controller.createUser')
router.get('/get-user/:id?', '#controllers/users_controller.getUser')
router.patch('/update-user/:id', '#controllers/users_controller.updateUser')
router.delete('/delete-user/:id', '#controllers/users_controller.deleteUser')

